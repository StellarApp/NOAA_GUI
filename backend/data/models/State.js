const Sequelize = require("sequelize");
const conn = require("../connection");

const { UUID, UUIDV4, STRING, DATE, DECIMAL, GEOMETRY, VIRTUAL } = Sequelize;

const State = conn.define("state", {
  id: {
    type: STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  abbreviation: {
    type: STRING,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
});

module.exports = State;