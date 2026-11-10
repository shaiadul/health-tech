package clinical_service

import (
	"context"
	"fmt"
	"time"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/internal/infrastructure/cache"
	"github.com/health-tech/backend/pkg/pagination"
)

type UseCase struct {
	repo  repository.ClinicalServiceRepository
	cache cache.Cache
}

func NewUseCase(repo repository.ClinicalServiceRepository, cache cache.Cache) *UseCase {
	return &UseCase{repo: repo, cache: cache}
}

func (uc *UseCase) GetByID(ctx context.Context, id string) (*entity.ClinicalService, error) {
	return uc.repo.GetByID(ctx, id)
}

func (uc *UseCase) GetBySlug(ctx context.Context, slug string) (*entity.ClinicalService, error) {
	cacheKey := fmt.Sprintf("service:slug:%s", slug)
	var srv entity.ClinicalService
	if err := uc.cache.Get(ctx, cacheKey, &srv); err == nil {
		return &srv, nil
	}

	result, err := uc.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	_ = uc.cache.Set(ctx, cacheKey, result, 15*time.Minute)
	return result, nil
}

func (uc *UseCase) List(ctx context.Context, department string, params pagination.Params) (*pagination.PageResult[entity.ClinicalService], error) {
	return uc.repo.List(ctx, department, params)
}

