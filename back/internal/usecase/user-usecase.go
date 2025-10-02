package usecase

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"unicode"
)

var (
	ErrPasswordTooShort = http_errors.NewSame("password is too short", http.StatusBadRequest)
	ErrUserNotExists    = http_errors.New(
		"user not exists", "password or user name is not correct",
		http.StatusBadRequest,
	)
	ErrPasswordNotCorrect = http_errors.New(
		"password is not correct",
		"password or user name is not correct", http.StatusBadRequest,
	)
	ErrNoUpperCase = http_errors.NewSame(
		"password should contains at least one uppercase latter",
		http.StatusBadRequest,
	)
	ErrNoLowerCase = http_errors.NewSame(
		"password should contains at least one lowercase latter",
		http.StatusBadRequest,
	)
	ErrNoLetter = http_errors.NewSame(
		"password should contains at least one letter",
		http.StatusBadRequest,
	)
	ErrNoNumber = http_errors.NewSame(
		"password should contains at least one number",
		http.StatusBadRequest,
	)
)

type TokenProvider interface {
	GenerateUserToken(userID uuid.UUID) (string, error)
}

type UserStorage interface {
	CreateUserByEmail(ctx context.Context, email string, hash []byte) error
	GetIDAndPassHash(ctx context.Context, email string) (uuid.UUID, []byte, error)
	CreateAnonymouseUser(ctx context.Context) (uuid.UUID, error)
	GetUserByID(ctx context.Context, id uuid.UUID) (*model.User, error)
	GetUserRolesByID(ctx context.Context, id uuid.UUID) ([]model.Role, error)
}

type UserUsecaseDeps struct {
	TokenProvider TokenProvider
	UserStorage   UserStorage
}

type UserUsecase struct {
	UserUsecaseDeps
}

func New(deps UserUsecaseDeps) *UserUsecase {
	return &UserUsecase{
		UserUsecaseDeps: deps,
	}
}

func (u *UserUsecase) GetUserInfo(ctx context.Context, userID uuid.UUID) (*model.User, error) {
	user, err := u.UserStorage.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (u *UserUsecase) CreateAnonymouseUser(ctx context.Context) (string, error) {
	userID, err := u.UserStorage.CreateAnonymouseUser(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to create anonymous user: %w", err)
	}
	token, err := u.TokenProvider.GenerateUserToken(userID)
	if err != nil {
		return "", fmt.Errorf("failed to generate user token: %w", err)
	}
	return token, nil
}

func (u *UserUsecase) RegisterByEmail(ctx context.Context, email, password string) error {
	var (
		hasUpperCaseLetters bool
		hasLowerCaseLetters bool
		hasNumber           bool
		hasLetter           bool
	)

	if len(password) < 8 {
		return ErrPasswordTooShort
	}

	for _, char := range password {
		if unicode.IsUpper(char) {
			hasUpperCaseLetters = true
		}
		if unicode.IsLower(char) {
			hasLowerCaseLetters = true
		}
		if unicode.IsNumber(char) {
			hasNumber = true
		}
		if unicode.IsLetter(char) {
			hasLetter = true
		}
	}
	switch {
	case !hasUpperCaseLetters:
		return ErrNoUpperCase
	case !hasLowerCaseLetters:
		return ErrNoLowerCase
	case !hasNumber:
		return ErrNoNumber
	case !hasLetter:
		return ErrNoLetter
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	if err = u.UserStorage.CreateUserByEmail(ctx, email, passwordHash); err != nil {
		return fmt.Errorf("failed to create user in storage by email: %w", err)
	}
	return nil
}

func (u *UserUsecase) AuthenticateByEmail(ctx context.Context, email, password string) (string, error) {
	userID, passHash, err := u.UserStorage.GetIDAndPassHash(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", ErrUserNotExists
		}
		return "", fmt.Errorf("failed to get user by email: %w", err)
	}

	if err = bcrypt.CompareHashAndPassword(passHash, []byte(password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return "", ErrPasswordNotCorrect
		}
		return "", err
	}

	token, err := u.TokenProvider.GenerateUserToken(userID)
	if err != nil {
		return "", fmt.Errorf("failed to generate user token: %w", err)
	}
	return token, nil
}

func (u *UserUsecase) CheckUserAnyRole(ctx context.Context, userID uuid.UUID, needRoleList []model.Role) error {
	roles, err := u.UserStorage.GetUserRolesByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user role by id: %w", err)
	}
	hasRole := false
	for _, needRole := range needRoleList {
		for _, userRole := range roles {
			if userRole == needRole {
				hasRole = true
				break
			}
		}
		if hasRole {
			break
		}
	}
	if !hasRole {
		return model.ErrUserRoleHasNoAccess
	}
	return nil
}
