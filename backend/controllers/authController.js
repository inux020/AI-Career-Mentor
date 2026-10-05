const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserStore, createUser } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const userStore = getUserStore();
    const existingUser = userStore.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: user.id, name: user.name, email: user.email },
      token: signToken(user),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Registration failed." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const userStore = getUserStore();
    const user = userStore.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email },
      token: signToken(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed." });
  }
}

module.exports = { register, login };
