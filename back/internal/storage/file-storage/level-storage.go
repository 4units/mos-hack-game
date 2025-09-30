package file_storage

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/model"
	"os"
	"path/filepath"
	"strings"
)

var (
	ErrGroupFileDoesNotExist = errors.New("group file does not exist")
)

type lineGameGroup struct {
	FieldSize int             `json:"field_size"`
	Orders    int             `json:"orders"`
	Blockers  int             `json:"blockers"`
	Levels    []lineGameLevel `json:"levels"`
}

type lineGameLevel struct {
	FieldSize int            `json:"field_size"`
	StartCell lineGameCell   `json:"start_cell"`
	EndCell   lineGameCell   `json:"end_cell"`
	Order     []lineGameCell `json:"order"`
	Blockers  []lineGameCell `json:"blockers"`
	// Answer is answers double slice with number-side quality:
	// 0 - up, 1 - right, 2 - down, 3 - left, 4 - finish, 5 - block
	Answer [][]int `json:"answer"`
}

type lineGameCell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type LevelStorage struct {
	cfg         config.LineGame
	levelGroups map[model.LineGameLevelGroupCode][]model.LineGameLevel
}

func NewLineGameLevelStorage(cfg config.LineGame) *LevelStorage {
	return &LevelStorage{cfg: cfg, levelGroups: make(map[model.LineGameLevelGroupCode][]model.LineGameLevel)}
}

func (l *LevelStorage) GetClosestLowOrDefaultLevel(
	ctx context.Context,
	groupCode model.LineGameLevelGroupCode,
	num int,
) (model.LineGameLevel, error) {
	return l.GetLevel(ctx, groupCode, num-1)
}

func (l *LevelStorage) GetLevel(
	_ context.Context,
	groupCode model.LineGameLevelGroupCode,
	levelNum int,
) (model.LineGameLevel, error) {
	if err := l.loadGroup(groupCode); err != nil {
		return model.LineGameLevel{}, err
	}
	levels := l.levelGroups[groupCode]
	if levelNum >= len(levels) {
		return model.LineGameLevel{}, model.ErrLineGameNotExistsLevelInStorage
	}
	return levels[levelNum], nil
}

func (l lineGameGroup) GetCode() model.LineGameLevelGroupCode {
	return model.GetLevelGroupID(l.FieldSize, l.Orders, l.Blockers)
}

func (l *LevelStorage) GetNextLevel(
	_ context.Context,
	currentGroupCode model.LineGameLevelGroupCode,
	currentLevelNum int,
) (model.LineGameLevelGroupCode, int, error) {
	if err := l.loadGroup(currentGroupCode); err != nil {
		return "", 0, err
	}
	if currentLevelNum < len(l.levelGroups[currentGroupCode]) {
		return currentGroupCode, currentLevelNum + 1, nil
	}
	files, err := os.ReadDir(l.cfg.LevelsDir)
	if err != nil {
		return "", 0, fmt.Errorf("failed to read dir with levels: %w", err)
	}
	foundGroupCurrent := false
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		fileName := file.Name()
		if !strings.HasSuffix(fileName, ".json") {
			continue
		}
		filePath := filepath.Join(l.cfg.LevelsDir, fileName)
		rawFile, err := os.ReadFile(filePath)
		if err != nil {
			return "", 0, fmt.Errorf("failed to read file %s: %w", filePath, err)
		}
		var rawGroup lineGameGroup

		if err = json.Unmarshal(rawFile, &rawGroup); err != nil {
			return "", 0, fmt.Errorf("failed to unmarshal file %s: %w", filePath, err)
		}
		if rawGroup.FieldSize == 0 {
			continue
		}

		if foundGroupCurrent {
			return rawGroup.GetCode(), 0, nil
		}

		if rawGroup.GetCode() == currentGroupCode {
			foundGroupCurrent = true
			continue
		}
	}
	return "", 0, model.ErrLineGameGroupsIsFinished
}

func (l *LevelStorage) GetStartGroupCode(_ context.Context) (model.LineGameLevelGroupCode, error) {
	files, err := os.ReadDir(l.cfg.LevelsDir)
	if err != nil {
		return "", err
	}
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		fileName := file.Name()
		if !strings.HasSuffix(fileName, ".json") {
			continue
		}
		filePath := filepath.Join(l.cfg.LevelsDir, fileName)
		rawFile, err := os.ReadFile(filePath)
		if err != nil {
			return "", fmt.Errorf("failed to read file %s: %w", filePath, err)
		}
		var rawGroup lineGameGroup

		if err = json.Unmarshal(rawFile, &rawGroup); err != nil {
			return "", fmt.Errorf("failed to unmarshal file %s: %w", filePath, err)
		}
		if rawGroup.FieldSize == 0 {
			continue
		}
		return rawGroup.GetCode(), nil
	}
	return "", model.ErrLineGameNoFileWithLevelGroups
}

func (l *LevelStorage) loadGroup(groupCode model.LineGameLevelGroupCode) error {
	if _, ok := l.levelGroups[groupCode]; !ok {
		filePath := fmt.Sprintf("%s/%s.json", l.cfg.LevelsDir, groupCode)
		if _, err := os.Stat(filePath); err != nil {
			if os.IsNotExist(err) {
				return fmt.Errorf("stat file %s error: %w", filePath, ErrGroupFileDoesNotExist)
			}
			return fmt.Errorf("stat file %s error: %w", filePath, err)
		}
		fileContent, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read file of level group %s: %w", filePath, err)
		}
		var group lineGameGroup
		if err = json.Unmarshal(fileContent, &group); err != nil {
			return fmt.Errorf("failed to unmarshal file %s: %w", filePath, err)
		}
		l.levelGroups[groupCode] = make([]model.LineGameLevel, 0, len(group.Levels))
		for _, rawLevel := range group.Levels {
			level := model.LineGameLevel{
				FieldSize: rawLevel.FieldSize,
				Start: model.LineGameLevelCell{
					X: rawLevel.StartCell.X,
					Y: rawLevel.StartCell.Y,
				},
				End: model.LineGameLevelCell{
					X: rawLevel.EndCell.X,
					Y: rawLevel.EndCell.Y,
				},
				Order:    make([]model.LineGameLevelCell, 0, len(rawLevel.Order)),
				Blockers: make([]model.LineGameLevelCell, 0, len(rawLevel.Blockers)),
				Answer:   make([][]int, len(rawLevel.Answer)),
			}
			for _, cell := range rawLevel.Order {
				level.Order = append(
					level.Order, model.LineGameLevelCell{
						X: cell.X,
						Y: cell.Y,
					},
				)
			}
			for _, cell := range rawLevel.Blockers {
				level.Blockers = append(
					level.Blockers, model.LineGameLevelCell{
						X: cell.X,
						Y: cell.Y,
					},
				)
			}
			for i, answerRow := range rawLevel.Answer {
				level.Answer[i] = make([]int, 0, len(answerRow))
				for _, cellVector := range answerRow {
					level.Answer[i] = append(level.Answer[i], cellVector)
				}
			}
			l.levelGroups[groupCode] = append(l.levelGroups[groupCode], level)
		}
	}
	return nil
}
