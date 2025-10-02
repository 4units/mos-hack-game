package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"net/http"
)

var (
	ErrQuizDoesNotExist = http_errors.NewSame("quiz does not exist", http.StatusNotFound)
)

type QuizStorage struct {
	pool *pgxpool.Pool
	psql squirrel.StatementBuilderType
}

func NewQuizStorage(pool *pgxpool.Pool) *QuizStorage {
	return &QuizStorage{
		pool: pool,
		psql: squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar),
	}
}

func (q *QuizStorage) GetAllQuiz(ctx context.Context) ([]model.Quiz, error) {
	sql, args, err := q.psql.
		Select("quiz_id", "question", "answers", "correct_answer", "info_link", "answer_description").
		From("quiz").
		OrderBy("quiz_id").
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build query: %w", err)
	}

	rows, err := q.pool.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("exec query: %w", err)
	}
	defer rows.Close()

	var quizList []model.Quiz
	for rows.Next() {
		var (
			quiz   model.Quiz
			rawAns []byte
		)
		if err = rows.Scan(
			&quiz.ID, &quiz.Question, &rawAns, &quiz.CorrectAnswer, &quiz.InfoLink, &quiz.AnswerDescription,
		); err != nil {
			return nil, fmt.Errorf("scan row: %w", err)
		}
		if err = json.Unmarshal(rawAns, &quiz.Answers); err != nil {
			return nil, fmt.Errorf("unmarshal answers: %w", err)
		}
		quizList = append(quizList, quiz)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("rows err: %w", err)
	}

	return quizList, nil
}

func (q *QuizStorage) GetQuizByID(ctx context.Context, quizID uuid.UUID) (model.Quiz, error) {
	sql, args, err := q.psql.
		Select("quiz_id", "question", "answers", "correct_answer", "info_link", "answer_description").
		From("quiz").
		Where(squirrel.Eq{"quiz_id": quizID}).
		ToSql()
	if err != nil {
		return model.Quiz{}, fmt.Errorf("build query: %w", err)
	}

	var (
		quiz   model.Quiz
		rawAns []byte
	)
	if err = q.pool.QueryRow(ctx, sql, args...).Scan(
		&quiz.ID, &quiz.Question, &rawAns, &quiz.CorrectAnswer, &quiz.InfoLink, &quiz.AnswerDescription,
	); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.Quiz{}, ErrQuizDoesNotExist
		}
		return model.Quiz{}, fmt.Errorf("exec query: %w", err)
	}
	if err = json.Unmarshal(rawAns, &quiz.Answers); err != nil {
		return model.Quiz{}, fmt.Errorf("unmarshal answers: %w", err)
	}

	return quiz, nil
}

func (q *QuizStorage) AddQuiz(
	ctx context.Context,
	question string,
	answers []string,
	correctAnswer int,
	linkInfo string,
	answerDescription string,
) error {
	ansJSON, err := json.Marshal(answers)
	if err != nil {
		return fmt.Errorf("marshal answers: %w", err)
	}

	sql, args, err := q.psql.
		Insert("quiz").
		Columns("question", "correct_answer", "answers", "info_link", "answer_description").
		Values(question, correctAnswer, ansJSON, linkInfo, answerDescription).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert: %w", err)
	}

	if _, err = q.pool.Exec(ctx, sql, args...); err != nil {
		return fmt.Errorf("exec insert: %w", err)
	}
	return nil
}
func (q *QuizStorage) UpdateQuiz(
	ctx context.Context,
	quizID uuid.UUID,
	question string,
	answers []string,
	correctAnswer int,
	linkInfo string,
	answerDescription string,
) error {
	json, err := json.Marshal(answers)
	if err != nil {
		return fmt.Errorf("marshal answers: %w", err)
	}

	sql, args, err := q.psql.
		Update("quiz").
		SetMap(
			map[string]any{
				"question":           question,
				"correct_answer":     correctAnswer,
				"answers":            json,
				"info_link":          linkInfo,
				"answer_description": answerDescription,
			},
		).
		Where(squirrel.Eq{"quiz_id": quizID}).
		ToSql()
	if err != nil {
		return fmt.Errorf("build update: %w", err)
	}

	ct, err := q.pool.Exec(ctx, sql, args...)
	if err != nil {
		return fmt.Errorf("exec update: %w", err)
	}
	if ct.RowsAffected() == 0 {
		return ErrQuizDoesNotExist
	}
	return nil
}
