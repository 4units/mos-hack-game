ALTER TABLE line_game_progress
ADD COLUMN IF NOT EXISTS passed_count INT DEFAULT 0;