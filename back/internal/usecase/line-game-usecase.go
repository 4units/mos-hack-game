package usecase

import (
	"context"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	"github.com/google/uuid"
	"log/slog"
	"time"
)

type LineLevelStorage interface {
	GetStartGroupCode(ctx context.Context) (model.LineGameLevelGroupCode, error)
	GetLevel(ctx context.Context, groupCode model.LineGameLevelGroupCode, levelNum int) (model.LineGameLevel, error)
	GetNextLevel(
		ctx context.Context, currentGroupCode model.LineGameLevelGroupCode,
		currentLevelNum int,
	) (model.LineGameLevelGroupCode, int, error)
	GetClosestLowOrDefaultLevel(ctx context.Context, id model.LineGameLevelGroupCode, num int) (
		model.LineGameLevel,
		error,
	)
}

type LineLevelProgressStorage interface {
	GetUserLineGameLevel(ctx context.Context, userID uuid.UUID) (
		groupCode model.LineGameLevelGroupCode,
		levelNum int,
		err error,
	)
	UpdateUserLineGameLevel(
		ctx context.Context,
		userID uuid.UUID,
		groupCode model.LineGameLevelGroupCode,
		levelNum int,
	) error
	AddUserLineGameLevel(ctx context.Context, id uuid.UUID, groupCode model.LineGameLevelGroupCode, levelNum int) error
}

type LineGameUsecaseDeps struct {
	LineGameLevelStorage    LineLevelStorage
	LineGameProgressStorage LineLevelProgressStorage
}
type LineGameUsecase struct {
	LineGameUsecaseDeps
	cfg config.LineGame
}

func NewLineGameUsecase(deps LineGameUsecaseDeps, cfg config.LineGame) *LineGameUsecase {
	return &LineGameUsecase{LineGameUsecaseDeps: deps, cfg: cfg}
}

func (l *LineGameUsecase) GetUserLevel(ctx context.Context, userID uuid.UUID) (model.LineGameLevel, error) {
	groupCode, levelNum, err := l.LineGameProgressStorage.GetUserLineGameLevel(ctx, userID)
	var level model.LineGameLevel
	if err != nil {
		if errors.Is(err, model.ErrUserHasNotLineGameProgress) {
			groupCode, err = l.LineGameLevelStorage.GetStartGroupCode(ctx)
			if err != nil {
				return model.LineGameLevel{}, fmt.Errorf("failed to get start group code: %w", err)
			}
			level, err = l.LineGameLevelStorage.GetLevel(ctx, groupCode, 0)
			if err != nil {
				return model.LineGameLevel{}, fmt.Errorf("faield to get level: %w", err)
			}
			err = l.LineGameProgressStorage.AddUserLineGameLevel(ctx, userID, groupCode, 0)
			if err != nil {
				return model.LineGameLevel{}, fmt.Errorf("failed to update player progress level: %w", err)
			}
		} else {
			return level, fmt.Errorf("failed to get user level: %w", err)
		}
	} else {
		level, err = l.LineGameLevelStorage.GetLevel(ctx, groupCode, levelNum)
		if err != nil {
			if errors.Is(err, model.ErrLineGameNotExistsLevelInStorage) {
				level, err = l.LineGameLevelStorage.GetClosestLowOrDefaultLevel(ctx, groupCode, levelNum)
			} else {
				return model.LineGameLevel{}, fmt.Errorf("failed to get level: %w", err)
			}
		}
	}
	return level, nil
}

func (l *LineGameUsecase) TryCompleteUserLevel(
	ctx context.Context,
	userID uuid.UUID,
	answer [][]int,
	timeSinceStart time.Duration,
) error {
	groupCode, levelID, err := l.LineGameProgressStorage.GetUserLineGameLevel(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user level: %w", err)
	}
	level, err := l.LineGameLevelStorage.GetLevel(ctx, groupCode, levelID)
	if err != nil {
		if errors.Is(err, model.ErrLineGameNotExistsLevelInStorage) {
			level, err = l.LineGameLevelStorage.GetClosestLowOrDefaultLevel(ctx, groupCode, levelID)
			if err != nil {
				return fmt.Errorf("failed to get closest level: %w", err)
			}
		} else {
			return fmt.Errorf("failed to get level: %w", err)
		}
	}
	if level.FieldSize != len(answer) {
		return model.ErrLineGameFieldSizeNotEqual
	}
	verifiedOrders := 0
	x, y := level.Start.X, level.Start.Y
	checkedCells := 1

	previousNumber := -1

Loop:
	for x != level.End.X || y != level.End.Y {
		numberToMove := answer[y][x]
		switch numberToMove {
		case 0:
			if previousNumber == 2 {
				return model.ErrLineGameAnswerHasLoop
			}
			y--
		case 1:
			if previousNumber == 3 {
				return model.ErrLineGameAnswerHasLoop
			}
			x++
		case 2:
			if previousNumber == 0 {
				return model.ErrLineGameAnswerHasLoop
			}
			y++
		case 3:
			if previousNumber == 3 {
				return model.ErrLineGameAnswerHasLoop
			}
			x--
		default:
			break Loop
		}
		previousNumber = numberToMove
		checkedCells++
		if verifiedOrders+1 <= len(level.Order) {
			orderCell := level.Order[verifiedOrders]
			if orderCell.X == x && orderCell.Y == y {
				verifiedOrders++
			}
		}
		if x < 0 || x >= level.FieldSize || y < 0 || y >= level.FieldSize {
			return model.ErrLineGameAnswerOutOfBorders
		}
	}
	if verifiedOrders != len(level.Order) {
		return model.ErrLineGameAnswerOrderIncorrect
	}
	expectedCellsInWay := level.FieldSize*level.FieldSize - len(level.Blockers)
	if checkedCells != expectedCellsInWay {
		return fmt.Errorf(
			"cells in way %v, expected %v error: %w", checkedCells, expectedCellsInWay,
			model.ErrLineGameAnswerCellsWayIncorrect,
		)
	}
	nextGroupCode, nextLevelNum, err := l.LineGameLevelStorage.GetNextLevel(ctx, groupCode, levelID)
	if err != nil {
		return fmt.Errorf("failed to get next level: %w", err)
	}
	if err = l.LineGameProgressStorage.UpdateUserLineGameLevel(
		ctx, userID, nextGroupCode, nextLevelNum,
	); err != nil {
		return fmt.Errorf("failed to update next level: %w", err)
	}
	slog.Debug("new level updated", slog.String("group_code", string(nextGroupCode)), slog.Int("level_id", levelID))
	return nil
}
