package main

func getResultCellByVector(x, y int) *ResultCell {
	return &ResultCell{vectorToResultCell[x][y].letter}
}

func (c Cell) isSame(cell Cell) bool {
	return c.X == cell.X && c.Y == cell.Y
}
