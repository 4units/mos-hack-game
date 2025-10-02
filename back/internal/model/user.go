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

type Role string

const (
	RoleUser       Role = "User"
	RoleQuizWriter Role = "QuizWriter"
	RoleAdmin      Role = "Admin"
)
