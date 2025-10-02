package handler

import (
	"context"
	"encoding/json"
	"github.com/4units/mos-hack-game/back/config"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"net/http"
)

type LineGameConifgProvider interface {
	LineGameConifg() *config.LineGame
}

type LineGameConifgProcessor interface {
	LineGameConifgProvider
	UpdateLineGameConifg(ctx context.Context, userID uuid.UUID, cfg config.LineGame) error
}

type BalanceConfigProcessor interface {
	BalanceConfig() *config.Balance
	UpdateBalanceConfig(ctx context.Context, userID uuid.UUID, cfg config.Balance) error
}

type QuizConfigProcessor interface {
	QuizConfig() *config.Quiz
	UpdateQuizConfig(ctx context.Context, userID uuid.UUID, cfg config.Quiz) error
}

type PriceConifgProcessor interface {
	PriceConifg() *config.ItemsPrice
	UpdatePriceConifg(ctx context.Context, userID uuid.UUID, cfg config.ItemsPrice) error
}

type ConfigHandlerDeps struct {
	LineGameConifgProcessor LineGameConifgProcessor
	BalanceConfigProcessor  BalanceConfigProcessor
	QuizConfigProcessor     QuizConfigProcessor
	PriceConifgProcessor    PriceConifgProcessor
	UserIDExtractor         UserIDExtractor
}

type ConfigHandler struct {
	ConfigHandlerDeps
	validate *validator.Validate
}

func NewConfigHandler(deps ConfigHandlerDeps) *ConfigHandler {
	return &ConfigHandler{
		deps,
		validator.New(),
	}
}

// GetQuizConfig godoc
// @Summary      Get quiz config
// @Tags         config
// @Produce      json
// @Success      200  {object}  config.Quiz
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/quiz [get]
func (h *ConfigHandler) GetQuizConfig(w http.ResponseWriter, _ *http.Request) {
	if err := json.NewEncoder(w).Encode(h.QuizConfigProcessor.QuizConfig()); err != nil {
		http_errors.NewInternal("failed to encode config")
		logs.Error("failed to encode config", err)
	}
}

// UpdateQuizConfig godoc
// @Summary      Update quiz config
// @Tags         config
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  config.Quiz  true  "Update quiz config data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/quiz [put]
func (h *ConfigHandler) UpdateQuizConfig(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req config.Quiz
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
		return
	}
	if err = h.QuizConfigProcessor.UpdateQuizConfig(
		r.Context(), userID, req,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to update quiz config", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// GetLineGameConfig godoc
// @Summary      Get line game config
// @Tags         config
// @Produce      json
// @Success      200  {object}  config.LineGame
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/line [get]
func (h *ConfigHandler) GetLineGameConfig(w http.ResponseWriter, _ *http.Request) {
	if err := json.NewEncoder(w).Encode(h.LineGameConifgProcessor.LineGameConifg()); err != nil {
		http_errors.NewInternal("failed to encode config")
		logs.Error("failed to encode config", err)
	}
}

// UpdateLineGameConfig godoc
// @Summary      Update line game config
// @Tags         config
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  config.LineGame  true  "Update line game config data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/line [put]
func (h *ConfigHandler) UpdateLineGameConfig(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req config.LineGame
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
		return
	}
	if err = h.LineGameConifgProcessor.UpdateLineGameConifg(
		r.Context(), userID, req,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to update line game config", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// GetBalanceGameConfig godoc
// @Summary      Get balance config
// @Tags         config
// @Produce      json
// @Success      200  {object}  config.Balance
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/balance [get]
func (h *ConfigHandler) GetBalanceGameConfig(w http.ResponseWriter, _ *http.Request) {
	if err := json.NewEncoder(w).Encode(h.BalanceConfigProcessor.BalanceConfig()); err != nil {
		http_errors.NewInternal("failed to encode config")
		logs.Error("failed to encode config", err)
	}
}

// UpdateBalanceGameConfig godoc
// @Summary      Update balance config
// @Tags         config
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  config.Balance  true  "Update balance config data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/balance [put]
func (h *ConfigHandler) UpdateBalanceGameConfig(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req config.Balance
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
		return
	}
	if err = h.BalanceConfigProcessor.UpdateBalanceConfig(
		r.Context(), userID, req,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to update balance config", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// GetPriceGameConfig godoc
// @Summary      Get price config
// @Tags         config
// @Produce      json
// @Success      200  {object}  config.ItemsPrice
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/price [get]
func (h *ConfigHandler) GetPriceGameConfig(w http.ResponseWriter, _ *http.Request) {
	if err := json.NewEncoder(w).Encode(h.BalanceConfigProcessor.BalanceConfig()); err != nil {
		http_errors.NewInternal("failed to encode config")
		logs.Error("failed to encode config", err)
	}
}

// UpdatePriceGameConfig godoc
// @Summary      Update price config
// @Tags         config
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  config.ItemsPrice  true  "Update price config data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /config/price [put]
func (h *ConfigHandler) UpdatePriceGameConfig(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req config.ItemsPrice
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
		return
	}
	if err = h.PriceConifgProcessor.UpdatePriceConifg(
		r.Context(), userID, req,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to update price config", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
