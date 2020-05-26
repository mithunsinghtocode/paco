import React from "react";
import { connect } from "react-redux";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { getFlightDataForOutBound, showFocusViewForSelectedFlight, showSelectedFlightInMap } from "../../actions/chartDataAction";
import { airplaneObj } from "./objects/airplaneObj";
import { tooltipObj } from "./objects/tooltipObj";
import { lineObj } from "./objects/lineObj";
import { mapObjectEvents } from "./objects/events";
import { plotStationObj } from "./objects/plotStationObj";
import { initChart } from "../../actions/chartAction";
import Loader from '../loader/Loader';
import { freeUpMemory } from './objects/clearChartObjects';
import { setDefaultZoomAndGeoPointFocus } from './objects/defaultZoomFocus';


class OutboundPathFinder extends React.PureComponent {
  
  getChartObj = () => this.props.chartObj;

  getOutboundFlightData = () => this.props.outboundFlights;

  renderFlightDataForOutbound = () => {
    
    let chartObj = this.getChartObj();
    let flightObj = this.getOutboundFlightData();
    if(this.props.fltToDisplayInMap != null){

    }else{

    if (chartObj !== null && flightObj !== null) {

      console.log("<><><> Outbound Path Filter - State re-renders the flight data component");

      setDefaultZoomAndGeoPointFocus(chartObj);

      plotStationObj( am4core, chartObj, flightObj );

        // Adds line or arc based on the coordinates
        let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
        lineSeries.STATUS = "LINESERIES";
        // Add line series
        flightObj.flightList.forEach(flight => {
          flight.aircraft.position = 0.95;
        let line = lineObj(am4core, flight, lineSeries, chartObj,am4maps);

        // adds tooltip for the flights
        let bullet = tooltipObj(line, lineSeries, am4core, flight, this.props.displayView) ;

        // Adds click event on the tooltip, icon and line
        mapObjectEvents(bullet, line, lineSeries, flight, this.props.showSelectedFlightInMap, this.props.showFocusViewForSelectedFlight);

        // Adds the position of the airplane object with svg
        airplaneObj(am4core, bullet, flight);
      });
      // Restore the state of the chart object to store
      this.props.initChart(chartObj);

      freeUpMemory([chartObj, flightObj]);
    }
    }
  };

  renderLoading = () => {
    return <Loader loader="Outbound View Loading..." />;
 }
  render() {
    return <div className=""> 
      {this.props.fltToDisplayInMap == null ?  (this.props.outboundFlights !== null ? this.renderFlightDataForOutbound() : this.renderLoading()) : ""} </div>;
  }
}

const mapStateToProps = (state, ownprops) => {
  return { chartObj: state.chartInit, outboundFlights: state.outboundFlightData, displayView: state.getDisplayView, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData };
};

export default connect(mapStateToProps, { getFlightDataForOutBound, showFocusViewForSelectedFlight, showSelectedFlightInMap, initChart })(
          OutboundPathFinder
);
