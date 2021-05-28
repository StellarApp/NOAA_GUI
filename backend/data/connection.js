const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

module.exports = new Sequelize(process.env.DATABASE_URL, { logging: false });