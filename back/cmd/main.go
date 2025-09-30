package main

import (
	"flag"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/app"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	var cfgPath, envPath string
	flag.StringVar(&cfgPath, "config", "./config/config.dev.yaml", "path to config")
	flag.StringVar(&envPath, "env", "./.env", "path to config")
	flag.Parse()

	err := godotenv.Load(envPath)
	if err != nil {
		log.Fatalf("loading .env file error %s\n", err)
	}

	cfg, err := config.LoadConfig(cfgPath)
	if err != nil {
		log.Fatalf("loading config error: %s\n", err)
	}
	if err = app.Run(cfg); err != nil {
		log.Fatalf("app error: %s\n", err)
	}
}
