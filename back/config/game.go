package config

import (
	"time"
)

type Game struct {
	Balance    Balance    `yaml:"balance"`
	LineGame   LineGame   `yaml:"line_game"`
	ItemsPrice ItemsPrice `yaml:"items_price"`
	Quiz       Quiz       `yaml:"quiz"`
}

type Balance struct {
	StartSoftCurrency int `yaml:"start_soft_currency"`
}

type LineGame struct {
	CheckAnswer       bool                      `yaml:"check_answer"`
	LevelsDir         string                    `yaml:"levels_dir"`
	RewardsConditions []LineGameRewardCondition `yaml:"rewards_conditions"`
}

type LineGameRewardCondition struct {
	MaxTime time.Duration  `yaml:"max_time"`
	Reward  LineGameReward `yaml:"reward"`
}

type LineGameReward struct {
	SoftCurrency int `yaml:"soft_currency"`
}

type ItemsPrice struct {
	LineGameHintPrice int `yaml:"line_game_hint_price"`
}

type Quiz struct {
	SoftCurrencyReward int `yaml:"soft_currency_reward"`
}
