const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../data");

router.use(express.json());

router.get("/:stationId", (req, res, next) => {
  const { stationId } = req.params;
  axios
    .get(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories?stationid=${stationId}`,
      { headers: { token: process.env.NOAA_TOKEN } }
    )
    // .then(data => console.log(data))
    .then(response => response.data.results)
    .then(categories => res.send(categories))
    .catch(next);
});

module.exports = router;
