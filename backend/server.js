require("dotenv").config();
const express = require("express");
const cors = require("cors");

const careerRoutes = require("./routes/careerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check — quick way to confirm the server is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "ai-career-mentor-backend" });
});

// Routes
app.use("/api/career", careerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
