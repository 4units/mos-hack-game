package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"hash/fnv"
	"log"
	"math/rand"
	"os"
	"time"
)

const generateFolder string = "./levels"

type Result struct {
	Blockers int           `json:"blockers"`
	Orders   int           `json:"orders"`
	Levels   []ResultLevel `json:"levels"`
}
type ResultLevel struct {
	FieldSize int    `json:"field_size"`
	StartCell Cell   `json:"start_cell"`
	EndCell   Cell   `json:"end_cell"`
	Order     []Cell `json:"order"`
	Blockers  []Cell `json:"blockers"`
	// Answer is answers double slice with number-side quality:
	// 0 - up, 1 - right, 2 - down, 3 - left, 4 - finish
	Answer [][]int `json:"answer"`
}

func main() {
	var fieldSize, maxTry, blockerCells, orderCells int
	var timeout int64
	flag.IntVar(&fieldSize, "size", 4, "field size")
	flag.IntVar(&maxTry, "max-try", 500, "max tries count")
	flag.IntVar(&blockerCells, "block", 2, "blocker cells")
	flag.IntVar(&orderCells, "order", 2, "order cells. additional to exist start and end points")
	flag.Int64Var(&timeout, "timeout", 60*60, "timeout of cell generation")
	flag.Parse()
	validateFlags(fieldSize, blockerCells, orderCells)

	os.Mkdir(generateFolder, os.ModePerm)
	filePath := fmt.Sprintf("%s/%v_%v_%v.json", generateFolder, fieldSize, blockerCells, orderCells)
	if _, err := os.Stat(filePath); os.IsExist(err) {
		os.Remove(filePath)
	}

	var initialData Result
	initialJSON, _ := json.MarshalIndent(initialData, "", "  ")
	os.WriteFile(filePath, initialJSON, 0644)

	fileContent, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}
	var result Result
	if len(fileContent) > 0 {
		err = json.Unmarshal(fileContent, &result)
		if err != nil {
			fmt.Println("Error unmarshaling JSON:", err)
			return
		}
	}

	defer func() {
		result.Orders = orderCells
		result.Blockers = blockerCells
		updatedJSON, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			fmt.Println("Error marshaling JSON:", err)
			return
		}
		err = os.WriteFile(filePath, updatedJSON, 0644)
		if err != nil {
			fmt.Println("Error writing file:", err)
			return
		}
		fmt.Println("generation is finished. result count is", len(result.Levels))
	}()

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()
	ch := make(chan struct{})
	defer close(ch)
	haskMap := make(map[string]struct{})
	for range maxTry {
		go func() {
			usedCells := make([]Cell, 0)
			usedCells, start := getRandomCell(usedCells, fieldSize)
			usedCells, end := getRandomCell(usedCells, fieldSize)
			blockers := make([]Cell, blockerCells)
			for i := 0; i < blockerCells; i++ {
				usedCells, blockers[i] = getRandomCell(usedCells, fieldSize)
			}
			orders := make([]Cell, orderCells)
			for i := 0; i < orderCells; i++ {
				usedCells, orders[i] = getRandomCell(usedCells, fieldSize)
			}
			level := NewLevel(fieldSize, start, end, orders, blockers)
			level.SearchAnswers()
			if len(level.Answers) > 0 {
				resultLevel := ResultLevel{
					FieldSize: fieldSize,
					StartCell: level.startCell,
					EndCell:   level.endCell,
					Order:     level.orderCells,
					Blockers:  level.blockingCells,
					Answer:    parseAnswer(level.Answers[0]),
				}
				fmt.Printf("%+v\n", result)
				fmt.Println(getWay(level.StartWay))
				fmt.Println(getWay(level.Answers[0]))
				json, err := json.Marshal(result)
				if err == nil {
					sum := string(fnv.New64().Sum(json))
					if _, ok := haskMap[sum]; !ok {
						haskMap[sum] = struct{}{}
						result.Levels = append(
							result.Levels, resultLevel,
						)
					}
				}
			}
			select {
			case <-ctx.Done():
			default:
				ch <- struct{}{}

			}
		}()
		select {
		case <-ctx.Done():
			fmt.Println("Context is timed out")
			return
		case <-ch:
		}
	}
}

func getRandomCell(usedCells []Cell, size int) ([]Cell, Cell) {
	for {
		x := rand.Intn(size)
		y := rand.Intn(size)
		used := false
		cell := Cell{x, y}
		for _, otherCells := range usedCells {
			if otherCells.isSame(cell) {
				used = true
				break
			}
		}
		if !used {
			usedCells = append(usedCells, cell)
			return usedCells, cell
		}
	}
}

//   0 1 2 3
// 0 → → → ↓
// 1 ↑ X ↓ ←
// 2 ↑ ← → f
// 3 X ↑ ← ←

var lettersToNumbers = map[string]int{
	"↓": 0,
	"→": 1,
	"↑": 2,
	"←": 3,
	"X": 5,
}

func parseAnswer(resultCells [][]*ResultCell) [][]int {
	res := make([][]int, len(resultCells))
	for i, resultCell := range resultCells {
		res[i] = make([]int, len(resultCell))
	}
	for i, resultCell := range resultCells {
		for j, cell := range resultCell {
			var number int
			if cell == nil {
				number = -1
			} else {
				var ok bool
				number, ok = lettersToNumbers[cell.letter]
				if !ok {
					number = 4 // finish
				}
			}
			res[j][i] = number
		}
	}
	return res
}

func validateFlags(fieldSize int, blockerCells int, orderCells int) {
	if fieldSize <= 1 {
		log.Fatal("flag \"size\" must be greater than 1")
	}
	if blockerCells > fieldSize*fieldSize-2 {
		log.Fatal("flag \"block\" must be less than size of field minus two")
	}
	if orderCells > fieldSize*fieldSize-2 {
		log.Fatal("flag \"order\" must be less than size of field minus two")
	}
	if blockerCells < 0 {
		log.Fatal("flag \"block\" must be greater than 0")
	}
	if orderCells < 0 {
		log.Fatal("flag \"order\" must be greater than 0")
	}
}
