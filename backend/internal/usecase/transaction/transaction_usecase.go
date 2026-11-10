package transaction

import (
	"context"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/pkg/pagination"
)

type UseCase struct {
	txRepo repository.TransactionRepository
}

func NewUseCase(txRepo repository.TransactionRepository) *UseCase {
	return &UseCase{txRepo: txRepo}
}

func (uc *UseCase) GetByID(ctx context.Context, id string) (*entity.Transaction, error) {
	return uc.txRepo.GetByID(ctx, id)
}

func (uc *UseCase) List(ctx context.Context, filter repository.TransactionFilter, params pagination.Params) (*pagination.PageResult[entity.Transaction], error) {
	return uc.txRepo.List(ctx, filter, params)
}

