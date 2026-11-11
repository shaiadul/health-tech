package lead

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/pkg/pagination"
)

type UseCase struct {
	repo repository.LeadRepository
}

func NewUseCase(repo repository.LeadRepository) *UseCase {
	return &UseCase{repo: repo}
}

type CreateLeadInput struct {
	FullName           string `json:"fullName" binding:"required"`
	Email              string `json:"email" binding:"required,email"`
	Phone              string `json:"phone"`
	ServiceInterest    string `json:"serviceInterest"`
	EstimatedPortfolio string `json:"estimatedPortfolio"`
}

func (uc *UseCase) SubmitLead(ctx context.Context, input CreateLeadInput) (*entity.LeadSubmission, error) {
	lead := &entity.LeadSubmission{
		ID:                 "lead_" + uuid.New().String()[:8],
		FullName:           input.FullName,
		Email:              input.Email,
		Phone:              input.Phone,
		ServiceInterest:    input.ServiceInterest,
		EstimatedPortfolio: input.EstimatedPortfolio,
		CreatedAt:          time.Now(),
	}

	if err := uc.repo.CreateLead(ctx, lead); err != nil {
		return nil, err
	}
	return lead, nil
}

func (uc *UseCase) SubscribeNewsletter(ctx context.Context, email string) (*entity.NewsletterSubmission, error) {
	sub := &entity.NewsletterSubmission{
		ID:           "sub_" + uuid.New().String()[:8],
		Email:        email,
		SubscribedAt: time.Now(),
	}

	if err := uc.repo.CreateNewsletter(ctx, sub); err != nil {
		return nil, err
	}
	return sub, nil
}

func (uc *UseCase) ListLeads(ctx context.Context, params pagination.Params) (*pagination.PageResult[entity.LeadSubmission], error) {
	return uc.repo.ListLeads(ctx, params)
}

