const Sequelize = require("sequelize");
const conn = require("../connection");

const { UUID, UUIDV4, STRING, DATE } = Sequelize;

const Datatype = conn.define("datatype", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  datatype: {
    type: STRING
  },
  name: {
    type: STRING
  },
  mindate: {
    type: DATE
  },
  maxdate: {
    type: DATE
  },
});

module.exports = Datatype;
