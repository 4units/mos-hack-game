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

type QuizSaver interface {
	AddQuiz(
		ctx context.Context, userID uuid.UUID, question string, answers []string,
		correctAnswer int, infoLink, answerDescription string,
	) error
	UpdateQuiz(
		ctx context.Context, userID, quizID uuid.UUID, question string, answers []string,
		correctAnswer int, infoLink, answerDescription string,
	) error
}

type QuizProvider interface {
	GetRandomQuiz(ctx context.Context) (model.Quiz, error)
}

type QuizAnswerProcessor interface {
	TryCompleteQuiz(ctx context.Context, userID, quizID uuid.UUID, answer int) (int, error)
}

type QuizHandlerDeps struct {
	QuizProvider          QuizProvider
	NewQuizConsumer       QuizSaver
	QuizCompleteProcessor QuizAnswerProcessor
	UserIDExtractor       UserIDExtractor
}

type QuizHandler struct {
	QuizHandlerDeps
	validate *validator.Validate
}

func NewQuizHandler(deps QuizHandlerDeps) *QuizHandler {
	return &QuizHandler{
		QuizHandlerDeps: deps,
		validate:        validator.New(),
	}
}

type GetQuizResponse struct {
	ID                uuid.UUID `json:"id"`
	Question          string    `json:"question"`
	Answers           []string  `json:"answer"`
	InfoLink          string    `json:"info_link"`
	AnswerDescription string    `json:"answer_description"`
}

// GetQuiz godoc
// @Summary      Get quiz
// @Tags         quiz
// @Produce      json
// @Success      200  {object}  GetQuizResponse
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /game/quiz [get]
func (q QuizHandler) GetQuiz(w http.ResponseWriter, r *http.Request) {
	quiz, err := q.QuizProvider.GetRandomQuiz(r.Context())
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to get random quiz", err)
		return
	}
	resp := GetQuizResponse{
		ID:       quiz.ID,
		Question: quiz.Question,
		Answers:  quiz.Answers,
		InfoLink: quiz.InfoLink,
	}
	if json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to marshal quiz response", err)
		return
	}
}

type AnswerQuizRequest struct {
	ID     uuid.UUID `json:"id" validate:"required"`
	Answer int       `json:"answer"`
}

type AnswerQuizResponse struct {
	SoftCurrency int `json:"soft_currency"`
}

// AnswerQuiz godoc
// @Summary      Complete current user quiz
// @Tags         quiz
// @Produce      json
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  AnswerQuizRequest  true  "Complete quiz data"
// @Success      200  {object}  AnswerQuizResponse
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /game/quiz/answer [post]
func (q QuizHandler) AnswerQuiz(w http.ResponseWriter, r *http.Request) {
	userID, err := q.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req AnswerQuizRequest
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, q.validate, req) {
		return
	}
	reward, err := q.QuizCompleteProcessor.TryCompleteQuiz(r.Context(), userID, req.ID, req.Answer)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to complete quiz", err)
		return
	}
	resp := AnswerQuizResponse{
		SoftCurrency: reward,
	}
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to marshal quiz response", err)
	}
}

type AddQuizRequest struct {
	Question          string   `json:"question" validate:"required,lte=130,gt=0"`
	Answers           []string `json:"answers" validate:"required,lte=50,gt=0"`
	CorrectAnswer     int      `json:"correct_answer" validate:"required,gt=0"`
	InfoLink          string   `json:"info_link" validate:"required,url"`
	AnswerDescription string   `json:"answer_description"`
}

// AddQuiz godoc
// @Summary      Add quiz
// @Tags         quiz
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  AddQuizRequest  true  "Add quiz data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /game/quiz [post]
func (q QuizHandler) AddQuiz(w http.ResponseWriter, r *http.Request) {
	userID, err := q.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req AddQuizRequest
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, q.validate, req) {
		return
	}
	if err = q.NewQuizConsumer.AddQuiz(
		r.Context(), userID, req.Question, req.Answers, req.CorrectAnswer, req.InfoLink, req.AnswerDescription,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to add quiz", err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

type UpdateQuizRequest struct {
	ID                uuid.UUID `json:"id" validate:"required"`
	Question          string    `json:"question"`
	Answers           []string  `json:"answers"`
	CorrectAnswer     int       `json:"correct_answer"`
	InfoLink          string    `json:"info_link,url"`
	AnswerDescription string    `json:"answer_description"`
}

// UpdateQuiz godoc
// @Summary      Update quiz
// @Tags         quiz
// @Accept       json
// @Security     BearerAuth
// @Param        body  body  UpdateQuizRequest  true  "Update quiz data"
// @Success      201
// @Failure      400  {object}  http_errors.ResponseError
// @Failure      401  {object}  http_errors.ResponseError
// @Failure      500  {object}  http_errors.ResponseError
// @Router       /game/quiz [put]
func (q QuizHandler) UpdateQuiz(w http.ResponseWriter, r *http.Request) {
	userID, err := q.UserIDExtractor.GetVerifiedUserIDFromRequest(r)
	if err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to extract user id", err)
		return
	}
	var req UpdateQuizRequest
	if err = json.NewDecoder(r.Body).Decode(&req); err != nil {
		http_errors.SendBadRequest(w, "request body is invalid")
		logs.Error("failed to decode the request", err)
		return
	}
	if validationErr(w, q.validate, req) {
		return
	}
	if err = q.NewQuizConsumer.UpdateQuiz(
		r.Context(), userID, req.ID, req.Question, req.Answers, req.CorrectAnswer, req.InfoLink, req.AnswerDescription,
	); err != nil {
		http_errors.SendWrapped(w, err)
		logs.Error("failed to add quiz", err)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
