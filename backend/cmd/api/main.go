package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/health-tech/backend/internal/delivery/http/handler"
	"github.com/health-tech/backend/internal/delivery/http/router"
	"github.com/health-tech/backend/internal/infrastructure/cache"
	"github.com/health-tech/backend/internal/infrastructure/db"
	"github.com/health-tech/backend/internal/infrastructure/zoom"
	"github.com/health-tech/backend/internal/usecase/appointment"
	"github.com/health-tech/backend/internal/usecase/auth"
	"github.com/health-tech/backend/internal/usecase/clinical_service"
	"github.com/health-tech/backend/internal/usecase/meeting"
	"github.com/health-tech/backend/internal/usecase/specialist"
	"github.com/health-tech/backend/internal/usecase/transaction"
	"github.com/health-tech/backend/pkg/jwt"
	"github.com/health-tech/backend/pkg/logger"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	databaseURL := os.Getenv("DATABASE_URL")
	redisURL := os.Getenv("REDIS_URL")
	redisAddr := os.Getenv("REDIS_ADDR")
	redisUsername := os.Getenv("REDIS_USERNAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisNamespace := os.Getenv("REDIS_NAMESPACE")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "medpulse-super-secret-jwt-key-2026-production"
	}

	zoomSDKKey := os.Getenv("ZOOM_SDK_KEY")
	zoomSDKSecret := os.Getenv("ZOOM_SDK_SECRET")

	logger.Info("Starting MedPulse HealthTech Backend on port %s...", port)

	// 1. Infrastructure: Database (PostgreSQL URL)
	supabaseDB, err := db.NewSupabaseDB(databaseURL)
	if err != nil {
		logger.Error("Failed to initialize database: %v", err)
	}

	// Repository adapters
	userRepo := supabaseDB
	specialistRepo := db.NewSpecialistRepoAdapter(supabaseDB)
	serviceRepo := db.NewClinicalServiceRepoAdapter(supabaseDB)
	appointmentRepo := db.NewAppointmentRepoAdapter(supabaseDB)
	transactionRepo := db.NewTransactionRepoAdapter(supabaseDB)

	// 2. Infrastructure: Redis Cloud Cache with namespacing
	var cacheClient cache.Cache
	rCache, err := cache.NewRedisCache(cache.RedisConfig{
		URL:       redisURL,
		Addr:      redisAddr,
		Username:  redisUsername,
		Password:  redisPassword,
		Namespace: redisNamespace,
	})
	if err == nil {
		cacheClient = rCache
		logger.Info("Connected to Redis Cloud at %s (namespace: %s)", redisAddr, redisNamespace)
	} else {
		logger.Error("Redis Cloud connect error (%v), falling back to namespaced memory cache", err)
		cacheClient = cache.NewMemoryCache(redisNamespace)
	}

	// 3. Infrastructure: Zoom SDK Service
	zoomService := zoom.NewService(zoomSDKKey, zoomSDKSecret)

	// 4. Token Manager
	tokenManager := jwt.NewTokenManager(jwtSecret, 24*7*time.Hour)

	// 5. Domain Use Cases
	authUC := auth.NewUseCase(userRepo, tokenManager)
	specialistUC := specialist.NewUseCase(specialistRepo, cacheClient)
	serviceUC := clinical_service.NewUseCase(serviceRepo, cacheClient)
	appointmentUC := appointment.NewUseCase(appointmentRepo, specialistRepo, serviceRepo, zoomService, cacheClient)
	txUC := transaction.NewUseCase(transactionRepo)
	meetingUC := meeting.NewUseCase(zoomService)

	// 6. HTTP Handlers & Router
	h := handler.NewHandler(authUC, specialistUC, serviceUC, appointmentUC, txUC, meetingUC)
	r := router.SetupRouter(h, tokenManager)

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Listen error: %s", err)
		}
	}()

	logger.Info("MedPulse API successfully running at http://localhost:%s", port)

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown: %v", err)
	}

	logger.Info("Server exited.")
}

