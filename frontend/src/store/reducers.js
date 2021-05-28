import { combineReducers } from "redux";
import { SET_CATEGORIES, SET_STATIONS, SET_STATES, SET_DATASETS, SET_DATA } from "./constants";

const statesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_STATES:
      return action.states;
    default:
      return state;
  }
};

const categoriesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return action.categories;
    default:
      return state;
  }
};

const stationsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_STATIONS:
      return action.stations;
    default:
      return state;
  }
};

const datasetsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_DATASETS:
      return action.datasets;
    default:
      return state;
  }
};

const dataReducer = (state = [], action) => {
  switch (action.type) {
    case SET_DATA:
      return action.data;
    default:
      return state;
  }
};

export default combineReducers({
  states: statesReducer,
  stations: stationsReducer,
  categories: categoriesReducer,
  datasets: datasetsReducer,
  data: dataReducer
});
