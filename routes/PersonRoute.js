const express = require("express");
const { register, login, getAllUsers } = require("../controller/userController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers); // Get all users

module.exports = router;
