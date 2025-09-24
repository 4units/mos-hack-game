package usecase

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/golang-jwt/jwt/v5/request"
	"github.com/google/uuid"
	"net/http"
	"os"
	"time"
)

var (
	ErrTokenNotFound = http_errors.New(
		"token not found inside the request arguments or headers",
		"the request does not contain header Authorization or it is empty",
		http.StatusBadRequest,
	)
	ErrSignatureInvalid = http_errors.NewSame(
		"token signature is invalid",
		http.StatusUnauthorized,
	)
	ErrTokenExpired = http_errors.NewSame(
		"token is expired",
		http.StatusUnauthorized,
	)
	ErrParseClaims = errors.New("failed to parse claims")
)

const (
	claimUserId     = "user_id"
	claimExpireTime = "expire_time"
)

type claims struct {
	jwt.RegisteredClaims
	userId uuid.UUID
}

type TokenUsecase struct {
	config    config.Authorization
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
}

func NewTokenUsecase(cfg config.Authorization) (*TokenUsecase, error) {
	signBytes, err := os.ReadFile(cfg.PrivateKeyPath)
	if err != nil {
		return nil, err
	}
	signKey, err := jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		return nil, err
	}

	verifyBytes, err := os.ReadFile(cfg.PublicKeyPath)
	if err != nil {
		return nil, err
	}

	verifyKey, err := jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		return nil, err
	}

	return &TokenUsecase{
		config:    cfg,
		signKey:   signKey,
		verifyKey: verifyKey,
	}, nil
}

func (u *TokenUsecase) GetUserIDFromRequest(r *http.Request) (uuid.UUID, error) {
	token, err := request.ParseFromRequest(
		r, request.OAuth2Extractor, func(token *jwt.Token) (any, error) {
			return u.verifyKey, nil
		}, request.WithClaims(&claims{}),
	)
	if err != nil {
		switch {
		case errors.Is(err, request.ErrNoTokenInRequest):
			return uuid.Nil, ErrTokenNotFound
		case errors.Is(err, jwt.ErrSignatureInvalid):
			return uuid.Nil, ErrSignatureInvalid
		case errors.Is(err, jwt.ErrTokenExpired):
			return uuid.Nil, ErrTokenExpired
		default:
			return uuid.Nil, err
		}
	}

	switch c := token.Claims.(type) {
	case claims:
		return c.userId, nil
	default:
		return uuid.Nil, ErrParseClaims
	}
}

func (u *TokenUsecase) GenerateUserToken(userID uuid.UUID) (string, error) {
	t := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		&claims{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(u.config.TokenTTL)),
			},
			userId: userID,
		},
	)
	tokenString, err := t.SignedString(u.signKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}
	return tokenString, nil
}
