package config

import (
	"time"
)

type LineGame struct {
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
