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

type LineGameProgressStorage struct {
	pool *pgxpool.Pool
	psql squirrel.StatementBuilderType
}

func NewLineGameProgressStorage(pool *pgxpool.Pool) *LineGameProgressStorage {
	return &LineGameProgressStorage{
		pool: pool,
		psql: squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar),
	}
}

func (p *LineGameProgressStorage) GetUserLineGameLevel(
	ctx context.Context,
	userID uuid.UUID,
) (groupID model.LineGameLevelGroupCode, levelNum, passedCount int, err error) {
	q, args, err := p.psql.
		Select("level_group", "level_id", "passed_count").
		From("line_game_progress").
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return "", 0, 0, fmt.Errorf("build query: %w", err)
	}

	var grp string
	if err = p.pool.QueryRow(ctx, q, args...).Scan(&grp, &levelNum, &passedCount); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", 0, 0, model.ErrUserHasNotLineGameProgress
		}
		return "", 0, 0, fmt.Errorf("exec query: %w", err)
	}

	return model.LineGameLevelGroupCode(grp), levelNum, passedCount, nil
}

func (p *LineGameProgressStorage) AddUserLineGameLevel(
	ctx context.Context,
	id uuid.UUID,
	groupCode model.LineGameLevelGroupCode,
	levelNum int,
) error {
	q, args, err := p.psql.
		Insert("line_game_progress").
		Columns("user_id", "level_group", "level_id", "passed_count").
		Values(id, string(groupCode), levelNum, 0).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert: %w", err)
	}

	if _, err = p.pool.Exec(ctx, q, args...); err != nil {
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

func (p *LineGameProgressStorage) UpdateUserLineGameLevel(
	ctx context.Context,
	userID uuid.UUID,
	level model.LineGameLevelGroupCode,
	passedCount int,
	levelNum int,
) error {
	q, args, err := p.psql.
		Update("line_game_progress").
		Set("level_group", string(level)).
		Set("level_id", levelNum).
		Set("passed_count", passedCount).
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
