package router

import (
	"github.com/gin-gonic/gin"
	"github.com/health-tech/backend/internal/delivery/http/handler"
	"github.com/health-tech/backend/internal/delivery/http/middleware"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/pkg/jwt"
	"github.com/health-tech/backend/pkg/logger"
)

func SetupRouter(h *handler.Handler, tm *jwt.TokenManager) *gin.Engine {
	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(logger.Middleware())
	r.Use(middleware.CORS())

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "MedPulse HealthTech Backend",
		})
	})

	api := r.Group("/api/v1")
	{
		// ---------------- Public Auth Routes ----------------
		auth := api.Group("/auth")
		{
			auth.POST("/login", h.Login)
			auth.POST("/signup", h.Signup)
		}

		// ---------------- Public Directory Routes ----------------
		api.GET("/specialists", h.ListSpecialists)
		api.GET("/specialists/featured", h.GetFeaturedSpecialists)
		api.GET("/specialists/:id", h.GetSpecialist)

		api.GET("/services", h.ListServices)
		api.GET("/services/:id", h.GetService)

		// Public appointment booking & lookup
		api.POST("/appointments", h.CreateAppointment)
		api.GET("/appointments/:id", h.GetAppointment)

		// ---------------- Protected Routes (Authenticated) ----------------
		protected := api.Group("")
		protected.Use(middleware.Auth(tm))
		{
			protected.GET("/auth/me", h.GetMe)
			protected.GET("/appointments", h.ListAppointments)
			protected.PATCH("/appointments/:id/status", h.UpdateAppointmentStatus)

			// ---------------- Zoom Realtime Telehealth Meetings ----------------
			protected.POST("/meetings/zoom", h.CreateMeeting)
			protected.GET("/meetings/zoom/:meetingId/token", h.GetZoomSDKToken)

			// ---------------- Staff-Only Routes (Doctor & Organizer) ----------------
			staff := protected.Group("")
			staff.Use(middleware.RequireRole(entity.RoleDoctor, entity.RoleOrganizer))
			{
				staff.GET("/transactions", h.ListTransactions)
			}
		}
	}

	return r
}

