package main

import (
	"flag"
	"github.com/4units/mos-hack-game/back/config"
	"github.com/4units/mos-hack-game/back/internal/app"
	"github.com/joho/godotenv"
	"log"
)

//  @title          MosHackGame API
//  @version        1.0
//  @description    Server for Moscow hackathon game project.

//  @contact.name   API Support
//  @contact.email  iamvkosarev@gmail.com

//  @host           4units.ru
//  @BasePath       /api
//  @schemes        https

// @securityDefinitions.apikey  BearerAuth
// @in              header
// @name            Authorization
// @description     Type "Bearer <token>" to authenticate. Example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
