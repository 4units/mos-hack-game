package model

import (
	"github.com/google/uuid"
	"time"
)

type UserToken struct {
	UserID     uuid.UUID `json:"user_id"`
	ExpireTime time.Time `json:"expire_time"`
}
