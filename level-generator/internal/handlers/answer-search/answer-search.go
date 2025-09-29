package answer_search

import (
	"level-generator/internal/model"
	"strconv"
)

var vectorToResultCell = map[int]map[int]*model.ResultCell{
	1: {
		0: {
			Letter: "→",
		},
	},
	-1: {
		0: {
			Letter: "←",
		},
	},
	0: {
		1: {
			Letter: "↑",
		},
		-1: {
			Letter: "↓",
		},
	},
}

var startResultCell = &model.ResultCell{Letter: "0"}
var wallResultCell = &model.ResultCell{Letter: "X"}

func SearchAnswers(level *model.Level) {
	filed := make([][]int, level.FieldSize)
	way := make([][]*model.ResultCell, level.FieldSize)
	blockersCount := 0
	for x := 0; x < level.FieldSize; x++ {
		filed[x] = make([]int, level.FieldSize)
		way[x] = make([]*model.ResultCell, level.FieldSize)
		for y := 0; y < level.FieldSize; y++ {
			cell := model.Cell{x, y}
			if cell.Same(level.EndCell) {
				way[x][y] = &model.ResultCell{Letter: strconv.Itoa(len(level.OrderCells) + 1)}
			}
			if cell.Same(level.StartCell) {
				way[x][y] = startResultCell
			}
			for orderCellI, orderCell := range level.OrderCells {
				if cell.Same(orderCell) {
					way[x][y] = &model.ResultCell{Letter: strconv.Itoa(orderCellI + 1)}
				}
			}
			if blockingCellsColumn, ok := level.BlockingCellsMap[x]; ok {
				if _, ok = blockingCellsColumn[y]; ok {
					way[x][y] = wallResultCell
					filed[x][y] = -1
					blockersCount++
				}
			}
		}
	}
	level.StartWay = way
	selectFullFilledOrder(level, blockersCount+1, filed, way, level.StartCell, 0)
}

func selectFullFilledOrder(
	level *model.Level,
	fillCount int, filed [][]int, way [][]*model.ResultCell,
	currentCell model.Cell, visitedOrders int,
) [][]*model.ResultCell {
	if currentCell.Same(level.EndCell) {
		if fillCount == level.FieldSize*level.FieldSize {
			return way
		} else {
			return nil
		}
	} else {
		if fillCount == level.FieldSize*level.FieldSize {
			return nil
		}
	}
	filed[currentCell.X][currentCell.Y] = 1
	for xVector := -1; xVector <= 1; xVector++ {
		for yVector := -1; yVector <= 1; yVector++ {
			if _, ok := vectorToResultCell[xVector]; !ok {
				continue
			}
			if _, ok := vectorToResultCell[xVector][yVector]; !ok {
				continue
			}
			x := currentCell.X + xVector
			y := currentCell.Y + yVector
			if x < 0 ||
				y < 0 ||
				x == level.FieldSize ||
				y == level.FieldSize ||
				filed[x][y] != 0 {
				continue
			}
			copiedFiled := make([][]int, level.FieldSize)
			copiedWay := make([][]*model.ResultCell, level.FieldSize)
			for i := 0; i < level.FieldSize; i++ {
				copiedFiled[i] = make([]int, level.FieldSize)
				copiedWay[i] = make([]*model.ResultCell, level.FieldSize)
				copy(copiedFiled[i], filed[i])
				copy(copiedWay[i], way[i])
			}
			copiedFiled[x][y] = 1
			copiedWay[currentCell.X][currentCell.Y] = getResultCellByVector(xVector, yVector)

			newCell := model.Cell{x, y}
			nextVisitedOrders := visitedOrders
			for orderCellI, orderCell := range level.OrderCells {
				if orderCell.Same(newCell) {
					if orderCellI != visitedOrders {
						return nil
					}
					nextVisitedOrders++
					break
				}
			}
			res := selectFullFilledOrder(level, fillCount+1, copiedFiled, copiedWay, newCell, nextVisitedOrders)
			if res != nil {
				level.Answers = append(level.Answers, res)
			}
		}
	}
	return nil
}

func getResultCellByVector(x, y int) *model.ResultCell {
	return &model.ResultCell{vectorToResultCell[x][y].Letter}
}
