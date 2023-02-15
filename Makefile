
build:
	GOOS=js GOARCH=wasm go build -o frontend/calc.wasm internal/calc/calc.go

run:
	go run main.go