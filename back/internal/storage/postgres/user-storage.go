package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/internal/model"
	"github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserStorage struct {
	pool *pgxpool.Pool
}

func NewUserStorage(pool *pgxpool.Pool) *UserStorage {
	return &UserStorage{pool: pool}
}

func (u *UserStorage) GetUserByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	query, args, err := psql.
		Select("u.user_id", "u.created_at", "ep.email").
		From("users u").
		LeftJoin("email_passes ep ON u.user_id = ep.user_id").
		Where(squirrel.Eq{"u.user_id": id}).
		ToSql()
	if err != nil {
		return nil, fmt.Errorf("build query: %w", err)
	}

	var (
		user   model.User
		emailN sql.NullString
	)
	if err = u.pool.QueryRow(ctx, query, args...).Scan(&user.ID, &user.CreatedAt, &emailN); err != nil {
		return nil, fmt.Errorf("exec query: %w", err)
	}
	if emailN.Valid {
		user.Email = emailN.String
	} else {
		user.Email = ""
	}
	return &user, nil
}

func (u *UserStorage) GetIDAndPassHash(ctx context.Context, email string) (uuid.UUID, []byte, error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	query, args, err := psql.
		Select("user_id", "pass_hash").
		From("email_passes").
		Where(squirrel.Eq{"email": email}).
		ToSql()
	if err != nil {
		return uuid.Nil, nil, fmt.Errorf("build query: %w", err)
	}

	var (
		id       uuid.UUID
		passHash []byte
	)

	if err = u.pool.QueryRow(ctx, query, args...).Scan(&id, &passHash); err != nil {
		return uuid.Nil, nil, fmt.Errorf("exec query: %w", err)
	}

	return id, passHash, nil
}

func (u *UserStorage) CreateAnonymouseUser(ctx context.Context) (uuid.UUID, error) {
	return u.сreateUser(ctx)
}
func (u *UserStorage) сreateUser(ctx context.Context) (uuid.UUID, error) {
	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	query, args, err := psql.
		Insert("users").
		Columns("user_id").
		Values(squirrel.Expr("DEFAULT")).
		Suffix("RETURNING user_id").
		ToSql()
	if err != nil {
		return uuid.Nil, fmt.Errorf("build query: %w", err)
	}

	var id uuid.UUID
	if err = u.pool.QueryRow(ctx, query, args...).Scan(&id); err != nil {
		return uuid.Nil, fmt.Errorf("exec query: %w", err)
	}

	return id, nil
}

func (u *UserStorage) CreateUserByEmail(ctx context.Context, email string, hash []byte) error {
	tx, err := u.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	psql := squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)

	q1, a1, err := psql.
		Insert("users").
		Columns("user_id").
		Values(squirrel.Expr("DEFAULT")).
		Suffix("RETURNING user_id").
		ToSql()
	if err != nil {
		return fmt.Errorf("build users insert: %w", err)
	}

	var userID uuid.UUID
	if err = tx.QueryRow(ctx, q1, a1...).Scan(&userID); err != nil {
		return fmt.Errorf("exec users insert: %w", err)
	}

	q2, a2, err := psql.
		Insert("email_passes").
		Columns("user_id", "email", "pass_hash").
		Values(userID, email, hash).
		ToSql()
	if err != nil {
		return fmt.Errorf("build email_passes insert: %w", err)
	}

	if _, err = tx.Exec(ctx, q2, a2...); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return fmt.Errorf("email already exists: %w", err)
		}
		return fmt.Errorf("exec email_passes insert: %w", err)
	}

	if err = tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit tx: %w", err)
	}
	return nil
}
