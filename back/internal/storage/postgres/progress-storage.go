package postgres

import (
	"context"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/model"
	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ProgressStorage struct {
	pool *pgxpool.Pool
}

func (p ProgressStorage) AddUserLineGameLevel(
	ctx context.Context,
	id uuid.UUID,
	groupCode model.LineGameLevelGroupCode,
	levelNum int,
) error {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Insert("line_game_progress").
		Columns("user_id", "level_group", "level_id").
		Values(id, string(groupCode), levelNum).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert: %w", err)
	}

	if _, err = p.pool.Exec(ctx, q, args...); err != nil {
		// Разруливаем типовые коды PG
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			switch pgErr.Code {
			case "23505":
				return fmt.Errorf("line_game_progress already exists for user %s: %w", id, err)
			case "23503":
				return fmt.Errorf("fk violation for user %s (users.user_id): %w", id, err)
			}
		}
		return fmt.Errorf("exec insert: %w", err)
	}
	return nil
}

func (p ProgressStorage) GetUserLineGameLevel(
	ctx context.Context,
	userID uuid.UUID,
) (groupID model.LineGameLevelGroupCode, levelNum int, err error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Select("level_group", "level_id").
		From("line_game_progress").
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return "", 0, fmt.Errorf("build query: %w", err)
	}

	var grp string
	if err = p.pool.QueryRow(ctx, q, args...).Scan(&grp, &levelNum); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", 0, model.ErrUserHasNotLineGameProgress
		}
		return "", 0, fmt.Errorf("exec query: %w", err)
	}

	return model.LineGameLevelGroupCode(grp), levelNum, nil
}

func (p ProgressStorage) UpdateUserLineGameLevel(
	ctx context.Context,
	userID uuid.UUID,
	level model.LineGameLevelGroupCode,
	levelNum int,
) error {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Update("line_game_progress").
		SetMap(
			map[string]any{
				"level_group": string(level),
				"level_id":    levelNum,
			},
		).
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return fmt.Errorf("build update: %w", err)
	}

	ct, err := p.pool.Exec(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("exec update: %w", err)
	}
	if ct.RowsAffected() == 0 {
		return model.ErrUserHasNotLineGameProgress
	}
	return nil
}

func NewProgressStorage(pool *pgxpool.Pool) *ProgressStorage {
	return &ProgressStorage{
		pool: pool,
	}
}
