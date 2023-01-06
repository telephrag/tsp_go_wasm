package main

import (
	"fmt"
	"syscall/js"
	"time"
	"tsp_wasm/internal/calc/tsp"
)

func measureExecTime(f func()) int64 {
	start := time.Now()
	f()
	elapsed := time.Since(start)
	return elapsed.Microseconds()
}

func calc() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) any {
		t := tsp.Init(args[0])
		et := measureExecTime(t.Solve)

		fmt.Println(t.MinRoute)
		fmt.Println(t.MinDist)
		fmt.Println(et)

		return 0 //[]string{fmt.Sprint(t.MinRoute), fmt.Sprint(t.MinDist), fmt.Sprint(et)}
	})
}

func main() {
	fmt.Println("Chirtkem, mudila. Mon WASM gojyas'ko ali.")
	js.Global().Set("calc", calc())
	exit := make(chan struct{})
	<-exit
}
