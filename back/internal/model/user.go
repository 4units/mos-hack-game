package model

import (
	"github.com/google/uuid"
	"time"
)

type User struct {
	ID        uuid.UUID
	Email     string
	CreatedAt time.Time
}
