package usecase

import (
	"context"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"github.com/google/uuid"
	"log/slog"
	"net/http"
	"time"
)

var (
	ErrNotEnoughSoftCurrency = http_errors.NewSame("not enough soft currency", http.StatusForbidden)
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
		levelNum, passedCount int,
		err error,
	)
	UpdateUserLineGameLevel(
		ctx context.Context,
		userID uuid.UUID,
		groupCode model.LineGameLevelGroupCode,
		passedCount int,
		levelNum int,
	) error
	AddUserLineGameLevel(ctx context.Context, id uuid.UUID, groupCode model.LineGameLevelGroupCode, levelNum int) error
}

type LineGameUsecaseDeps struct {
	LineGameLevelStorage    LineLevelStorage
	LineGameProgressStorage LineLevelProgressStorage
	BalanceUsecase          *BalanceUsecase
}
type LineGameUsecase struct {
	LineGameUsecaseDeps
	lineGameCfg config.LineGame
	pricesCfg   config.ItemsPrice
}

func NewLineGameUsecase(
	deps LineGameUsecaseDeps,
	lineGameCfg config.LineGame,
	pricesCfg config.ItemsPrice,
) *LineGameUsecase {
	return &LineGameUsecase{LineGameUsecaseDeps: deps, lineGameCfg: lineGameCfg, pricesCfg: pricesCfg}
}

func (l *LineGameUsecase) GetUserLevel(ctx context.Context, userID uuid.UUID) (model.LineGameLevel, error) {
	groupCode, levelNum, passedCount, err := l.LineGameProgressStorage.GetUserLineGameLevel(ctx, userID)
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
			return model.LineGameLevel{}, fmt.Errorf("failed to get user level: %w", err)
		}
	} else {
		level, err = l.LineGameLevelStorage.GetLevel(ctx, groupCode, levelNum)
		if err != nil {
			if errors.Is(err, model.ErrLineGameNotExistsLevelInStorage) {
				slog.Warn(
					"User level not exists in the storage", slog.String("group_code", string(groupCode)),
					slog.Int("level_num", levelNum),
				)
				level, err = l.LineGameLevelStorage.GetClosestLowOrDefaultLevel(ctx, groupCode, levelNum)
			} else {
				return model.LineGameLevel{}, fmt.Errorf("failed to get level: %w", err)
			}
		}
	}
	level.PassedCount = passedCount
	return level, nil
}

func (l *LineGameUsecase) TryCompleteUserLevel(
	ctx context.Context,
	userID uuid.UUID,
	answer [][]int,
	timeSinceStart time.Duration,
) (model.LineGameReward, error) {
	groupCode, levelNum, passedCount, err := l.LineGameProgressStorage.GetUserLineGameLevel(ctx, userID)
	if err != nil {
		return model.LineGameReward{}, fmt.Errorf("failed to get user level: %w", err)
	}

	if l.lineGameCfg.CheckAnswer {
		level, err := l.LineGameLevelStorage.GetLevel(ctx, groupCode, levelNum)
		if err != nil {
			if errors.Is(err, model.ErrLineGameNotExistsLevelInStorage) {
				level, err = l.LineGameLevelStorage.GetClosestLowOrDefaultLevel(ctx, groupCode, levelNum)
				if err != nil {
					return model.LineGameReward{}, fmt.Errorf("failed to get closest level: %w", err)
				}
			} else {
				return model.LineGameReward{}, fmt.Errorf("failed to get level: %w", err)
			}
		}
		if level.FieldSize != len(answer) {
			return model.LineGameReward{}, model.ErrLineGameFieldSizeNotEqual
		}
		verifiedOrders := 0
		x, y := level.Start.X, level.Start.Y
		checkedCells := 1

	Loop:
		for x != level.End.X || y != level.End.Y {
			numberToMove := answer[y][x]
			switch numberToMove {
			case 0:
				y--
			case 1:
				x++
			case 2:
				y++
			case 3:
				x--
			default:
				break Loop
			}
			checkedCells++
			if verifiedOrders+1 <= len(level.Order) {
				orderCell := level.Order[verifiedOrders]
				if orderCell.X == x && orderCell.Y == y {
					verifiedOrders++
				}
			}
			if x < 0 || x >= level.FieldSize || y < 0 || y >= level.FieldSize {
				return model.LineGameReward{}, model.ErrLineGameAnswerOutOfBorders
			}
		}
		if verifiedOrders != len(level.Order) {
			return model.LineGameReward{}, model.ErrLineGameAnswerOrderIncorrect
		}
		expectedCellsInWay := level.FieldSize*level.FieldSize - len(level.Blockers)
		if checkedCells != expectedCellsInWay {
			return model.LineGameReward{}, fmt.Errorf(
				"cells in way %v, expected %v error: %w", checkedCells, expectedCellsInWay,
				model.ErrLineGameAnswerCellsWayIncorrect,
			)
		}
	}

	nextGroupCode, nextLevelNum, err := l.LineGameLevelStorage.GetNextLevel(ctx, groupCode, levelNum)
	if err != nil {
		return model.LineGameReward{}, fmt.Errorf("failed to get next level: %w", err)
	}
	if err = l.LineGameProgressStorage.UpdateUserLineGameLevel(
		ctx, userID, nextGroupCode, passedCount+1, nextLevelNum,
	); err != nil {
		return model.LineGameReward{}, fmt.Errorf("failed to update next level: %w", err)
	}

	rewardCfg := l.lineGameCfg.RewardsConditions[len(l.lineGameCfg.RewardsConditions)-1].Reward
	for _, condition := range l.lineGameCfg.RewardsConditions {
		if condition.MaxTime > timeSinceStart {
			rewardCfg = condition.Reward
			break
		}
	}
	if err = l.BalanceUsecase.AddSoftCurrency(ctx, userID, rewardCfg.SoftCurrency); err != nil {
		return model.LineGameReward{}, fmt.Errorf("failed to update soft currency balance: %w", err)
	}
	return model.LineGameReward{
		SoftCurrency: rewardCfg.SoftCurrency,
	}, nil
}

func (l *LineGameUsecase) GetLevelHint(ctx context.Context, userID uuid.UUID) ([][]int, error) {
	level, err := l.GetUserLevel(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user level: %w", err)
	}
	if err = l.BalanceUsecase.TrySpendSoftCurrency(ctx, userID, l.pricesCfg.LineGameHintPrice); err != nil {
		return nil, fmt.Errorf("failed to spend soft currency: %w", err)
	}
	return level.Answer, nil
}

func (l *LineGameUsecase) GetTimeStopBooster(ctx context.Context, userID uuid.UUID) error {
	if err := l.BalanceUsecase.TrySpendSoftCurrency(ctx, userID, l.pricesCfg.LineGameHintPrice); err != nil {
		return fmt.Errorf("failed to spend soft currency: %w", err)
	}
	return nil
}
