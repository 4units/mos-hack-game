package config

import (
	"github.com/ilyakaznacheev/cleanenv"
	"time"
)

type Host struct {
	HttpPort string `yaml:"http_port" env:"HTTP_PORT"`
}

type App struct {
	ShutdownTimeout time.Duration `yaml:"shutdown_timeout"`
	LogMode         string        `yaml:"log_mode" default:"debug"`
}

type Authorization struct {
	PrivateKeyPath string        `yaml:"private_key_path" env:"PRIVATE_KEY_PATH"`
	PublicKeyPath  string        `yaml:"public_key_path" env:"PUBLIC_KEY_PATH""`
	TokenTTL       time.Duration `yaml:"token_ttl" env:"TOKEN_TTL"`
}

type Database struct {
	PostgresURL string `yaml:"host" env:"DB_URL"`
}

type Router struct {
	RequestTimeout time.Duration `yaml:"request_timeout" default:"5s" env:"REQUEST_TIMEOUT"`
}

type Balance struct {
	StartSoftCurrency int `yaml:"start_soft_currency"`
}

type ItemsPrice struct {
	LineGameHintPrice int `yaml:"line_game_hint_price"`
}

type Game struct {
	Balance    Balance    `yaml:"balance"`
	LineGame   LineGame   `yaml:"line_game"`
	ItemsPrice ItemsPrice `yaml:"items_price"`
}

type Config struct {
	Host          Host          `yaml:"host"`
	App           App           `yaml:"app"`
	Authorization Authorization `yaml:"authorization"`
	Postgres      Database      `yaml:"postgres"`
	Game          Game          `yaml:"game"`
	Router        Router        `yaml:"router"`
}

func LoadConfig(cfgPath string) (*Config, error) {
	var cfg Config
	if err := cleanenv.ReadConfig(cfgPath, &cfg); err != nil {
		return nil, err
	}
	if err := cleanenv.ReadEnv(&cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
