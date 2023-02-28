package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("./frontend"))
	if err := http.ListenAndServe("localhost:3000", fs); err != nil {
		log.Fatal(err)
	}
}
