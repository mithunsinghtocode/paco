import React from "react";
import { connect } from "react-redux";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { getFlightDataForInbound, showFocusViewForSelectedFlight, showSelectedFlightInMap,
  removeSelectedFlightFromMap,removeFocusViewForSelectedFlight  } from "../../actions/chartDataAction";
import { airplaneObj } from "./objects/airplaneObj";
import { tooltipObj } from "./objects/tooltipObj";
import { lineObj } from "./objects/lineObj";
import { mapObjectEvents } from "./objects/events";
import { plotStationObj } from "./objects/plotStationObj";
import { initChart } from "../../actions/chartAction";
import Loader from '../loader/Loader';
import { freeUpMemory } from './objects/clearChartObjects';
import { sort } from "../../utils/sortUtils";
import { setDefaultZoomAndGeoPointFocus, goToHome } from './objects/defaultZoomFocus';
import "../map/pathFinder.scss";
import { renderChartLayout } from '../map/objects/renderChartLayOut';
import { clearChartComponents } from '../map/objects/clearChartObjects';
import { consolidatedCoordinates } from '../map/objects/consolidatedCoordinates';

class InboundPathFinder extends React.PureComponent {
 
  getChartObj = () => this.props.chartObj;

  getInboundFlightData = () => this.props.inboundFlights;

  componentDidMount(){
    this.getChartObj() && setDefaultZoomAndGeoPointFocus(this.getChartObj());
  }

  renderFlightDataForInbound = () => {
    
    let chartObj = this.getChartObj();
    let flightObj = this.getInboundFlightData();
    if(this.props.fltToDisplayInMap != null){

    }else{
    if (chartObj !== null && flightObj !== null) {
      console.log("<><><> Inbound Path Filter - State re-renders the flight data component");

      // set initial zoom and map points
      setDefaultZoomAndGeoPointFocus(chartObj);
        // sorting to serve overlap algorithm
        flightObj.flightList.forEach( (in2) => {
            in2.sumCoordinates = Number(in2.depcoordinates.longitude) + Number(in2.depcoordinates.latitude) + Number(in2.aircraft.position);
        });
        var sortedFlightList = sort({
            inputList: flightObj.flightList, 
            objectProp: 'sumCoordinates', 
            typeOfProp: 'number', 
            conversionRequired: true, 
            isAscending: false, 
            isNewCopyOfArr: true
        });

        let coordinatesList = consolidatedCoordinates(flightObj.flightList,"INBOUND");

        // Adds line or arc based on the coordinates
        let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
        
        /** If you require full control of the arc drawn use  MapArcSeries*/
        //let lineSeries = chartObj.series.push(new am4maps.MapArcSeries());
        Promise.resolve().then(() => {
          lineSeries.STATUS = "LINESERIES";
          // Add line series
          sortedFlightList.forEach( async (flight, index) => {
          let line = lineObj(am4core, flight, lineSeries,chartObj,am4maps);
  
          // adds tooltip for the flights
          let bullet = tooltipObj(line, lineSeries, am4core, flight, this.props.displayView, index, false, coordinatesList) ;
  
          // Adds click event on the tooltip, icon and line
          mapObjectEvents(bullet, line, lineSeries, flight, this.props.showSelectedFlightInMap);
  
          // Adds the position of the airplane object with svg
          airplaneObj(am4core, bullet, flight);
          
          requestAnimationFrame (() => {
          // Create image series
          let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
          // Create a circle image in image series template so it gets replicated to all new images
          let imageSeriesTemplate = imageSeries.mapImages.template;
  
          plotStationObj( am4core, chartObj, flight, imageSeries, imageSeriesTemplate );
          });
        });
        // Restore the state of the chart object to store
        this.props.initChart(chartObj);
        }).then(() => {
            // refocus map
          goToHome(chartObj);
          freeUpMemory([chartObj, flightObj]);
        });
    }
    }
  };

  renderLoading = () => {
    return <Loader loader="Map Loading..." />;
 }

 showAllFlights = () => {
    this.props.removeSelectedFlightFromMap(null); 
    this.props.removeFocusViewForSelectedFlight(null); 
    clearChartComponents(this.props.chartObj, ["ALL"]); 
    renderChartLayout(this.props.chartObj);
 }

 renderBackButton(){
  return (<button className="rectangle" onClick={this.showAllFlights}>
         SHOW ALL FLIGHTS </button>
        );
  }
  render() {
    return <div className=""> 
      {/* { this.props.fltToDisplayInMap !== null && this.renderBackButton() } */}
      {this.props.fltToDisplayInMap == null ?  (this.props.inboundFlights !== null ? this.renderFlightDataForInbound() : this.renderLoading()) : ""} </div>;
  }
}

const mapStateToProps = (state, ownprops) => {
  return { chartObj: state.chartInit, inboundFlights: state.inboundFlightData, displayView: state.getDisplayView, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData };
};

export default connect(mapStateToProps, { 
  getFlightDataForInbound, 
  showFocusViewForSelectedFlight, 
  showSelectedFlightInMap, 
  initChart, 
  removeSelectedFlightFromMap, 
  removeFocusViewForSelectedFlight 
})(
  InboundPathFinder
);
