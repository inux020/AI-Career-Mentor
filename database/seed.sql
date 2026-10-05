USE ai_career_mentor;

INSERT INTO users (name, email, password_hash, education)
VALUES
  ("Demo User", "demo@example.com", "$2a$10$Q7B9Yl2ZrKxj8z2pD2Nq5eO7G8yQ6pE7mY4ZydCuXlV3mZn2nQKDG", "BSc Computer Science")
ON DUPLICATE KEY UPDATE email = email;
