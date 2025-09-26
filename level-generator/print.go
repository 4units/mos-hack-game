package main

import (
	"fmt"
)

func printWay(way [][]*ResultCell) {
	for y := len(way) - 1; y >= 0; y-- {
		for x := 0; x < len(way); x++ {
			if way[x][y] == nil {
				fmt.Print("_ ")
			} else {
				fmt.Printf("%s ", way[x][y].letter)
			}
		}
		fmt.Println()
	}
}
