package main

import (
	"fmt"
)

func main() {
	levels := []*Level{
		NewLevel(4, Cell{0, 0}, Cell{3, 2}, nil, nil),
		NewLevel(
			4, Cell{0, 0}, Cell{3, 2}, []Cell{
				{2, 0},
				{0, 2},
			}, nil,
		),
		NewLevel(
			4, Cell{2, 3}, Cell{3, 3}, nil, []Cell{
				{1, 1},
				{1, 2},
			},
		),
	}
	for i, l := range levels {
		l.SearchAnswers()
		fmt.Printf("Level %d, answers count: %v\n", i+1, len(l.Answers))
		printWay(l.StartWay)
		if len(l.Answers) > 0 {
			fmt.Println()
		}
		for answerI, result := range l.Answers {
			fmt.Printf("Answer %v\n", answerI+1)
			printWay(result)
			if answerI != len(l.Answers)-1 {
				fmt.Println()
			}
		}
		if i != len(levels)-1 {
			fmt.Println()
		}
	}
}
