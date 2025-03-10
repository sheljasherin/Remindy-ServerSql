const express = require("express");
const { loginAdmin } = require("../controller/adminController");
const { getAllUsers } = require("../controller/adminController");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/users", getAllUsers);
module.exports = router;
