CREATE TABLE IF NOT EXISTS quiz(
	quiz_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	question VARCHAR(130) NOT NULL,
	correct_answer INT NOT NUll,
	answers JSONB NOT NULL,
	answer_description TEXT,
	info_link TEXT NOT NUll
);

INSERT INTO roles(role_id, name)
VALUES (2, 'quiz_writer');