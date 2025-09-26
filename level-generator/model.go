package main

var vectorToResultCell = map[int]map[int]*ResultCell{
	1: {
		0: {
			letter: "→",
		},
	},
	-1: {
		0: {
			letter: "←",
		},
	},
	0: {
		1: {
			letter: "↑",
		},
		-1: {
			letter: "↓",
		},
	},
}

var startResultCell = &ResultCell{letter: "0"}
var wallResultCell = &ResultCell{letter: "X"}

type Cell struct {
	x int
	y int
}

type Level struct {
	fieldSize     int
	blockingCells map[int]map[int]struct{}
	orderCells    []Cell
	startCell     Cell
	endCell       Cell
	Answers       [][][]*ResultCell
	StartWay      [][]*ResultCell
}

type ResultCell struct {
	letter string
}

func NewLevel(fieldSize int, startCell, endCell Cell, orderCells []Cell, blockingCells []Cell) *Level {
	blockers := make(map[int]map[int]struct{})
	for _, cell := range blockingCells {
		if _, ok := blockers[cell.x]; !ok {
			blockers[cell.x] = make(map[int]struct{})
		}
		blockers[cell.x][cell.y] = struct{}{}
	}
	if orderCells == nil {
		orderCells = make([]Cell, 0)
	}
	return &Level{
		fieldSize:     fieldSize,
		orderCells:    orderCells,
		blockingCells: blockers,
		startCell:     startCell,
		endCell:       endCell,
		Answers:       make([][][]*ResultCell, 0),
	}
}
