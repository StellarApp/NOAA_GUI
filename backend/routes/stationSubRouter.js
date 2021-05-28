const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../data");

router.use(express.json());

router.get("/:stateId", (req, res, next) => {
  const { stateId } = req.params;

  //fetch all the stations within a certain state
  axios
    .get(
      `https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=${stateId}&limit=1000&datacategoryid=TEMP&startdate=2018-01-01&sortorder=asc`,
      {
        headers: { token: process.env.NOAA_TOKEN }
      }
    )
    .then(response => response.data.results)
    .then(stations => res.send(stations))
    .catch(next);

  // Station.findAll()
  // .then(stations => res.send(stations))
  // .catch(next)
});

module.exports = router;
