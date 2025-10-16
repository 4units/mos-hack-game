GEN_DIR := ./gen
MAIN_PATH := ../back/cmd/main.go

generate:
	rm -Rf $(GEN_DIR)
	mkdir $(GEN_DIR)
	swag init -o $(GEN_DIR) -g $(MAIN_PATH)