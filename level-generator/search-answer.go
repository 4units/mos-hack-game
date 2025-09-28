package main

import (
	"strconv"
)

func (l *Level) SearchAnswers() {
	filed := make([][]int, l.fieldSize)
	way := make([][]*ResultCell, l.fieldSize)
	blockersCount := 0
	for x := 0; x < l.fieldSize; x++ {
		filed[x] = make([]int, l.fieldSize)
		way[x] = make([]*ResultCell, l.fieldSize)
		for y := 0; y < l.fieldSize; y++ {
			cell := Cell{x, y}
			if cell.isSame(l.endCell) {
				way[x][y] = &ResultCell{letter: strconv.Itoa(len(l.orderCells) + 1)}
			}
			if cell.isSame(l.startCell) {
				way[x][y] = startResultCell
			}
			for orderCellI, orderCell := range l.orderCells {
				if cell.isSame(orderCell) {
					way[x][y] = &ResultCell{letter: strconv.Itoa(orderCellI + 1)}
				}
			}
			if blockingCellsColumn, ok := l.blockingCellsMap[x]; ok {
				if _, ok = blockingCellsColumn[y]; ok {
					way[x][y] = wallResultCell
					filed[x][y] = -1
					blockersCount++
				}
			}
		}
	}
	l.StartWay = way
	l.selectFullFilledOrder(blockersCount+1, filed, way, l.startCell, 0)
}

func (l *Level) selectFullFilledOrder(
	fillCount int, filed [][]int, way [][]*ResultCell,
	currentCell Cell, visitedOrders int,
) [][]*ResultCell {
	if currentCell.isSame(l.endCell) {
		if fillCount == l.fieldSize*l.fieldSize {
			return way
		} else {
			return nil
		}
	} else {
		if fillCount == l.fieldSize*l.fieldSize {
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
				x == l.fieldSize ||
				y == l.fieldSize ||
				filed[x][y] != 0 {
				continue
			}
			copiedFiled := make([][]int, l.fieldSize)
			copiedWay := make([][]*ResultCell, l.fieldSize)
			for i := 0; i < l.fieldSize; i++ {
				copiedFiled[i] = make([]int, l.fieldSize)
				copiedWay[i] = make([]*ResultCell, l.fieldSize)
				copy(copiedFiled[i], filed[i])
				copy(copiedWay[i], way[i])
			}
			copiedFiled[x][y] = 1
			copiedWay[currentCell.X][currentCell.Y] = getResultCellByVector(xVector, yVector)

			newCell := Cell{x, y}
			nextVisitedOrders := visitedOrders
			for orderCellI, orderCell := range l.orderCells {
				if orderCell.isSame(newCell) {
					if orderCellI != visitedOrders {
						return nil
					}
					nextVisitedOrders++
					break
				}
			}
			res := l.selectFullFilledOrder(fillCount+1, copiedFiled, copiedWay, newCell, nextVisitedOrders)
			if res != nil {
				l.Answers = append(l.Answers, res)
			}
		}
	}
	return nil
}
