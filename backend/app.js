require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./data");
const { State, Category, Station } = db.models;

// Routes
const stateRouter = require("./routes/stateSubRouter");
const categoryRouter = require("./routes/categorySubRouter");
const stationRouter = require("./routes/stationSubRouter");
const datasetRouter = require("./routes/datasetSubRouter");
const dataRouter = require("./routes/dataSubRouter");

const app = express();
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/api/states", stateRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/stations", stationRouter);
app.use("/api/datasets", datasetRouter);
app.use("/api/data", dataRouter);

app.use((err, req, res, next) => {
  let message = "Something's not right";
  if (err.errors) {
    message = err.errors[0].message;
  } else if (err.message) {
    message = err.message;
  }

  if (err) {
    res.status(err.status || 500).send({ message });
  }
});

module.exports = app;
