package config

type Game struct {
	Balance           Balance    `yaml:"balance"`
	LineGame          LineGame   `yaml:"line_game"`
	ItemsPrice        ItemsPrice `yaml:"items_price"`
	Quiz              Quiz       `yaml:"quiz"`
	LineGameLevelsDir string     `yaml:"levels_dir"`
}

type Balance struct {
	StartSoftCurrency int `yaml:"start_soft_currency" json:"start_soft_currency"`
}

type LineGame struct {
	CheckAnswer       bool                      `yaml:"check_answer" json:"check_answer"`
	RewardsConditions []LineGameRewardCondition `yaml:"rewards_conditions" json:"rewards_conditions"`
}

type LineGameRewardCondition struct {
	// MaxTime is max time in seconds
	MaxTime float64        `yaml:"max_time" json:"max_time"`
	Reward  LineGameReward `yaml:"reward" json:"reward"`
}

type LineGameReward struct {
	SoftCurrency int `yaml:"soft_currency" json:"soft_currency"`
}

type ItemsPrice struct {
	LineGameHintPrice            int `yaml:"line_game_hint_price" json:"line_game_hint_price"`
	LineGameStopTimeBoosterPrice int `yaml:"line_game_stop_time_booster_price" json:"line_game_stop_time_booster_price"`
}

type Quiz struct {
	SoftCurrencyReward int `yaml:"soft_currency_reward" json:"soft_currency_reward"`
}
