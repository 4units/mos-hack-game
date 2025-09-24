package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	logs "github.com/4units/mos-hack-game/back/pkg/logging"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strings"
)

type UserAuthenticator interface {
	AuthenticateByEmail(email, password string) (string, error)
	GenerateAnonymouseToken() (string, error)
	RegisterByEmail(email, password string) error
}

type UserHandlerDeps struct {
	UserAuthenticator UserAuthenticator
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

func (h *UserHandler) GetAnonymouseUserToken(w http.ResponseWriter, _ *http.Request) {
	token, err := h.UserAuthenticator.GenerateAnonymouseToken()
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
	w.WriteHeader(http.StatusCreated)
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
	token, err := h.UserAuthenticator.AuthenticateByEmail(req.Email, req.Password)
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
	err := h.UserAuthenticator.RegisterByEmail(req.Email, req.Password)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to register the user", err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
