const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getProfile, getUsers } = require("../controllers/userController");

router.get("/me", authMiddleware, getProfile);
router.get("/all", authMiddleware, getUsers);

module.exports = router;
