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

type BalanceStorage struct {
	pool *pgxpool.Pool
}

func NewBalanceStorage(pool *pgxpool.Pool) *BalanceStorage {
	return &BalanceStorage{
		pool: pool,
	}
}

func (b *BalanceStorage) GetSoftCurrency(ctx context.Context, userID uuid.UUID) (int, error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Select("soft_currency").
		From("user_balance").
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return 0, fmt.Errorf("build query: %w", err)
	}

	var soft int
	if err = b.pool.QueryRow(ctx, q, args...).Scan(&soft); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, model.ErrBalanceNotExists
		}
		return 0, fmt.Errorf("exec query: %w", err)
	}
	return soft, nil
}

func (b *BalanceStorage) UpdateSoftCurrency(ctx context.Context, userID uuid.UUID, count int) error {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Update("user_balance").
		Set("soft_currency", count).
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return fmt.Errorf("build update: %w", err)
	}

	ct, err := b.pool.Exec(ctx, q, args...)
	if err != nil {
		return fmt.Errorf("exec update: %w", err)
	}
	if ct.RowsAffected() == 0 {
		return model.ErrBalanceNotExists
	}
	return nil
}

func (b *BalanceStorage) GetUserBalance(ctx context.Context, userID uuid.UUID) (model.UserBalance, error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Select("soft_currency").
		From("user_balance").
		Where(squirrel.Eq{"user_id": userID}).
		ToSql()
	if err != nil {
		return model.UserBalance{}, fmt.Errorf("build query: %w", err)
	}

	var ub model.UserBalance
	if err = b.pool.QueryRow(ctx, q, args...).Scan(&ub.SoftCurrency); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.UserBalance{}, model.ErrBalanceNotExists
		}
		return model.UserBalance{}, fmt.Errorf("exec query: %w", err)
	}
	return ub, nil
}

func (b *BalanceStorage) CreateUserBalance(ctx context.Context, userID uuid.UUID, balance model.UserBalance) error {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q, args, err := psql.
		Insert("user_balance").
		Columns("user_id", "soft_currency").
		Values(userID, balance.SoftCurrency).
		ToSql()
	if err != nil {
		return fmt.Errorf("build insert: %w", err)
	}

	if _, err = b.pool.Exec(ctx, q, args...); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return fmt.Errorf("balance already exists for user %s: %w", userID, err)
		}
		return fmt.Errorf("exec insert: %w", err)
	}
	return nil
}
