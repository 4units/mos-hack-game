package usecase

import (
	"context"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	"github.com/google/uuid"
)

type BalanceStorage interface {
	GetUserBalance(ctx context.Context, userID uuid.UUID) (model.UserBalance, error)
	CreateUserBalance(ctx context.Context, userID uuid.UUID, balance model.UserBalance) error
}

type BalanceUsecaseDeps struct {
	BalanceStorage BalanceStorage
}

type BalanceUsecase struct {
	BalanceUsecaseDeps
	cfg config.Balance
}

func NewBalanceUsecase(deps BalanceUsecaseDeps, cfg config.Balance) *BalanceUsecase {
	return &BalanceUsecase{
		BalanceUsecaseDeps: deps,
		cfg:                cfg,
	}
}
func (b *BalanceUsecase) GetUserBalance(ctx context.Context, userID uuid.UUID) (model.UserBalance, error) {
	balance, err := b.BalanceStorage.GetUserBalance(ctx, userID)
	if err != nil {
		if !errors.Is(err, model.ErrBalanceNotExists) {
			return model.UserBalance{}, fmt.Errorf("failed to get balance: %w", err)
		}
		balance = model.UserBalance{SoftCurrency: b.cfg.StartSoftCurrency}
		if err = b.BalanceStorage.CreateUserBalance(ctx, userID, balance); err != nil {
			return model.UserBalance{}, fmt.Errorf("failed to update balance: %w", err)
		}
	}
	return balance, nil
}
