const Sequelize = require("sequelize");
const conn = require("../connection");

const { UUID, UUIDV4, STRING, DATE, DECIMAL, GEOMETRY, VIRTUAL } = Sequelize;

const Station = conn.define("station", {
  id: {
    type: STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  city: {
    type: STRING,
  },
  state: {
    type: STRING,
  },
  detail: {
    type: STRING,
  },
  latitude: {
    type: DECIMAL(9, 6),
  },
  longitude: {
    type: DECIMAL(9, 6),
  },
  point: {
    type: VIRTUAL,
    get() {
      return { lat: this.get("latitude"), lng: this.get("longtitude") };
    }
  }
});

module.exports = Station;