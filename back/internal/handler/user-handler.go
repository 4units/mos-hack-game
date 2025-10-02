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
)

type UserAuthenticator interface {
	AuthenticateByEmail(ctx context.Context, email, password string) (string, error)
	CreateAnonymouseUser(ctx context.Context) (string, error)
	RegisterByEmail(ctx context.Context, email, password string) error
}

type UserDataProvider interface {
	GetUserInfo(ctx context.Context, userID uuid.UUID) (*model.User, error)
}

type UserIDExtractor interface {
	GetVerifiedUserIDFromRequest(r *http.Request) (uuid.UUID, error)
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

// GetAnonymouseUserToken godoc
// @Summary      Get anonymous user token
// @Description  Creates a new anonymous user and returns an auth token.
// @Tags         user
// @Produce      json
// @Success      200  {object}  RegisterAnonymousResponse
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /user/token/anonymous [get]
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

type RegisterUserRequest struct {
	Email    string `json:"email" validate:"required,email" example:"test@test.ru"`
	Password string `json:"password" validate:"required,min=8" example:"TestTest123"`
}

// RegisterUserByEmail godoc
// @Summary      Register by email and password
// @Description  Registers a new user by email and password.
// @Tags         user
// @Accept       json
// @Param        body  body  RegisterUserRequest  true  "Registration data"
// @Success      201   "created"
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /user/register/email [post]
func (h *UserHandler) RegisterUserByEmail(w http.ResponseWriter, r *http.Request) {
	var req RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
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

type AuthenticateUserRequest struct {
	Email    string `json:"email" validate:"required,email" example:"test@test.ru"`
	Password string `json:"password" validate:"required,min=8" example:"TestTest123"`
}

type AuthenticateUserResponse struct {
	Token string `json:"token"`
}

// GetUserTokenByEmail godoc
// @Summary      Authenticate by email and password
// @Description  Authenticates a registered user and returns an auth token.
// @Tags         user
// @Accept       json
// @Produce      json
// @Param        body   body        AuthenticateUserRequest     true    "Credentials"
// @Success      200    {object}    AuthenticateUserResponse
// @Failure      400    {object}    http_errors.ResponseError
// @Failure      500    {object}    http_errors.ResponseError
// @Router       /user/token/email [post]
func (h *UserHandler) GetUserTokenByEmail(w http.ResponseWriter, r *http.Request) {
	var req AuthenticateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.Send(w, err, http.StatusBadRequest)
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, h.validate, req) {
		return
	}
	token, err := h.UserAuthenticator.AuthenticateByEmail(r.Context(), req.Email, req.Password)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to authenticate the user", err)
		return
	}
	resp := AuthenticateUserResponse{
		Token: token,
	}
	if err = json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendInternal(w)
		logs.Error("failed to encode the token", err)
		return
	}
}

type GetUserInfoResponse struct {
	ID    uuid.UUID `json:"id"`
	Email string    `json:"email"`
}

// GetUserInfo godoc
// @Summary      Get current user info
// @Description  Returns info of the user.
// @Tags         user
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  GetUserInfoResponse
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /user [get]
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
