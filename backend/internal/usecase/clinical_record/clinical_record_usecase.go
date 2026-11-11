package clinical_record

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
)

type UseCase struct {
	repo repository.ClinicalRecordRepository
}

func NewUseCase(repo repository.ClinicalRecordRepository) *UseCase {
	return &UseCase{repo: repo}
}

type CreateRefillInput struct {
	PatientID      string `json:"patientId"`
	PatientName    string `json:"patientName" binding:"required"`
	MedicationID   string `json:"medicationId" binding:"required"`
	MedicationName string `json:"medicationName" binding:"required"`
	Dosage         string `json:"dosage" binding:"required"`
	RxNumber       string `json:"rxNumber" binding:"required"`
	PharmacyName   string `json:"pharmacyName"`
	PrescribedBy   string `json:"prescribedBy"`
}

func (uc *UseCase) RequestRefill(ctx context.Context, input CreateRefillInput) (*entity.PrescriptionRefill, error) {
	refill := &entity.PrescriptionRefill{
		ID:               "ref_" + uuid.New().String()[:8],
		PatientID:        input.PatientID,
		PatientName:      input.PatientName,
		MedicationID:     input.MedicationID,
		MedicationName:   input.MedicationName,
		Dosage:           input.Dosage,
		RxNumber:         input.RxNumber,
		PharmacyName:     input.PharmacyName,
		RefillsRemaining: 2,
		Status:           "pending",
		PrescribedBy:     input.PrescribedBy,
		CreatedAt:        time.Now(),
	}

	if err := uc.repo.CreateRefill(ctx, refill); err != nil {
		return nil, err
	}
	return refill, nil
}

func (uc *UseCase) ListRefills(ctx context.Context, patientID string, status string) ([]entity.PrescriptionRefill, error) {
	return uc.repo.ListRefills(ctx, patientID, status)
}

func (uc *UseCase) ApproveRefill(ctx context.Context, refillID string) error {
	return uc.repo.ApproveRefill(ctx, refillID)
}

type CreateSOAPInput struct {
	AppointmentID string `json:"appointmentId"`
	PatientID     string `json:"patientId"`
	PatientName   string `json:"patientName" binding:"required"`
	DoctorID      string `json:"doctorId"`
	DoctorName    string `json:"doctorName" binding:"required"`
	Subjective    string `json:"subjective" binding:"required"`
	Objective     string `json:"objective" binding:"required"`
	Assessment    string `json:"assessment" binding:"required"`
	Plan          string `json:"plan" binding:"required"`
}

func (uc *UseCase) CreateSOAPNote(ctx context.Context, input CreateSOAPInput) (*entity.SOAPNote, error) {
	note := &entity.SOAPNote{
		ID:            fmt.Sprintf("soap_%d", time.Now().UnixNano()),
		AppointmentID: input.AppointmentID,
		PatientID:     input.PatientID,
		PatientName:   input.PatientName,
		DoctorID:      input.DoctorID,
		DoctorName:    input.DoctorName,
		Subjective:    input.Subjective,
		Objective:     input.Objective,
		Assessment:    input.Assessment,
		Plan:          input.Plan,
		CreatedAt:     time.Now(),
	}

	if err := uc.repo.CreateSOAPNote(ctx, note); err != nil {
		return nil, err
	}
	return note, nil
}

func (uc *UseCase) ListSOAPNotes(ctx context.Context, patientID string) ([]entity.SOAPNote, error) {
	return uc.repo.ListSOAPNotes(ctx, patientID)
}

