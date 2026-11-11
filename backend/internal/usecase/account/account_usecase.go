package account

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
)

type UseCase struct {
	repo repository.AccountRepository
}

func NewUseCase(repo repository.AccountRepository) *UseCase {
	return &UseCase{repo: repo}
}

func (uc *UseCase) List(ctx context.Context) ([]entity.BankAccount, error) {
	return uc.repo.ListAccounts(ctx)
}

func (uc *UseCase) GetByID(ctx context.Context, id string) (*entity.BankAccount, error) {
	return uc.repo.GetAccountByID(ctx, id)
}

type CreateAccountInput struct {
	Name            string  `json:"name" binding:"required"`
	AccountType     string  `json:"accountType" binding:"required"`
	RoutingNumber   string  `json:"routingNumber"`
	InitialDeposit  float64 `json:"initialDeposit"`
	InstitutionName string  `json:"institutionName"`
	ColorTheme      string  `json:"colorTheme"`
}

func (uc *UseCase) Create(ctx context.Context, input CreateAccountInput) (*entity.BankAccount, error) {
	rand.Seed(time.Now().UnixNano())
	accNum := fmt.Sprintf("48%d", 1000000000+rand.Int63n(9000000000))
	routing := input.RoutingNumber
	if routing == "" {
		routing = "121000358"
	}

	acc := &entity.BankAccount{
		ID:               "acc_" + uuid.New().String()[:8],
		Name:             input.Name,
		AccountType:      input.AccountType,
		AccountNumber:    accNum,
		RoutingNumber:    routing,
		Balance:          input.InitialDeposit,
		AvailableBalance: input.InitialDeposit,
		Currency:         "USD",
		Status:           "active",
		CardLast4:        accNum[len(accNum)-4:],
		InstitutionName:  input.InstitutionName,
		ColorTheme:       input.ColorTheme,
	}

	if err := uc.repo.CreateAccount(ctx, acc); err != nil {
		return nil, err
	}
	return acc, nil
}

