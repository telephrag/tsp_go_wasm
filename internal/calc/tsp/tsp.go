package tsp

import (
	"encoding/json"
	"log"
	"math"
	"sync"
	"syscall/js"
)

var graph []map[int]int // consider passing as parameters instead of storing globally

type Graph struct {
	Graph     []map[int]int `json:"adjList"`   // graph as adjancency list
	NodeCount int           `json:"nodeCount"` // amount of nodes
}

type Tsp struct {
	NodeCount int
	MinRoute  []int
	MinDist   int // current minimal path length
	Err       error
	Mu        sync.Mutex
}

func Init(graphJSON js.Value) *Tsp {

	g := Graph{}
	err := json.Unmarshal([]byte(graphJSON.String()), &g)
	if err != nil {
		log.Fatalln(err)
	}

	t := Tsp{}
	t.NodeCount = g.NodeCount // state
	t.MinRoute = make([]int, g.NodeCount)
	t.MinDist = math.MaxInt

	graph = g.Graph

	return &t
}
