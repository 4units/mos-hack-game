package model

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

type LineGameLevelGroupCode string

type LineGameLevel struct {
	PassedCount int
	FieldSize   int
	Start       LineGameLevelCell
	End         LineGameLevelCell
	Order       []LineGameLevelCell
	Blockers    []LineGameLevelCell
	// Answer is answers double slice with number-side quality:
	// 0 - up, 1 - right, 2 - down, 3 - left, 4 - finish, 5 - block
	Answer [][]int
}

type LineGameLevelGroup struct {
	FieldSize int
	Order     int
	Blockers  int
	Levels    []LineGameLevel
}

type LineGameLevelCell struct {
	X int
	Y int
}

type LineGameReward struct {
	SoftCurrency int
}

func (level *LineGameLevel) GetLevelGroupCode() LineGameLevelGroupCode {
	return GetLevelGroupID(level.FieldSize, len(level.Order), len(level.Blockers))
}

func GetLevelGroupID(fieldSize, orders, blockers int) LineGameLevelGroupCode {
	return LineGameLevelGroupCode(fmt.Sprintf("%v_%v_%v", fieldSize, orders, blockers))
}
func (code LineGameLevelGroupCode) ParseLineGameLevelGroupID() (int, int, int, error) {
	if len(code) == 0 {
		return 0, 0, 0, errors.New("invalid id: null input")
	}
	arr := strings.Split(string(code), "_")
	if len(arr) != 3 {
		return 0, 0, 0, fmt.Errorf("invalid id: not correct format: id \"%s\"", string(code))
	}
	fieldSize, err := strconv.Atoi(arr[0])
	if err != nil {
		return 0, 0, 0, fmt.Errorf("invalid id: failed decode \"field size\": id \"%s\"", string(code))
	}
	order, err := strconv.Atoi(arr[1])
	if err != nil {
		return 0, 0, 0, fmt.Errorf("invalid id: failed decode \"order\": id \"%s\"", string(code))
	}
	blockers, err := strconv.Atoi(arr[2])
	if err != nil {
		return 0, 0, 0, fmt.Errorf("invalid id: failed decode \"blockers\": id \"%s\"", string(code))
	}
	return fieldSize, order, blockers, nil
}
