package handler

import (
	"context"
	"encoding/json"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"net/http"
	"time"
)

type LineGameLevelProvider interface {
	GetUserLevel(ctx context.Context, userID uuid.UUID) (model.LineGameLevel, error)
}

type LineGameCompleteProcessor interface {
	TryCompleteUserLevel(
		ctx context.Context,
		userID uuid.UUID,
		answer [][]int,
		timeSinceStart time.Duration,
	) (model.LineGameReward, error)
}

type LineGameHintProvider interface {
	GetLevelHint(ctx context.Context, userID uuid.UUID) ([][]int, error)
}

type LineGameHandlerDeps struct {
	LineGameLevelProvider     LineGameLevelProvider
	LineGameCompleteProcessor LineGameCompleteProcessor
	UserIDExtractor           UserIDExtractor
	LineGameHintProvider      LineGameHintProvider
}

type LineGameHandler struct {
	LineGameHandlerDeps
	validate *validator.Validate
}

func NewLineGameHandler(deps LineGameHandlerDeps) *LineGameHandler {
	return &LineGameHandler{
		LineGameHandlerDeps: deps,
		validate:            validator.New(),
	}
}

type GetUserLevelResponse struct {
	FieldSize int    `json:"field_size"`
	StartCell Cell   `json:"start_cell"`
	EndCell   Cell   `json:"end_cell"`
	Order     []Cell `json:"order"`
	Blockers  []Cell `json:"blockers"`
}

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (l *LineGameHandler) GetUserLevel(w http.ResponseWriter, r *http.Request) {
	userID, err := l.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	level, err := l.LineGameLevelProvider.GetUserLevel(r.Context(), userID)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get user level", err)
		return
	}
	resp := GetUserLevelResponse{
		FieldSize: level.FieldSize,
		StartCell: Cell{
			level.Start.X,
			level.Start.Y,
		},
		EndCell: Cell{
			level.End.X,
			level.End.Y,
		},
		Order:    make([]Cell, 0, len(level.Order)),
		Blockers: make([]Cell, 0, len(level.Blockers)),
	}
	for _, cell := range level.Order {
		resp.Order = append(resp.Order, Cell{X: cell.X, Y: cell.Y})
	}
	for _, cell := range level.Blockers {
		resp.Blockers = append(resp.Blockers, Cell{X: cell.X, Y: cell.Y})
	}
	if err = json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.NewInternal("failed to encode level")
		logs.Error("failed to encode response", err)
	}
}

type CompleteLevelRequest struct {
	Answer         [][]int `json:"answer" validate:"required""`
	TimeSinceStart int     `json:"time_since_start" validate:"required""`
}

type CompleteLevelResponse struct {
	SoftCurrency int `json:"soft_currency"`
}

func (l *LineGameHandler) CompleteLevel(w http.ResponseWriter, r *http.Request) {
	userID, err := l.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req CompleteLevelRequest
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, l.validate, req) {
		return
	}
	answerRowsCount := len(req.Answer)
	for _, row := range req.Answer {
		if len(row) != answerRowsCount {
			http_errors.SendBadRequest(w, "answer rows count is invalid: exacted equal size of axis")
			logs.Error("answer rows and column count is not the same", err)
			return
		}
	}
	reward, err := l.LineGameCompleteProcessor.TryCompleteUserLevel(
		r.Context(), userID, req.Answer,
		time.Duration(req.TimeSinceStart)*time.Second,
	)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to complete level", err)
		return
	}
	resp := CompleteLevelResponse{
		reward.SoftCurrency,
	}
	if err = json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to encode response", err)
	}
}

type GetLevelHintResponse struct {
	Answer [][]int `json:"answer" validate:"required"`
}

func (l *LineGameHandler) GetLevelHint(w http.ResponseWriter, r *http.Request) {
	userID, err := l.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	answer, err := l.LineGameHintProvider.GetLevelHint(r.Context(), userID)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get user level hint", err)
		return
	}
	resp := GetLevelHintResponse{
		Answer: answer,
	}
	if err = json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to encode response", err)
	}
}
