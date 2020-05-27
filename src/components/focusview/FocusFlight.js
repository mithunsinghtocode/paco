import React from  'react';
import "./focusView.scss";
import { connect } from "react-redux";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";

import { showSelectedFlightInMap, removeSelectedFlightFromMap, showFocusViewForSelectedFlight } from "../../actions/chartDataAction";
import { clearChartComponents, freeUpMemory } from "../map/objects/clearChartObjects";
import { renderChartLayout } from "../../components/map/objects/renderChartLayOut";
import { initChart } from "../../actions/chartAction";
import { plotFlightObj } from "../../components/map/objects/plotFlightObj";

import { plotStationObj } from "../map/objects/plotStationObj";

import { getStationCoordinatesFromTheFlightList } from "../../utils/stationUtils";
import { sort } from '../../utils/sortUtils';
import { setZoomAndGeoPointFocus } from '../map/objects/setZoomPoint';

class FocusFlight extends React.Component {
    off = () => {
        this.props.removeSelectedFlightFromMap(null);
    }

    renderSelectedFlightInMap = () => {
        console.log("Into Flight Display View In Map");
        let chartObj = this.props.chartObj;
        let selectedFlight = this.props.fltToDisplayInMap;
        
        if(chartObj != null && selectedFlight != null){
            Promise.resolve().then(() => {
            //console.log(selectedFlight);
            //clearChartComponents(chartObj, ["MapLineSeries", "MapImageSeries","MapArcSeries"]);
            clearChartComponents(chartObj, ["ALL"]);
            renderChartLayout(chartObj);
            }).then(() => {
                // Adds line or arc based on the coordinates
                let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
                let stationCoordinates = [];

                if(this.props.displayView === "INBOUND"){
                    plotFlightObj(selectedFlight, lineSeries, null , false, am4core, this.props.displayView, chartObj,am4maps);
                    plotStationObj( am4core, chartObj, selectedFlight );
                    // sorting to serve overlap algorithm
                    selectedFlight.outboundFlt.forEach( (in2) => {
                        in2.sumCoordinates = Number(in2.arrcoordinates.longitude) + Number(in2.arrcoordinates.latitude);
                    });
                    sort({
                        inputList: selectedFlight.outboundFlt, 
                        objectProp: 'sumCoordinates', 
                        typeOfProp: 'number', 
                        conversionRequired: false, 
                        isAscending: true, 
                        isNewCopyOfArr: false
                    });
                    selectedFlight.outboundFlt && selectedFlight.outboundFlt.forEach( async (outboundFlt , index) => {
                        getStationCoordinatesFromTheFlightList([outboundFlt]).forEach(stationObj => {
                            stationCoordinates = [...stationCoordinates, stationObj];
                        });
                        
                        //console.log(outboundFlt);
                        outboundFlt.tooltip = "OUTBOUND";
                        outboundFlt.aircraft.position = 0.95;
                        plotFlightObj(outboundFlt, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core, this.props.displayView, chartObj,am4maps, index);
                    });
                }
                if(this.props.displayView === "OUTBOUND"){
                    selectedFlight.aircraft.position = 0.95;
                    plotFlightObj(selectedFlight, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core, this.props.displayView, chartObj,am4maps);
                    plotStationObj( am4core, chartObj, selectedFlight );
                    selectedFlight.inboundFlt && selectedFlight.inboundFlt.forEach(async (inboundFlt, index) => {
                        getStationCoordinatesFromTheFlightList([inboundFlt]).forEach(stationObj => {
                            stationCoordinates = [...stationCoordinates, stationObj];
                        });
                        
                        //console.log(inboundFlt);
                        inboundFlt.tooltip = "INBOUND";
                        plotFlightObj(inboundFlt, lineSeries, null , false, am4core, this.props.displayView, chartObj,am4maps, index);
                    });
            }
                plotStationObj( am4core, chartObj, stationCoordinates );
            }).then(() => {
                // Setting zoom panning to rectangle based on Inbound flight algorithm starts
                let east;
                let west;
                let south;
                let north;
                let sortedLattitude = sort({
                    inputList: this.props.displayView === "INBOUND" ? selectedFlight.outboundFlt : selectedFlight.inboundFlt, 
                    objectProp: this.props.displayView === "INBOUND" ? 'arrcoordinates.latitude' : 'depcoordinates.latitude', 
                    typeOfProp: 'number', 
                    conversionRequired: false, 
                    isAscending: true, 
                    isNewCopyOfArr: true
                });
                let sortedLongitude = sort({
                    inputList: this.props.displayView === "INBOUND" ? selectedFlight.outboundFlt : selectedFlight.inboundFlt, 
                    objectProp: this.props.displayView === "INBOUND" ? 'arrcoordinates.longitude' : 'depcoordinates.longitude', 
                    typeOfProp: 'number', 
                    conversionRequired: false, 
                    isAscending: true, 
                    isNewCopyOfArr: true
                });
                let length = (this.props.displayView === "INBOUND") && (selectedFlight.outboundFlt ? selectedFlight.outboundFlt.length : 0);
                if(this.props.displayView === "OUTBOUND") {
                    length = selectedFlight.inboundFlt ? selectedFlight.inboundFlt.length : 0;
                };
                console.log(north + " :: " + east + " :: "+ south + " :: " + west);
                if(length === 0){

                }
                if(this.props.displayView === "INBOUND"){
                    if(length === 0 ){
                        north = selectedFlight.depcoordinates.latitude;
                        south = selectedFlight.arrcoordinates.latitude;
                        west = 0;
                        east = 0;
                    }else{
                        north = sortedLattitude[length-1].arrcoordinates.latitude;
                        south = sortedLattitude[0].arrcoordinates.latitude;
                        west = sortedLongitude[length-1].arrcoordinates.longitude;
                        east = sortedLongitude[0].arrcoordinates.longitude;
                    }
                }
                if(this.props.displayView === "OUTBOUND"){
                    if(length === 0 ){
                        north = selectedFlight.arrcoordinates.latitude;
                        south = selectedFlight.depcoordinates.latitude;
                        west = 0;
                        east = 0;
                    }else{
                        north = sortedLattitude[length-1].depcoordinates.latitude;
                        south = sortedLattitude[0].depcoordinates.latitude;
                        west = sortedLongitude[length-1].depcoordinates.longitude;
                        east = sortedLongitude[0].depcoordinates.longitude;
                    }
                }

                chartObj.series.values[0].events.on("inited", function(ev) {
                    if(Math.sign(Number(selectedFlight.depcoordinates.latitude)) === 1) {
                        if(Number(north) < Number(selectedFlight.depcoordinates.latitude)) north = selectedFlight.depcoordinates.latitude;
                    }else{
                        console.log(Number(south) +" :: "+ Number(selectedFlight.depcoordinates.latitude));
                        if(Number(south) > Number(selectedFlight.depcoordinates.latitude)) south = selectedFlight.depcoordinates.latitude;
                    }

                    if(Math.sign(Number(selectedFlight.depcoordinates.longitude)) === 1) {
                        if(Number(east) < Number(selectedFlight.depcoordinates.longitude)) east = selectedFlight.depcoordinates.longitude;
                    }else{
                        if(Number(west) > Number(selectedFlight.depcoordinates.longitude)) west = selectedFlight.depcoordinates.longitude;
                    }

                    setZoomAndGeoPointFocus(
                        chartObj,
                        Number(north),
                        Number(east),
                        Number(south),
                        Number(west),
                        1,
                        true,
                        500
                    );
                });
                chartObj.zoomLevel = chartObj.zoomLevel + 0.0001;
            }).then(() => {
                // Setting zoom panning to rectangle based on Inbound flight algorithm ends
                freeUpMemory([chartObj, selectedFlight]);
            });
        }else{
            return <div></div>;
        }        
    }
    render(){
        return (
            <div> { this.props.fltToDisplayInMap !== null ? this.renderSelectedFlightInMap() : "" }
               {/* {this.props.fltToDisplayInMap !== null ? <Filter goBackFunction={this.off} /> : <Filter goBackFunction={this.off} /> } */}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);
  return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, displayView: state.getDisplayView };
}

export default connect(mapStateToProps , { showFocusViewForSelectedFlight, showSelectedFlightInMap, removeSelectedFlightFromMap, initChart })(FocusFlight);