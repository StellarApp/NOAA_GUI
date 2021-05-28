const dotenv = require("dotenv");

const googleMapsClient = require("@google/maps").createClient({
  key: process.env.GOOGLE_MAP_API_KEY
});

module.exports = googleMapsClient;
