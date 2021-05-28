const dotenv = require("dotenv").config();
const connection = require("./connection");
const axios = require("axios");
const sequelize = require("sequelize");
const { State } = require("./models/");
const { Station } = require("./models/");
// const { Category } = require("./models");
const { Datatype } = require("./models/");

const syncAndSeed = async () => {
  await connection.sync({ force: false});

  // // import csv file
  // const sql_import = "COPY stations(id, name, state, city, detail, latitude, longitude) FROM '/Users/stella/Documents/FS/My Projects/stations.csv' DELIMITER ',' CSV HEADER;"
  
  // // Fetch all state data
  // const stateData = (await axios.get(
  //   "https://www.ncdc.noaa.gov/cdo-web/api/v2/locations?locationcategoryid=ST&limit=52",
  //   { headers: { token: process.env.NOAA_TOKEN } }
  // )).data.results;
  
  // // Prepare state object list to save
  // const stateList = stateData.map(state => {
    
  //   const { id, name, mindate, maxdate } = state;
  //   return { id, name, mindate, maxdate } ;
  // });

  // // // Save state data in psql database
  // const states = (await Promise.all(
  //   stateList.map(state => State.create(state))
  // )).map(state => state.dataValues);
  
  // Fetch all datatype data
  const datatypes = (await axios.get(
    "https://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes?startdate=2018-01-01&limit=1000",
    { headers: { token: process.env.NOAA_TOKEN } }
  )).data.results;
  
  // Prepare datatype object list to save
  const datatypeList = datatypes.map(datatype => {
    
    const { id, name, mindate, maxdate } = datatype;
    return { datatype: id, name, mindate, maxdate } ;
  });

  console.log(datatypeList)
  // // Save state data in psql database
  (await Promise.all(
    datatypeList.map(datatype => Datatype.create(datatype))
  )).map(datatype => datatype.dataValues);

//   // Fetch all category data
//   const categoryData = (await axios.get(
//     "https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories?&limit=200",
//     { headers: { token: process.env.NOAA_TOKEN } }
//   )).data.results;
  
//   // Prepare category object list to save
//   const categoryList = categoryData.map(category => {
//     const { id, name} = category;
//     return { id, name} ;
//   });

//   console.log(categoryList)

//   try{
//     // Save category data in psql database
//   const categories = (await Promise.all(
//     categoryList.map(category => Category.create(category))
//   )).map(category => category.dataValues)
//   }catch(ex){
// console.log(ex)
//   }
  


  // // Fetch all the station data
  // const stationData = (await axios.get(
  //   "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?limit=1000",
  //   { headers: { token: process.env.NOAA_TOKEN } }
  // )).data.results;

  // // Prepare station object list to save
  // const stationList = stationData.map(station => {
  // //  const city = station.name
  //   const address = station.name.split(", ");
  //   const city = address[0];
  //   const state = address[1];
  //   // const state = address[1]
  //   // const stateAndCountry = address[1].split(" ");
  //   // const state = stateAndCountry[0];
  //   // const country = stateAndCountry[1];
  //   const { id, mindate, maxdate, latitude, longitude } = station;

  //   return {
  //     id,
  //     city,
  //     state,
  //     // country,
  //     mindate,
  //     maxdate,
  //     latitude,
  //     longitude
  //   };
  // });

  // // Save station data in psql database
  // const stations = (await Promise.all(
  //   stationList.map(station => Station.create(station))
  // )).map(station => station.dataValues);

  // // Token request has a limit
  // const stations = await Station.findAll().map(record => record.dataValues)

  // stations.map(station => {
  //   axios
  //     .get(
  //       `https://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories?stationId=${station.stationId}`,
  //       { headers: { token: process.env.NOAA_TOKEN } }
  //     )
  //     .then(response => response.data.results)
  //     .then(categories =>
  //       categories.map(category =>
  //         Category.create({
  //           name: category.name,
  //           categoryId: category.id,
  //           stationId: station.id
  //         })
  //       )
  //     )
  //     .catch(ex => console.log(ex));
  // });

};

module.exports = syncAndSeed;
