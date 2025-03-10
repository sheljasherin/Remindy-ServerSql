require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes=require('./routes/authRoutes')
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/admin", adminRoutes);
app.use("/auth",authRoutes)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
