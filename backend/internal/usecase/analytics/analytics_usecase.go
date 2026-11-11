package analytics

import (
	"context"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
)

type UseCase struct {
	repo repository.AnalyticsRepository
}

func NewUseCase(repo repository.AnalyticsRepository) *UseCase {
	return &UseCase{repo: repo}
}

func (uc *UseCase) GetSummary(ctx context.Context) (*entity.AnalyticsSummary, error) {
	return uc.repo.GetSummary(ctx)
}

