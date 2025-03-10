require('dotenv').config();
const { Sequelize } = require('sequelize');

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER||'root', process.env.DB_PASSWORD||null, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging:false
});
const connectDB = async () => {
    try {
        await database.authenticate();
        console.log("Database connected successfully!");
        await database.sync({ alter: true });
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

module.exports = { database, connectDB };
