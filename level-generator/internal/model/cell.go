package model

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (c Cell) Same(cell Cell) bool {
	return c.X == cell.X && c.Y == cell.Y
}
