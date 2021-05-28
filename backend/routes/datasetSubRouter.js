const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../data");

router.use(express.json());

router.get("/:stateId/:stationId", (req, res, next) => {
  console.log("query--->", req.params);
  const { stateId, stationId } = req.params;

  axios
    .get(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets?locationid=${stateId}&stationid=${stationId}&startdate=2018-01-01`,
      { headers: { token: process.env.NOAA_TOKEN } }
    )
    .then(response => response.data.results)
    .then(datasets => res.send(datasets))
    .catch(next);
});

module.exports = router;
