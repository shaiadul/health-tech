package appointment

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/internal/infrastructure/cache"
	"github.com/health-tech/backend/internal/infrastructure/zoom"
	"github.com/health-tech/backend/pkg/pagination"
)

type UseCase struct {
	aptRepo  repository.AppointmentRepository
	specRepo repository.SpecialistRepository
	srvRepo  repository.ClinicalServiceRepository
	zoomSvc  *zoom.Service
	cache    cache.Cache
}

func NewUseCase(
	aptRepo repository.AppointmentRepository,
	specRepo repository.SpecialistRepository,
	srvRepo repository.ClinicalServiceRepository,
	zoomSvc *zoom.Service,
	cache cache.Cache,
) *UseCase {
	return &UseCase{
		aptRepo:  aptRepo,
		specRepo: specRepo,
		srvRepo:  srvRepo,
		zoomSvc:  zoomSvc,
		cache:    cache,
	}
}

type CreateAppointmentInput struct {
	PatientID    string `json:"patientId"`
	PatientName  string `json:"patientName" binding:"required"`
	PatientEmail string `json:"patientEmail" binding:"required,email"`
	PatientPhone string `json:"patientPhone"`
	SpecialistID string `json:"specialistId" binding:"required"`
	ServiceID    string `json:"serviceId" binding:"required"`
	Date         string `json:"date" binding:"required"`
	TimeSlot     string `json:"timeSlot" binding:"required"`
	Format       string `json:"format" binding:"required"` // in_person or video
	Symptoms     string `json:"symptoms"`
}

func (uc *UseCase) Create(ctx context.Context, input CreateAppointmentInput) (*entity.Appointment, error) {
	spec, err := uc.specRepo.GetByID(ctx, input.SpecialistID)
	if err != nil {
		return nil, fmt.Errorf("specialist not found: %w", err)
	}

	srv, err := uc.srvRepo.GetByID(ctx, input.ServiceID)
	if err != nil {
		return nil, fmt.Errorf("service not found: %w", err)
	}

	rand.Seed(time.Now().UnixNano())
	ref := fmt.Sprintf("MED-%d-%04d", time.Now().Year(), rand.Intn(9000)+1000)
	aptID := "apt_" + uuid.New().String()[:8]
	roomID := fmt.Sprintf("room-%s", aptID)

	var meetingURL, zoomMeetingID, zoomPassword string
	if input.Format == "video" {
		meeting, err := uc.zoomSvc.GenerateMeeting(fmt.Sprintf("%s - %s Consultation", srv.Name, spec.Name), false)
		if err == nil {
			meetingURL = meeting.JoinURL
			zoomMeetingID = meeting.MeetingID
			zoomPassword = meeting.Password
		} else {
			meetingURL = fmt.Sprintf("/consultation/%s", roomID)
		}
	}

	apt := &entity.Appointment{
		ID:             aptID,
		Reference:      ref,
		PatientID:      input.PatientID,
		PatientName:    input.PatientName,
		PatientEmail:   input.PatientEmail,
		PatientPhone:   input.PatientPhone,
		SpecialistID:   spec.ID,
		SpecialistName: spec.Name,
		ServiceID:      srv.ID,
		ServiceName:    srv.Name,
		Department:     spec.Department,
		Date:           input.Date,
		TimeSlot:       input.TimeSlot,
		Format:         input.Format,
		Status:         entity.AppointmentStatusConfirmed,
		Price:          srv.Price,
		Currency:       srv.Currency,
		Symptoms:       input.Symptoms,
		MeetingURL:     meetingURL,
		ZoomMeetingID:  zoomMeetingID,
		ZoomPassword:   zoomPassword,
		RoomID:         roomID,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := uc.aptRepo.Create(ctx, apt); err != nil {
		return nil, err
	}

	return apt, nil
}

func (uc *UseCase) GetByID(ctx context.Context, id string) (*entity.Appointment, error) {
	return uc.aptRepo.GetByID(ctx, id)
}

func (uc *UseCase) GetByReference(ctx context.Context, ref string) (*entity.Appointment, error) {
	return uc.aptRepo.GetByReference(ctx, ref)
}

func (uc *UseCase) List(ctx context.Context, filter repository.AppointmentFilter, params pagination.Params) (*pagination.PageResult[entity.Appointment], error) {
	return uc.aptRepo.List(ctx, filter, params)
}

func (uc *UseCase) UpdateStatus(ctx context.Context, id string, status entity.AppointmentStatus) error {
	return uc.aptRepo.UpdateStatus(ctx, id, status)
}

