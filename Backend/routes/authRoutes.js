const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ valid: true, userId: req.user.id });
});

module.exports = router;