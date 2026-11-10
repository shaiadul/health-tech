package specialist

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
	specRepo repository.SpecialistRepository
	cache    cache.Cache
}

func NewUseCase(specRepo repository.SpecialistRepository, cache cache.Cache) *UseCase {
	return &UseCase{
		specRepo: specRepo,
		cache:    cache,
	}
}

func (uc *UseCase) GetByID(ctx context.Context, id string) (*entity.Specialist, error) {
	cacheKey := fmt.Sprintf("specialist:%s", id)
	var sp entity.Specialist
	if err := uc.cache.Get(ctx, cacheKey, &sp); err == nil {
		return &sp, nil
	}

	result, err := uc.specRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	_ = uc.cache.Set(ctx, cacheKey, result, 10*time.Minute)
	return result, nil
}

func (uc *UseCase) List(ctx context.Context, filter repository.SpecialistFilter, params pagination.Params) (*pagination.PageResult[entity.Specialist], error) {
	return uc.specRepo.List(ctx, filter, params)
}

func (uc *UseCase) GetFeatured(ctx context.Context, limit int) ([]entity.Specialist, error) {
	cacheKey := fmt.Sprintf("specialists:featured:%d", limit)
	var list []entity.Specialist
	if err := uc.cache.Get(ctx, cacheKey, &list); err == nil {
		return list, nil
	}

	res, err := uc.specRepo.GetFeatured(ctx, limit)
	if err != nil {
		return nil, err
	}

	_ = uc.cache.Set(ctx, cacheKey, res, 15*time.Minute)
	return res, nil
}

