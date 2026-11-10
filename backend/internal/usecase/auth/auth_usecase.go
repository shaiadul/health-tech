package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type UseCase struct {
	userRepo     repository.UserRepository
	tokenManager *jwt.TokenManager
}

func NewUseCase(userRepo repository.UserRepository, tm *jwt.TokenManager) *UseCase {
	return &UseCase{
		userRepo:     userRepo,
		tokenManager: tm,
	}
}

type LoginInput struct {
	Email         string          `json:"email" binding:"required,email"`
	Password      string          `json:"password"`
	PreferredRole entity.UserRole `json:"preferredRole"`
}

type AuthOutput struct {
	Token string       `json:"token"`
	User  *entity.User `json:"user"`
}

func (uc *UseCase) Login(ctx context.Context, input LoginInput) (*AuthOutput, error) {
	user, err := uc.userRepo.GetByEmail(ctx, input.Email)
	if err != nil {
		// Auto-register demo/new users if not found to support seamless frontend login
		role := input.PreferredRole
		if role == "" {
			role = entity.RolePatient
		}
		user = &entity.User{
			ID:        "usr_" + uuid.New().String()[:8],
			Email:     input.Email,
			Name:      input.Email,
			Role:      role,
			RoleTitle: "Registered User",
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		_ = uc.userRepo.Create(ctx, user)
	}

	token, err := uc.tokenManager.GenerateToken(user)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &AuthOutput{
		Token: token,
		User:  user,
	}, nil
}

type SignupInput struct {
	Name       string          `json:"name" binding:"required"`
	Email      string          `json:"email" binding:"required,email"`
	Password   string          `json:"password"`
	Role       entity.UserRole `json:"role" binding:"required"`
	Phone      string          `json:"phone"`
	Department string          `json:"department"`
}

func (uc *UseCase) Signup(ctx context.Context, input SignupInput) (*AuthOutput, error) {
	existing, _ := uc.userRepo.GetByEmail(ctx, input.Email)
	if existing != nil {
		return nil, errors.New("user with this email already exists")
	}

	passHash := ""
	if input.Password != "" {
		hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		passHash = string(hash)
	}

	patientID := ""
	staffID := ""
	roleTitle := "Registered Patient"

	if input.Role == entity.RolePatient {
		patientID = fmt.Sprintf("PT-%d", 10000+time.Now().UnixNano()%90000)
	} else if input.Role == entity.RoleDoctor {
		staffID = fmt.Sprintf("MD-%d", 1000+time.Now().UnixNano()%9000)
		roleTitle = "Attending Physician"
	} else if input.Role == entity.RoleOrganizer {
		staffID = fmt.Sprintf("ORG-%d", 100+time.Now().UnixNano()%900)
		roleTitle = "Hospital Operations Administrator"
	}

	newUser := &entity.User{
		ID:           "usr_" + uuid.New().String()[:8],
		Email:        input.Email,
		PasswordHash: passHash,
		Name:         input.Name,
		Role:         input.Role,
		RoleTitle:    roleTitle,
		Phone:        input.Phone,
		Department:   input.Department,
		PatientID:    patientID,
		StaffID:      staffID,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := uc.userRepo.Create(ctx, newUser); err != nil {
		return nil, err
	}

	token, err := uc.tokenManager.GenerateToken(newUser)
	if err != nil {
		return nil, err
	}

	return &AuthOutput{
		Token: token,
		User:  newUser,
	}, nil
}

func (uc *UseCase) GetProfile(ctx context.Context, userID string) (*entity.User, error) {
	return uc.userRepo.GetByID(ctx, userID)
}

