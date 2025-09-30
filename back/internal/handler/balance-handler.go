package handler

import (
	"context"
	"encoding/json"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/google/uuid"
	"net/http"
)

type BalanceProvider interface {
	GetUserBalance(ctx context.Context, userID uuid.UUID) (model.UserBalance, error)
}

type BalanceHandlerDeps struct {
	UserIDExtractor UserIDExtractor
	BalanceProvider BalanceProvider
}
type BalanceHandler struct {
	BalanceHandlerDeps
}

func NewBalanceHandler(deps BalanceHandlerDeps) *BalanceHandler {
	return &BalanceHandler{
		BalanceHandlerDeps: deps,
	}
}

type GetUserBalanceResponse struct {
	SoftCurrency int `json:"soft_currency"`
}

func (h *BalanceHandler) GetUserBalance(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	balance, err := h.BalanceProvider.GetUserBalance(r.Context(), userID)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get balance", err)
		return
	}
	response := GetUserBalanceResponse{
		SoftCurrency: balance.SoftCurrency,
	}
	if err = json.NewEncoder(w).Encode(response); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to encode response", err)
	}
}
