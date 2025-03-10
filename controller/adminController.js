const Admin = require("../model/Admin"); 
const User = require("../model/User"); 
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "sucessfully logined to admin", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: " server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (error) {
        console.error("error fetching users:", error);
        res.status(500).json({ message: "error fetching users", error });
    }
};

module.exports = { loginAdmin, getAllUsers };
