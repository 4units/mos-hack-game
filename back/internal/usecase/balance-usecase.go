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
	GetSoftCurrency(ctx context.Context, userID uuid.UUID) (int, error)
	UpdateSoftCurrency(ctx context.Context, userID uuid.UUID, count int) error
}

type BalanceConfigProvider interface {
	BalanceConfig() *config.Balance
}

type BalanceUsecaseDeps struct {
	BalanceStorage BalanceStorage
	BalanceConfigProvider
}

type BalanceUsecase struct {
	BalanceUsecaseDeps
}

func NewBalanceUsecase(deps BalanceUsecaseDeps) *BalanceUsecase {
	return &BalanceUsecase{
		BalanceUsecaseDeps: deps,
	}
}

func (b *BalanceUsecase) GetUserBalance(ctx context.Context, userID uuid.UUID) (model.UserBalance, error) {
	balance, err := b.BalanceStorage.GetUserBalance(ctx, userID)
	if err != nil {
		if !errors.Is(err, model.ErrBalanceNotExists) {
			return model.UserBalance{}, fmt.Errorf("failed to get balance: %w", err)
		}
		balance = model.UserBalance{SoftCurrency: b.BalanceConfig().StartSoftCurrency}
		if err = b.BalanceStorage.CreateUserBalance(ctx, userID, balance); err != nil {
			return model.UserBalance{}, fmt.Errorf("failed to update balance: %w", err)
		}
	}
	return balance, nil
}

func (b *BalanceUsecase) AddSoftCurrency(ctx context.Context, userID uuid.UUID, count int) error {
	balance, err := b.GetUserBalance(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get balance: %w", err)
	}
	balance.SoftCurrency += count
	if err = b.BalanceStorage.UpdateSoftCurrency(ctx, userID, balance.SoftCurrency); err != nil {
		return fmt.Errorf("failed to update soft currency balance: %w", err)
	}
	return nil
}

func (b *BalanceUsecase) TrySpendSoftCurrency(ctx context.Context, userID uuid.UUID, count int) error {
	balance, err := b.GetUserBalance(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get balance: %w", err)
	}
	if balance.SoftCurrency < count {
		return ErrNotEnoughSoftCurrency
	}
	balance.SoftCurrency -= count
	if err = b.BalanceStorage.UpdateSoftCurrency(ctx, userID, balance.SoftCurrency); err != nil {
		return fmt.Errorf("failed to update soft currency balance: %w", err)
	}
	return nil
}

func (b *BalanceUsecase) GetSoftCurrency(ctx context.Context, userID uuid.UUID) (int, error) {
	softCurrency, err := b.BalanceStorage.GetSoftCurrency(ctx, userID)
	if err != nil {
		if !errors.Is(err, model.ErrBalanceNotExists) {
			return 0, fmt.Errorf("failed to get balance: %w", err)
		}
		startSoftCurrency := b.BalanceConfig().StartSoftCurrency
		balance := model.UserBalance{SoftCurrency: startSoftCurrency}
		if err = b.BalanceStorage.CreateUserBalance(ctx, userID, balance); err != nil {
			return 0, fmt.Errorf("failed to update balance: %w", err)
		}
		return startSoftCurrency, nil
	}
	return softCurrency, nil
}
