CREATE TABLE IF NOT EXISTS user_balance(
	user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
	soft_currency INT
);