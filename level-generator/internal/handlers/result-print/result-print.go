package result_print

import (
	"level-generator/internal/model"
	"strings"
)

func GetWay(way [][]*model.ResultCell) string {
	var str strings.Builder
	for y := len(way) - 1; y >= 0; y-- {
		for x := 0; x < len(way); x++ {
			if way[x][y] == nil {
				str.WriteString("_")
			} else {
				str.WriteString(way[x][y].Letter)
			}
		}
		str.WriteString("\n")
	}
	return str.String()
}
