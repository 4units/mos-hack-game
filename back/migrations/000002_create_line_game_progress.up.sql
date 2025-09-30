CREATE TABLE IF NOT EXISTS line_game_progress(
	user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
	level_group VARCHAR(10) NOT NULL,
	level_id INT NOT NULL
);