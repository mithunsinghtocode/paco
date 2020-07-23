import React from "react";
import { connect } from "react-redux";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import { getFlightDataForOutBound, showFocusViewForSelectedFlight, showSelectedFlightInMap} from "../../actions/chartDataAction";
import { airplaneObj } from "./objects/airplaneObj";
import { tooltipObj } from "./objects/tooltipObj";
import { lineObj } from "./objects/lineObj";
import { mapObjectEvents } from "./objects/events";
import { plotStationObj } from "./objects/plotStationObj";
import { initChart } from "../../actions/chartAction";
import Loader from '../loader/Loader';
import { freeUpMemory, removeTooltip } from './objects/clearChartObjects';
import { setDefaultZoomAndGeoPointFocus, goToHome } from './objects/defaultZoomFocus';
import { sort } from '../../utils/sortUtils';
import { consolidatedCoordinates } from '../map/objects/consolidatedCoordinates';


class OutboundPathFinder extends React.PureComponent {
  
  getChartObj = () => this.props.chartObj;

  getOutboundFlightData = () => this.props.outboundFlights;

  componentDidMount(){
    this.getChartObj() && setDefaultZoomAndGeoPointFocus(this.getChartObj());
  }

  renderFlightDataForOutbound = () => {
    
    let chartObj = this.getChartObj();
    let flightObj = this.getOutboundFlightData();
    if(this.props.fltToDisplayInMap != null){

    }else{

     let filteredFlightList  = flightObj.flightList.filter((flight) => {
        //return flight.etd !== null && flight.etd > (flight.rtd || flight.std) && 
        return flight.status.misconnection;
      });

    if (chartObj !== null && flightObj !== null) {

      console.log("<><><> Outbound Path Filter - State re-renders the flight data component");
      
      setDefaultZoomAndGeoPointFocus(chartObj);

      // sorting to serve overlap algorithm
      filteredFlightList.forEach( (in2) => {
        in2.sumCoordinates = Number(in2.arrcoordinates.longitude) + Number(in2.arrcoordinates.latitude) + Number(in2.aircraft.position);
      });
      var sortedFlightList = sort({
          inputList: filteredFlightList, 
          //objectProp: 'arrcoordinates.longitude', 
          objectProp: 'sumCoordinates',
          typeOfProp: 'number', 
          conversionRequired: true, 
          isAscending: true, 
          isNewCopyOfArr: true
      });

      let coordinatesList = consolidatedCoordinates(filteredFlightList,"OUTBOUND");

        // Adds line or arc based on the coordinates
        let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
        Promise.resolve().then(() => {
        lineSeries.STATUS = "LINESERIES";
        // Add line series
        sortedFlightList.forEach((flight , index) => {
        flight.aircraft.position = 0.95;
        this.props.isTest && removeTooltip(chartObj);
        let line = lineObj(am4core, flight, lineSeries, chartObj,am4maps,false,this.props.displayView, this.props.isTest, this.props.testTime);

        // adds tooltip for the flights
        let bullet = tooltipObj(line, lineSeries, am4core, flight, this.props.displayView, index, false, coordinatesList,false, this.props.isTest, this.props.testTime) ;
        if(!this.props.isUserClick){
          bullet.hide();
        }
        requestAnimationFrame (() => {
        // Adds click event on the tooltip, icon and line
        mapObjectEvents(bullet, line, lineSeries, flight, this.props.showSelectedFlightInMap, this.props.showFocusViewForSelectedFlight);
        // Adds the position of the airplane object with svg
        let planeObj = airplaneObj(am4core, bullet, flight);
        
        // Create image series
        let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
        // Create a circle image in image series template so it gets replicated to all new images
        let imageSeriesTemplate = imageSeries.mapImages.template;

        plotStationObj( am4core, chartObj, flight, imageSeries, imageSeriesTemplate,this.props.displayView, false, this.props.isTest, this.props.testTime );

        bullet.show();
        planeObj.show();
        });
      });

      // Restore the state of the chart object to store
      this.props.initChart(chartObj);

    }).then(() => {
        // refocus map
        //requestAnimationFrame (() => {
          goToHome(chartObj);
        //});
      freeUpMemory([chartObj, flightObj]);
    });
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
  return { chartObj: state.chartInit, outboundFlights: state.outboundFlightData, displayView: state.getDisplayView, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData, isUserClick: state.isUserClick, 
     isTest: state.isTest, testTime : state.testTime};
};

export default connect(mapStateToProps, { getFlightDataForOutBound, showFocusViewForSelectedFlight, showSelectedFlightInMap, initChart })(
          OutboundPathFinder
);
