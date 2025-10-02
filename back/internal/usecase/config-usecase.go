package usecase

import (
	"context"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	"github.com/google/uuid"
)

type ConifgUsecase struct {
	userUsecase    *UserUsecase
	lineGameConfig *config.LineGame
	priceConfig    *config.ItemsPrice
	quizConfig     *config.Quiz
	balanceConfig  *config.Balance
}

func NewConifgUsecase(userUsecase *UserUsecase, cfg config.Config) *ConifgUsecase {
	return &ConifgUsecase{
		userUsecase:    userUsecase,
		lineGameConfig: &cfg.Game.LineGame,
		priceConfig:    &cfg.Game.ItemsPrice,
		quizConfig:     &cfg.Game.Quiz,
		balanceConfig:  &cfg.Game.Balance,
	}
}

func (c *ConifgUsecase) UpdateBalanceConfig(ctx context.Context, userID uuid.UUID, cfg config.Balance) error {
	if err := c.userUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	c.balanceConfig = &cfg
	return nil
}

func (c *ConifgUsecase) UpdatePriceConifg(ctx context.Context, userID uuid.UUID, cfg config.ItemsPrice) error {
	if err := c.userUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	c.priceConfig = &cfg
	return nil
}

func (c *ConifgUsecase) UpdateLineGameConifg(ctx context.Context, userID uuid.UUID, cfg config.LineGame) error {
	if err := c.userUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	c.lineGameConfig = &cfg
	return nil
}

func (c *ConifgUsecase) UpdateQuizConfig(ctx context.Context, userID uuid.UUID, cfg config.Quiz) error {
	if err := c.userUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	c.quizConfig = &cfg
	return nil
}

func (c *ConifgUsecase) QuizConfig() *config.Quiz {
	return c.quizConfig
}

func (c *ConifgUsecase) LineGameConifg() *config.LineGame {
	return c.lineGameConfig
}

func (c *ConifgUsecase) PriceConifg() *config.ItemsPrice {
	return c.priceConfig
}

func (c *ConifgUsecase) BalanceConfig() *config.Balance {
	return c.balanceConfig
}
