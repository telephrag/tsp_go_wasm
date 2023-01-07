package main

import (
	"log"
	"net/http"
)

func ServeTSP(rw http.ResponseWriter, r *http.Request) {

}

func main() {
	fs := http.FileServer(http.Dir("./frontend"))
	if err := http.ListenAndServe("localhost:3000", fs); err != nil {
		log.Fatal(err)
	}
}
