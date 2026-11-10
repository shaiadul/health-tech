package repository

import (
	"context"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/pkg/pagination"
)

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*entity.User, error)
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	Create(ctx context.Context, user *entity.User) error
	Update(ctx context.Context, user *entity.User) error
	List(ctx context.Context, role entity.UserRole, params pagination.Params) (*pagination.PageResult[entity.User], error)
}

type SpecialistFilter struct {
	Department string
	Language   string
	IsAvailable *bool
	MinRating  float64
}

type SpecialistRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Specialist, error)
	List(ctx context.Context, filter SpecialistFilter, params pagination.Params) (*pagination.PageResult[entity.Specialist], error)
	GetFeatured(ctx context.Context, limit int) ([]entity.Specialist, error)
	Create(ctx context.Context, specialist *entity.Specialist) error
}

type ClinicalServiceRepository interface {
	GetByID(ctx context.Context, id string) (*entity.ClinicalService, error)
	GetBySlug(ctx context.Context, slug string) (*entity.ClinicalService, error)
	List(ctx context.Context, department string, params pagination.Params) (*pagination.PageResult[entity.ClinicalService], error)
	Create(ctx context.Context, service *entity.ClinicalService) error
}

type AppointmentFilter struct {
	PatientID    string
	SpecialistID string
	Department   string
	Status       entity.AppointmentStatus
	DateFrom     string
	DateTo       string
	Format       string
}

type AppointmentRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Appointment, error)
	GetByReference(ctx context.Context, ref string) (*entity.Appointment, error)
	List(ctx context.Context, filter AppointmentFilter, params pagination.Params) (*pagination.PageResult[entity.Appointment], error)
	Create(ctx context.Context, apt *entity.Appointment) error
	UpdateStatus(ctx context.Context, id string, status entity.AppointmentStatus) error
	Update(ctx context.Context, apt *entity.Appointment) error
}

type TransactionFilter struct {
	PatientID  string
	Category   string
	Department string
	Status     entity.TransactionStatus
}

type TransactionRepository interface {
	GetByID(ctx context.Context, id string) (*entity.Transaction, error)
	List(ctx context.Context, filter TransactionFilter, params pagination.Params) (*pagination.PageResult[entity.Transaction], error)
	Create(ctx context.Context, tx *entity.Transaction) error
}

