package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"net/http"
	"strings"
)

type UserAuthenticator interface {
	AuthenticateByEmail(ctx context.Context, email, password string) (string, error)
	CreateAnonymouseUser(ctx context.Context) (string, error)
	RegisterByEmail(ctx context.Context, email, password string) error
}

type UserDataProvider interface {
	GetUserInfo(ctx context.Context, userID uuid.UUID) (*model.User, error)
}

type UserHandlerDeps struct {
	UserAuthenticator UserAuthenticator
	UserIDProvider    UserIDExtractor
	UserDataProvider  UserDataProvider
}

type UserHandler struct {
	UserHandlerDeps
	validate *validator.Validate
}

func NewUserHandler(deps UserHandlerDeps) *UserHandler {
	return &UserHandler{
		UserHandlerDeps: deps,
		validate:        validator.New(),
	}
}

type RegisterAnonymousResponse struct {
	Token string `json:"token"`
}

func (h *UserHandler) GetAnonymouseUserToken(w http.ResponseWriter, r *http.Request) {
	token, err := h.UserAuthenticator.CreateAnonymouseUser(r.Context())
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to generate anonymouse token", err)
		return
	}
	if err = json.NewEncoder(w).Encode(&RegisterAnonymousResponse{token}); err != nil {
		http_errors.SendInternal(w)
		logs.Error("failed to encode the token", err)
		return
	}
}

type AuthenticateUserRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

func (h *UserHandler) GetUserTokenByEmail(w http.ResponseWriter, r *http.Request) {
	var req AuthenticateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.Send(w, err, http.StatusBadRequest)
		logs.Error("failed to decode the request", err)
		return
	}
	if err := h.validate.Struct(req); err != nil {
		http_errors.Send(w, err, http.StatusBadRequest)
		logs.Error("failed to validate the request", err)
		return
	}
	token, err := h.UserAuthenticator.AuthenticateByEmail(r.Context(), req.Email, req.Password)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to authenticate the user", err)
		return
	}
	if err = json.NewEncoder(w).Encode(token); err != nil {
		http_errors.SendInternal(w)
		logs.Error("failed to encode the token", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}

type RegisterUserRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

func (h *UserHandler) RegisterUserByEmail(w http.ResponseWriter, r *http.Request) {
	var req RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.Send(w, err, http.StatusBadRequest)
		logs.Error("failed to decode the request", err)
		return
	}
	if err := h.validate.Struct(req); err != nil {
		var validatorErr validator.ValidationErrors
		if errors.As(err, &validatorErr) {
			errs := make([]string, len(validatorErr))
			for i, fieldError := range validatorErr {
				if fieldError.Param() != "" {
					errs[i] = fmt.Sprintf(
						"failed to validate field '%s', because of tag '%s:%s'", strings.ToLower(fieldError.Field()),
						fieldError.Tag(), fieldError.Param(),
					)
				} else {
					errs[i] = fmt.Sprintf(
						"failed to validate field '%s', because of tag '%s'", strings.ToLower(fieldError.Field()),
						fieldError.Tag(),
					)
				}
				break
			}
			http_errors.SendBadRequest(w, strings.Join(errs, ";"))
		} else {
			http_errors.SendBadRequest(w, "failed to validate request")
		}
		logs.Error("failed to validate the request", err)
		return
	}
	err := h.UserAuthenticator.RegisterByEmail(r.Context(), req.Email, req.Password)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to register the user", err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

type GetUserInfoResponse struct {
	ID    uuid.UUID `json:"id"`
	Email string    `json:"email"`
}

func (h *UserHandler) GetUserInfo(w http.ResponseWriter, r *http.Request) {
	userID, err := h.UserIDProvider.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get user id", err)
		return
	}
	user, err := h.UserDataProvider.GetUserInfo(r.Context(), userID)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get user info", err)
		return
	}
	resp := GetUserInfoResponse{
		ID:    user.ID,
		Email: user.Email,
	}
	if err = json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendInternal(w)
		logs.Error("failed to encode the user", err)
		return
	}
	w.WriteHeader(http.StatusOK)
}
