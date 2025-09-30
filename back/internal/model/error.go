package model

import (
	"errors"
	http_errors "github.com/4units/mos-hack-game/back/pkg/http-errors"
	"net/http"
)

var (
	ErrUserHasNotLineGameProgress = errors.New("user has not line game progress")

	ErrLineGameNotExistsLevelInStorage = errors.New("line game level does not exist in storage")
	ErrLineGameNoFileWithLevelGroups   = errors.New("line game has no file with level groups")
	ErrLineGameGroupsIsFinished        = errors.New("line game groups is finished")
	ErrLineGameFieldSizeNotEqual       = http_errors.NewSame(
		"answers size not equal to level size",
		http.StatusBadRequest,
	)
	ErrLineGameAnswerCellsWayIncorrect = http_errors.New(
		"provided answer with wrong number of cell need to be in way", "incorrect answer", http.StatusBadRequest,
	)
	ErrLineGameAnswerOrderIncorrect = http_errors.New(
		"provided not correct answer with wrong order", "incorrect answer", http.StatusBadRequest,
	)
	ErrLineGameAnswerOutOfBorders = http_errors.New(
		"answers out of borders", "out of borders", http.StatusBadRequest,
	)
)
