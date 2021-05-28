const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../data");

router.use(express.json());

router.get("/:stationId/:dataset/:startDate/:endDate", (req, res, next) => {
  console.log('queries--->', req.params)
  const { stationId, dataset, startDate, endDate } = req.params;
  axios
    .get(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?stationid=${stationId}&datasetid=${dataset}&startdate=${startDate}&enddate=${endDate}`,
      { headers: { token: process.env.NOAA_TOKEN } }
    )
    // .then(data => console.log(data))
    .then(response => response.data.results)
    .then(datasets => res.send(datasets))
    .catch(next);
});

module.exports = router;
