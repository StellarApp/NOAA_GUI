import axios from "axios";
import {
  SET_STATES,
  SET_CATEGORIES,
  SET_STATIONS,
  SET_DATASETS,
  SET_DATA
} from "./constants";

const fetchStates = () => async dispatch => {
  const states = (await axios.get("/api/states")).data;
  return dispatch({ type: SET_STATES, states });
};

const fetchCategories = stationId => async dispatch => {
  const categories = (await axios.get(`/api/categories/${stationId}`)).data;
  dispatch({ type: SET_CATEGORIES, categories });
};

const fetchDatasets = (stateId, stationId) => async dispatch => {
  const datasets = (await axios.get(`/api/datasets/${stateId}/${stationId}`)).data;
  dispatch({ type: SET_DATASETS, datasets });
};

const fetchStations = stateId => async dispatch => {
  const stations = (await axios.get(`/api/stations/${stateId}`)).data;
  dispatch({ type: SET_STATIONS, stations });
};

const fetchData = (
  stationId,
  dataset,
  startDate,
  endDate
) => async dispatch => {
  const data = (await axios.get(`/api/data/${stationId}/${dataset}/${startDate}/${endDate}`)).data;
  dispatch({ type: SET_DATA, data });
};

export {
  fetchStates,
  fetchCategories,
  fetchStations,
  fetchDatasets,
  fetchData
};
