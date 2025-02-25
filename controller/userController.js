require("dotenv").config();
const { Sequelize } = require("sequelize");
const User = require("../models/Person"); // Sequelize User Model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const validateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        father: Joi.string().required(),
        birthday: Joi.date().allow(null, ""), // Allow empty values
        anniversary: Joi.date().allow(null, ""), // Allow empty values
    });
    return schema.validate(data);
};

exports.register = async (req, res) => {
    try {
        console.log("Received Registration Data:", req.body);
        const { error } = validateUser(req.body);
        if (error) {
            console.log("Validation Error:", error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            console.log("User already exists:", req.body.email);
            return res.status(409).json({ message: "User already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

    
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            father: req.body.father,
            birthday: req.body.birthday || null,
            anniversary: req.body.anniversary || null,
        });

        console.log("User Created Successfully:", newUser);

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("Login Attempt:", req.body);

        const { email, password, userType, secretKey } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log("User Not Found:", email);
            return res.status(400).json({ message: "User not found" });
        }

       
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log("Invalid Password Attempt:", email);
            return res.status(400).json({ message: "Invalid password" });
        }

 
        if (userType === "admin") {
            if (secretKey !== process.env.ADMIN_SECRET_KEY) {
                console.log("Invalid Admin Secret Key Attempt");
                return res.status(403).json({ message: "Invalid Admin Secret Key" });
            }
        }

        const token = jwt.sign({ id: user.id, userType }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("Login Successful:", user.id);
        res.json({ token, userId: user.id, userExists: true });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
