require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/PersonRoute");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
sequelize.sync().then(() => {
    console.log("Database synced successfully.");
    app.listen(5001, () => console.log("Server running on port 5001"));
}).catch(err => console.error("Database sync error:", err));

