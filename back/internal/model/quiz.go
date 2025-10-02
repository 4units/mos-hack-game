package model

import (
	"github.com/google/uuid"
)

type Quiz struct {
	ID                uuid.UUID
	Question          string
	Answers           []string
	CorrectAnswer     int
	InfoLink          string
	AnswerDescription string
}
