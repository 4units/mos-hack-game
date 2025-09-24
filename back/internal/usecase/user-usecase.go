package usecase

import (
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
	CreateUserByEmail(email string, hash []byte) error
	GetUserByEmail(email string) (model.User, error)
}

type Deps struct {
	TokenProvider TokenProvider
	UserStorage   UserStorage
}

type Usecase struct {
	Deps
}

func New(deps Deps) *Usecase {
	return &Usecase{
		Deps: deps,
	}
}

func (u *Usecase) GenerateAnonymouseToken() (string, error) {
	//TODO implement me
	panic("implement me")
}

func (u *Usecase) RegisterByEmail(email, password string) error {
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
	if err = u.UserStorage.CreateUserByEmail(email, passwordHash); err != nil {
		return fmt.Errorf("failed to create user in storage by email: %w", err)
	}
	return nil
}

func (u *Usecase) AuthenticateByEmail(email, password string) (string, error) {
	user, err := u.UserStorage.GetUserByEmail(email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", ErrUserNotExists
		}
		return "", fmt.Errorf("failed to get user by email: %w", err)
	}

	if err = bcrypt.CompareHashAndPassword(user.PassHash, []byte(password)); err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return "", ErrPasswordNotCorrect
		}
		return "", err
	}

	token, err := u.TokenProvider.GenerateUserToken(user.ID)
	if err != nil {
		return "", fmt.Errorf("failed to generate user token: %w", err)
	}
	return token, nil
}
