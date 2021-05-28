// Package imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// Local imports
import { actions } from "../store";

// Components
// import googleMapsClient from "../../backend/config/google-maps";
import { fetchCategories } from "../store/actions";

function validate(state, station, dataset, startDate, endDate) {
  const errors = [];
  if (
    (state.trim().length * station.trim().length * dataset.trim().length,
    startDate.trim().length,
    endDate.trim().length === 0)
  ) {
    errors.push("Please select all the required fields");
  }

  return errors;
}

class _App extends Component {
  constructor() {
    super();
    this.state = {
      state: "",
      stateId: "",
      city: "",
      station: "",
      // category: "",
      dataset: "",
      startDate: "",
      endDate: "",
      temperatureUnit: "",
      error: []
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.convertToCSV = this.convertToCSV.bind(this);
    this.exportCSVFile = this.exportCSVFile.bind(this);
    this.download = this.download.bind(this);
    // this.initMap = this.initMap.bind(this);
    // loadStoreData();
  }

  initialize() {
    const mapOptions = {
      zoom: 5,
      center: new google.maps.LatLng(40.7128, -73.935242),
      mapTypeId: "terrain"
    };

    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // const markers = this.state.stations.map(point => [point.name, point.latitude,
    //       point.longitude])

    this.props.stations.forEach(station => {
      const latLng = new google.maps.latlng(
        station.latitude,
        station.longitude
      );

      const marker = new google.maps.Marker({
        position: latLng,
        map,
        title: station.name
      });
    });
  }

  onChange(ev) {
    console.log("target is--->", ev.target.value);
    this.setState({ [ev.target.name]: ev.target.value });

    if (ev.target.name === "state") {
      const stateId = this.props.states.find(
        state => state.abbreviation == ev.target.value
      ).id;

      console.log(stateId);
      this.setState({ stateId });

      const fetchedStations = this.props.fetchStations(stateId).catch(ex => {
        this.setState({ error: [ex.response.data.message] });
      });

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?sensor=false&callback=${this.initialize}`;
      document.body.appendChild(script);

      // fetchCategories.forEach(station => {
      //   const latLng = new google.maps.latlng(
      //     station.latitude,
      //     station.longitude
      //   );

      //   const market = new google.maps.Marker({
      //     position:latLng,
      //     map
      //   })
      // });
    }

    if (ev.target.name === "station") {
      console.log("station need id--->", ev.target.value);

      // this.props.fetchCategories(ev.target.value).catch(ex => {
      //   this.setState({ error: [ex.response.data.message] });
      // });
      const { stateId } = this.state;
      this.props.fetchDatasets(stateId, ev.target.value).catch(ex => {
        this.setState({ error: [ex.response.data.message] });
      });
    }
  }

  async onSubmit(ev) {
    ev.preventDefault();
    this.setState({ error: [] });

    const { state, station, dataset, startDate, endDate } = this.state;
    console.log("submitted params--->", station, dataset, startDate, endDate);

    const error = validate(state, station, dataset, startDate, endDate);
    if (error.length > 0) {
      this.setState({ error });
      return;
    }

    this.props.fetchData(
      station,
      dataset,
      startDate,
      endDate
    )
    . then(data => console.log('data', data))
    // .then(data => (!data)? this.setState({error: "No data is available"}): data )
    .catch(ex => {
      this.setState({ error: [ex.response.data.message] });
    })

    document.getElementById("data-table").style.display = "block";
  }

  componentDidMount() {
    this.props.loadStoreData();
  }

  convertToCSV(objArray, delimiter = ",") {
    const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      const record = array[i];

      line += [record.station, record.datatype, record.date, record.value].join(
        this.state.delimiter || delimiter
      );

      // for (const index in array[i]) {
      //   if (line != "") line += ",";
      //   line += array[i][index];
      // }

      str += line + "\r\n";
    }

    return str;
  }

  exportCSVFile(headers, dataToDownload, fileTitle) {
    // if (headers) {
    //   dataToDownload.unshift(headers);
    // }

    const items = JSON.stringify(dataToDownload);
    const csv = this.convertToCSV(items);

    const exportedFilenmae = fileTitle + ".csv" || "export.csv";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  download(ev) {
    // ev.preventDefault();
    this.setState({ error: [] });

    const { station, dataset, endDate } = this.state;
    const { data } = this.props;

    const headers = {
      station: "Station",
      datatype: "Datatype",
      date: "Date",
      value: "Value"
    };

    const fileTitle = `${station}_${dataset}_${endDate}`;

    this.exportCSVFile(headers, data, fileTitle);
  }

  render() {
    const { states, stations, categories, datasets, data } = this.props;
    const {
      state,
      city,
      station,
      category,
      error,
      temperatureUnit
    } = this.state;
    const { onChange, onSubmit, download } = this;
    return (
      <div className="container mt-3">
        <h2 className="mb-3">NOAA Climate Data Generator</h2>
        <form id="data-form">
          <div>
            {error &&
              error.map((_error, idx) => (
                <p className="alert alert-warning" key={idx}>
                  {_error}
                </p>
              ))}
          </div>
          <div className="form-group">
            <label className="mr-2 d-inline-block">State</label>
            <select name="state" onChange={onChange} required>
              <option key="000" selected>
                ---Select State---
              </option>
              {states.map(state => (
                <option key={state.id} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="mr-2 d-inline-block">Station Name</label>
            <select name="station" onChange={onChange} required>
              <option key="000" value="" selected>
                ---Select Station---
              </option>
              {stations
                .filter(
                  _station => _station.name.includes(`${state} US`)
                  // _station => _station.name.split(', ')[1] == `${state}, US`
                )
                .sort()
                .map(_station => (
                  <option key={_station.id} value={_station.id}>
                    {_station.name.split(", ")[0]}
                  </option>
                ))}
            </select>
          </div>
          {/* <div>
          <label>Data Category</label>
          <select name="category" onChange={onChange} required>
          <option key="000" value="" selected>
              ---Select City---
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div> */}
          <div className="form-group">
            <label className="mr-2 d-inline-block">Datasets</label>
            <select name="dataset" onChange={onChange} required>
              <option key="000" value="" selected>
                ---Select Datasets---
              </option>
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="mr-2 d-inline-block" htmlFor="start-date">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              min="2018-01-01"
              max="2019-12-31"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="mr-2 d-inline-block" htmlFor="end-date">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              min="2018-01-01"
              max="2019-12-31"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="mr-2 d-inline-block" htmlFor="temperatureUnit">
              Please select one:{" "}
            </label>
            <input
              className="mr-2 d-inline-block"
              type="radio"
              name="temperatureUnit"
              onChange={onChange}
              value="Fahrenheit"
              checked
            />
            Fahrenheit
            <input
              className="mr-2 ml-4 d-inline-block"
              type="radio"
              name="temperatureUnit"
              onChange={onChange}
              value="Celsius"
            />
            Celsius
          </div>
          <div id="map"></div>
          <button
            className="btn btn-success mb-3"
            type="button"
            onClick={onSubmit}
          >
            Submit
          </button>
        </form>
        <form id="download-form">
          <div className="form-group">
            <label className="mr-2 d-inline-block" htmlFor="">
              Delimiter:{" "}
            </label>
            <input
              className="mr-2 d-inline-block"
              type="radio"
              name="delimiter"
              onChange={onChange}
              value=","
              checked
            />
            Comma
            <input
              className="mr-2 ml-4 d-inline-block"
              type="radio"
              name="delimiter"
              onChange={onChange}
              value=" "
            />
            Space
          </div>
          <button
            className="btn btn-success mb-3"
            type="button"
            onClick={download}
          >
            Download File
          </button>
        </form>
        <div>
          <table
            className="table table-hover"
            id="data-table"
            style={{ display: "none" }}
          >
            <thead className="thead-dark">
              <tr>
                <th>Station</th>
                <th>Datatype</th>
                <th>Date</th>
                <th>Value</th>
                {/* <th>{temperatureUnit}</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.station}</td>
                  <td>{item.datatype}</td>
                  <td>{item.date}</td>
                  <td>
                    {temperatureUnit === "Celsius"
                      ? Math.round(((item.value - 32) * 5) / 9)
                      : item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ states, categories, stations, datasets, data }) => {
  return {
    states,
    categories,
    stations,
    datasets,
    data
  };
};

const mapDispatchToProps = dispatch => ({
  loadStoreData: () => {
    dispatch(actions.fetchStates());
    // dispatch(actions.fetchStations());
    // dispatch(actions.fetchCategories(stationId));
  },
  // fetchCategories: stationId => dispatch(actions.fetchCategories(stationId)),
  fetchStations: stateId => dispatch(actions.fetchStations(stateId)),
  fetchDatasets: (stateId, stationId) =>
    dispatch(actions.fetchDatasets(stateId, stationId)),
  fetchData: (stationId, dataset, startDate, endDate) =>
    dispatch(actions.fetchData(stationId, dataset, startDate, endDate))
});

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(_App);

export default App;
