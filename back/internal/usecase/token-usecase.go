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
	ErrTokenVerification = http_errors.New(
		"failed to verify token", "token signature is invalid",
		http.StatusUnauthorized,
	)
	ErrTokenDecryption = http_errors.New(
		"failed to decrypt token", "token signature is invalid",
		http.StatusUnauthorized,
	)
	ErrParseClaims = errors.New("failed to parse Claims")
)

type Claims struct {
	jwt.RegisteredClaims
	UserId uuid.UUID `json:"user_id"`
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

func (u *TokenUsecase) GetVerifiedUserIDFromRequest(r *http.Request) (uuid.UUID, error) {
	token, err := request.ParseFromRequest(
		r, request.OAuth2Extractor, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok || t.Method.Alg() != jwt.SigningMethodRS256.Alg() {
				return nil, fmt.Errorf("unexpected signing method: %s", t.Method.Alg())
			}
			return u.verifyKey, nil
		}, request.WithClaims(&Claims{}),
	)
	if err != nil {
		switch {
		case errors.Is(err, request.ErrNoTokenInRequest):
			return uuid.Nil, ErrTokenNotFound
		case errors.Is(err, jwt.ErrSignatureInvalid):
			return uuid.Nil, ErrSignatureInvalid
		case errors.Is(err, jwt.ErrTokenExpired):
			return uuid.Nil, ErrTokenExpired
		case errors.Is(err, rsa.ErrVerification):
			return uuid.Nil, ErrTokenVerification
		case errors.Is(err, rsa.ErrDecryption):
			return uuid.Nil, ErrTokenDecryption
		default:
			return uuid.Nil, err
		}
	}

	cls, ok := token.Claims.(*Claims)
	if !ok {
		return uuid.Nil, ErrParseClaims
	}
	return cls.UserId, nil
}

func (u *TokenUsecase) GenerateUserToken(userID uuid.UUID) (string, error) {
	t := jwt.NewWithClaims(
		jwt.SigningMethodRS256,
		&Claims{
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(u.config.TokenTTL)),
			},
			UserId: userID,
		},
	)
	tokenString, err := t.SignedString(u.signKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}
	return tokenString, nil
}
