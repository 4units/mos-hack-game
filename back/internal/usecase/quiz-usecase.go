package usecase

import (
	"context"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/google/uuid"
	"math/rand"
	"net/http"
)

var (
	ErrNotCorrectAnswer = http_errors.NewSame("not correct quiz answer provided", http.StatusNotAcceptable)
	ErrNoQuizExists     = http_errors.NewSame("no one quiz exists", http.StatusNotFound)
)

type QuizStorage interface {
	GetAllQuiz(ctx context.Context) ([]model.Quiz, error)
	GetQuizByID(ctx context.Context, id uuid.UUID) (model.Quiz, error)
	AddQuiz(
		ctx context.Context,
		question string,
		answers []string,
		correctAnswer int,
		linkInfo string,
		answerDescription string,
	) error
	UpdateQuiz(
		ctx context.Context,
		quizID uuid.UUID,
		question string,
		answers []string,
		correctAnswer int,
		linkInfo string,
		answerDescription string,
	) error
}

type QuizUsecaseDeps struct {
	QuizStorage    QuizStorage
	UserUsecase    *UserUsecase
	BalanceUsecase *BalanceUsecase
}

type QuizUsecase struct {
	QuizUsecaseDeps
	cfg config.Quiz
}

func NewQuizUsecase(deps QuizUsecaseDeps, cfg config.Quiz) *QuizUsecase {
	return &QuizUsecase{QuizUsecaseDeps: deps, cfg: cfg}
}

func (q *QuizUsecase) TryCompleteQuiz(ctx context.Context, userID, quizID uuid.UUID, answer int) (int, error) {
	quiz, err := q.QuizStorage.GetQuizByID(ctx, quizID)
	if err != nil {
		return 0, err
	}
	if quiz.CorrectAnswer != answer {
		return 0, ErrNotCorrectAnswer
	}
	softCurrencyReward := q.cfg.SoftCurrencyReward
	if err = q.BalanceUsecase.AddSoftCurrency(ctx, userID, softCurrencyReward); err != nil {
		return 0, err
	}
	return softCurrencyReward, nil
}

func (q *QuizUsecase) GetRandomQuiz(ctx context.Context) (model.Quiz, error) {
	quizList, err := q.QuizStorage.GetAllQuiz(ctx)
	if err != nil {
		return model.Quiz{}, err
	}
	if quizList == nil || len(quizList) == 0 {
		return model.Quiz{}, ErrNoQuizExists
	}
	randNum := rand.Intn(len(quizList))
	return quizList[randNum], nil
}

func (q *QuizUsecase) AddQuiz(
	ctx context.Context, userID uuid.UUID, question string, answers []string,
	correctAnswer int, linkInfo, answerDescription string,
) error {
	if err := q.UserUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleQuizWriter,
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	if err := q.QuizStorage.AddQuiz(ctx, question, answers, correctAnswer, linkInfo, answerDescription); err != nil {
		return err
	}
	return nil
}

func (q *QuizUsecase) UpdateQuiz(
	ctx context.Context, userID, quizID uuid.UUID, question string, answers []string,
	correctAnswer int, linkInfo, answerDescription string,
) error {
	if err := q.UserUsecase.CheckUserAnyRole(
		ctx, userID, []model.Role{
			model.RoleQuizWriter,
			model.RoleAdmin,
		},
	); err != nil {
		return err
	}
	quiz, err := q.QuizStorage.GetQuizByID(ctx, quizID)
	if err != nil {
		return fmt.Errorf("failed to get quiz by id %v: %v", quizID, err)
	}
	if question != "" {
		quiz.Question = question
	}
	if correctAnswer > 0 {
		quiz.CorrectAnswer = correctAnswer
	}
	if len(answers) > 0 {
		quiz.Answers = answers
	}
	if linkInfo != "" {
		quiz.InfoLink = linkInfo
	}
	if answerDescription != "" {
		quiz.AnswerDescription = answerDescription
	}
	if err = q.QuizStorage.UpdateQuiz(
		ctx, quizID, quiz.Question, quiz.Answers, quiz.CorrectAnswer, quiz.InfoLink,
		quiz.AnswerDescription,
	); err != nil {
		return err
	}
	return nil
}
