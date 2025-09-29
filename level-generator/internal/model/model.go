package model

type Level struct {
	FieldSize        int
	BlockingCellsMap map[int]map[int]struct{}
	BlockingCells    []Cell
	OrderCells       []Cell
	StartCell        Cell
	EndCell          Cell
	Answers          [][][]*ResultCell
	StartWay         [][]*ResultCell
}

type ResultCell struct {
	Letter string
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
		FieldSize:        fieldSize,
		OrderCells:       orderCells,
		BlockingCellsMap: blockers,
		BlockingCells:    blockingCells,
		StartCell:        startCell,
		EndCell:          endCell,
		Answers:          make([][][]*ResultCell, 0),
	}
}
