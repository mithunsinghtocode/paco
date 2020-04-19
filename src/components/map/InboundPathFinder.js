import React from "react";
import { connect } from "react-redux";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { getFlightDataForInbound, showFocusViewForSelectedFlight, showSelectedFlightInMap } from "../../actions/chartDataAction";
import { airplaneObj } from "./objects/airplaneObj";
import { tooltipObj } from "./objects/tooltipObj";
import { lineObj } from "./objects/lineObj";
import { mapObjectEvents } from "./objects/events";
import { plotStationObj } from "./objects/plotStationObj";
import * as mapConst from "./mapConst";
import { initChart } from "../../actions/chartAction";
import Loader from '../loader/Loader';

import { clearChartComponents } from "./objects/clearChartObjects";

class InboundPathFinder extends React.Component {
  
  getChartObj = () => this.props.chartObj;

  getInboundFlightData = () => this.props.inboundFlights;

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
    if(this.props.fltToDisplayInMap != null){

    }else{

    if (chartObj !== null && flightObj !== null) {
      // As a precautionary to remove unwanted objects in chart
      //clearChartComponents(chartObj, ["MapLineSeries", "MapImageSeries"]);

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


      plotStationObj( am4core, chartObj, flightObj );

        // Adds line or arc based on the coordinates
        let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
        lineSeries.STATUS = "DELAYED";
        // Add line series
        flightObj.flightList.forEach(flight => {
        let line = lineObj(am4core, flight, lineSeries);

        // adds tooltip for the flights
        let bullet = tooltipObj(line, lineSeries, am4core, flight, this.props.displayView) ;

        // Adds click event on the tooltip, icon and line
        mapObjectEvents(bullet, line, lineSeries, flight, this.props.showSelectedFlightInMap);

        // Adds the position of the airplane object with svg
        airplaneObj(am4core, bullet, flight);
      });
      // Restore the state of the chart object to store
      this.props.initChart(chartObj);
    }
    }
  };

  renderLoading = () => {
    return <Loader loader="Map Loading..." />;
 }
  render() {
    return <div className=""> 
      {this.props.fltToDisplayInMap == null ?  (this.props.inboundFlights !== null ? this.renderFlightDataForInbound() : this.renderLoading()) : ""} </div>;
  }
}

const mapStateToProps = (state, ownprops) => {
  return { chartObj: state.chartInit, inboundFlights: state.inboundFlightData, displayView: state.getDisplayView, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData };
};

export default connect(mapStateToProps, { getFlightDataForInbound, showFocusViewForSelectedFlight, showSelectedFlightInMap, initChart })(
  InboundPathFinder
);
