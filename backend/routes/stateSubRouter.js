const express = require('express');
const router = express.Router();
const db = require("../data");
const {State} = db.models;

router.use(express.json());

router.get('/', (req, res, next)=>{
    State.findAll()
    .then(states => res.send(states))
    .catch(next)
  })

module.exports= router;