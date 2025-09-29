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
	X int `json:"x"`
	Y int `json:"y"`
}

type Level struct {
	fieldSize        int
	blockingCellsMap map[int]map[int]struct{}
	blockingCells    []Cell
	orderCells       []Cell
	startCell        Cell
	endCell          Cell
	Answers          [][][]*ResultCell
	StartWay         [][]*ResultCell
}

type ResultCell struct {
	letter string
}

func NewLevel(fieldSize int, startCell, endCell Cell, orderCells []Cell, blockingCells []Cell) *Level {
	blockers := make(map[int]map[int]struct{})
	for _, cell := range blockingCells {
		if _, ok := blockers[cell.X]; !ok {
			blockers[cell.X] = make(map[int]struct{})
		}
		blockers[cell.X][cell.Y] = struct{}{}
	}
	if orderCells == nil {
		orderCells = make([]Cell, 0)
	}
	return &Level{
		fieldSize:        fieldSize,
		orderCells:       orderCells,
		blockingCellsMap: blockers,
		blockingCells:    blockingCells,
		startCell:        startCell,
		endCell:          endCell,
		Answers:          make([][][]*ResultCell, 0),
	}
}
