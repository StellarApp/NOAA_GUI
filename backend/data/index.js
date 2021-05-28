// postgres database connection
const connection = require("./connection");
const syncAndSeed = require("./syncAndSeed");

// Models
const { Station, State, Datatype } = require("./models");

// // Relationships
// Station.hasMany(Category);
// Category.belongsTo(Station);

module.exports = {
  connection,
  models: {
    State,
    Station,
    Datatype,
    // Category,
  },
  syncAndSeed
};
