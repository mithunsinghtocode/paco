import React from "react";
import { connect } from "react-redux";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { getFlightDataForInbound } from "../../actions/chartDataAction";
import { airplaneObj } from "../map/objects/airplaneObj";
import { tooltipObj } from "../map/objects/tooltipObj";
import { lineObj } from "../map/objects/lineObj";
import { mapObjectEvents } from "../map/objects/events";
import * as mapConst from "./mapConst";

class PathFinder extends React.Component {
  componentDidMount() {
    this.props.getFlightDataForInbound();
  }
  getChartObj = () => {
    return this.props.chartObj;
  };
  getInboundFlightData = () => {
    return this.props.inboundFlights;
  };

  setDefaultZoomAndGeoPointFocus = (
    chartObj,
    zoomLevel,
    defaultLatitude,
    defaultLongitude
  ) => {
    chartObj.homeZoomLevel = zoomLevel;
    chartObj.homeGeoPoint = {
      latitude: defaultLatitude,
      longitude: defaultLongitude
    };
  };

  renderFlightDataForInbound = () => {
    let chartObj = this.getChartObj();
    let flightObj = this.getInboundFlightData();
    if (chartObj !== null && flightObj !== null) {
      console.log("State re-renders the flight data component");

      let isAmericaPresent = flightObj.stationcoordinates.filter(station =>
        station.longitude < -10 ? true : false
      );
      // set initial zoom and map points
      if (isAmericaPresent !== undefined && isAmericaPresent.length > 0) {
        this.setDefaultZoomAndGeoPointFocus(
          chartObj,
          mapConst.$_america_asian_continents_zoom_level,
          mapConst.$_america_asia_latitude,
          mapConst.$_america_asia_longitude
        );
      } else {
        this.setDefaultZoomAndGeoPointFocus(
          chartObj,
          mapConst.$_asian_continents_zoom_level,
          mapConst.$_asia_latitude,
          mapConst.$_asia_longitude
        );
      }

      // Add line series
      flightObj.flightSchedule.flightList.forEach(flight => {
        // Adds line or arc based on the coordinates
        let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
        let line = lineObj(am4core, flight, lineSeries);

        // adds tooltip for the flights
        let bullet = tooltipObj(line, lineSeries, am4core, flight);

        // Adds click event on the tooltip, icon and line
        mapObjectEvents(bullet, line, lineSeries);

        // Adds the position of the airplane object with svg
        airplaneObj(am4core, bullet, flight);
      });
    }
  };

  onChennai = () => {
    alert();
  };
  render() {
    return <div className=""> {this.renderFlightDataForInbound()}</div>;
  }
}

const mapStateToProps = (state, ownprops) => {
  console.log(state);
  return { chartObj: state.chartInit, inboundFlights: state.flightData };
};

export default connect(mapStateToProps, { getFlightDataForInbound })(
  PathFinder
);
