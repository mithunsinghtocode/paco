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
import { consolidatedCoordinates } from '../map/objects/consolidatedCoordinates';

class FocusFlight extends React.Component {
    off = () => {
        this.props.removeSelectedFlightFromMap(null);
    }

    renderSelectedFlightInMap = () => {
        console.log("Into Flight Display View In Map");
        let chartObj = this.props.chartObj;
        let selectedFlight = this.props.fltToDisplayInMap;
        
        if(chartObj != null && selectedFlight != null){
            let selectedFlightArr = [];
            // if(selectedFlight.arrStn==='SIN'){
            //     selectedFlightArr = this.props.inboundFlights.flightList && this.props.inboundFlights.flightList.filter((flight) => {
            //         return flight.flightId === selectedFlight.flightId;
            //     });
            // }
            // if(selectedFlight.depStn === 'SIN'){
            //     selectedFlightArr = this.props.outboundFlights.flightList && this.props.outboundFlights.flightList.filter((flight) => {
            //         return flight.flightId === selectedFlight.flightId;
            //     });
            // }
            // if(selectedFlightArr && selectedFlightArr.length>0){
            //     selectedFlight = selectedFlightArr[0];
            // }

            clearChartComponents(chartObj, ["ALL"]);
            renderChartLayout(chartObj);
            Promise.resolve().then(() => {
            //console.log(selectedFlight);
            //clearChartComponents(chartObj, ["MapLineSeries", "MapImageSeries","MapArcSeries"]);
            }).then(() => {
                // Adds line or arc based on the coordinates
                let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
                let stationCoordinates = [];

                if(this.props.displayView === "INBOUND"){

                    let coordinatesList = consolidatedCoordinates(selectedFlight.outboundFlt,"OUTBOUND");
                    let airplane = plotFlightObj(selectedFlight, lineSeries, null , false, am4core, this.props.displayView, chartObj,am4maps,0, false,coordinatesList, true, this.props.isTest, this.props.testTime);
                    airplane.show();
                    //plotStationObj( am4core, chartObj, selectedFlight,null, null,this.props.displayView );
                        // Create image series
                        let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
                        // Create a circle image in image series template so it gets replicated to all new images
                        let imageSeriesTemplate = imageSeries.mapImages.template;
                
                        plotStationObj( am4core, chartObj, selectedFlight, imageSeries, imageSeriesTemplate,this.props.displayView, false , this.props.isTest, this.props.testTime);
                    // sorting to serve overlap algorithm
                    selectedFlight.outboundFlt.forEach( (in2) => {
                        in2.sumCoordinates = Number(in2.arrcoordinates.longitude) + Number(in2.arrcoordinates.latitude);
                    });
                    sort({
                        inputList: selectedFlight.outboundFlt, 
                        //objectProp: 'sumCoordinates', 
                        objectProp: 'arrcoordinates.longitude', 
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
                        let airplane = plotFlightObj(outboundFlt, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core, this.props.displayView, chartObj,am4maps, index,false, coordinatesList, true, this.props.isTest, this.props.testTime);
                        airplane.show();
                         // Create image series
                         let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
                         // Create a circle image in image series template so it gets replicated to all new images
                         let imageSeriesTemplate = imageSeries.mapImages.template;
                 
                         plotStationObj( am4core, chartObj, outboundFlt, imageSeries, imageSeriesTemplate,this.props.displayView, false, this.props.isTest, this.props.testTime );
                    });
                }
                if(this.props.displayView === "OUTBOUND"){
                    let coordinatesList = consolidatedCoordinates(selectedFlight.inboundFlt,"INBOUND");
                    selectedFlight.aircraft.position = 0.95;
                    let airplane = plotFlightObj(selectedFlight, lineSeries, this.props.showFocusViewForSelectedFlight , false, am4core, this.props.displayView, chartObj,am4maps, 0, true, coordinatesList, true, this.props.isTest, this.props.testTime);
                    airplane.show();
                    //plotStationObj( am4core, chartObj, selectedFlight,null, null,this.props.displayView, true );
                     // Create image series
                     let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
                     // Create a circle image in image series template so it gets replicated to all new images
                     let imageSeriesTemplate = imageSeries.mapImages.template;
             
                     plotStationObj( am4core, chartObj, selectedFlight, imageSeries, imageSeriesTemplate,this.props.displayView, true, this.props.isTest, this.props.testTime );
                     // sorting to serve overlap algorithm
                     selectedFlight.inboundFlt && selectedFlight.inboundFlt.forEach( (in2) => {
                        in2.sumCoordinates = Number(in2.depcoordinates.longitude) + Number(in2.depcoordinates.latitude);
                    });
                    sort({
                        inputList: selectedFlight.inboundFlt, 
                        objectProp: 'sumCoordinates', 
                        typeOfProp: 'number', 
                        conversionRequired: false, 
                        isAscending: true, 
                        isNewCopyOfArr: false
                    });
                    selectedFlight.inboundFlt && selectedFlight.inboundFlt.forEach(async (inboundFlt, index) => {
                        if(inboundFlt.status.misconnection){
                        getStationCoordinatesFromTheFlightList([inboundFlt]).forEach(stationObj => {
                            stationCoordinates = [...stationCoordinates, stationObj];
                        });
                        
                        //console.log(inboundFlt);
                        inboundFlt.tooltip = "INBOUND";
                        let airplane =plotFlightObj(inboundFlt, lineSeries, null , false, am4core, this.props.displayView, chartObj,am4maps, index, false, coordinatesList, true, this.props.isTest, this.props.testTime);
                        airplane.show();
                    }
                     // Create image series
                     let imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
                     // Create a circle image in image series template so it gets replicated to all new images
                     let imageSeriesTemplate = imageSeries.mapImages.template;
             
                     plotStationObj( am4core, chartObj, inboundFlt, imageSeries, imageSeriesTemplate,this.props.displayView, false, this.props.isTest, this.props.testTime );
                    });
            }
                //plotStationObj( am4core, chartObj, stationCoordinates,null, null,this.props.displayView );
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
                if(this.props.displayView === "INBOUND"){
                    if(length === 0 ){
                        north = selectedFlight.depcoordinates.latitude;
                        south = selectedFlight.arrcoordinates.latitude;
                        west = selectedFlight.depcoordinates.longitude <103 ? selectedFlight.depcoordinates.longitude : selectedFlight.arrcoordinates.longitude;
                        east = selectedFlight.depcoordinates.longitude <103 ? selectedFlight.arrcoordinates.longitude : selectedFlight.depcoordinates.longitude;
                    }else{
                        north = sortedLattitude[length-1].arrcoordinates.latitude;
                        south = sortedLattitude[0].arrcoordinates.latitude;
                        west = sortedLongitude[0].arrcoordinates.longitude <103 ? sortedLongitude[0].depcoordinates.longitude : sortedLongitude[0].arrcoordinates.longitude;
                        east = sortedLongitude[length-1].arrcoordinates.longitude <103 ? sortedLongitude[length-1].depcoordinates.longitude :sortedLongitude[0].arrcoordinates.longitude;
                    }
                }
                if(this.props.displayView === "OUTBOUND"){
                    if(length === 0 ){
                        north = selectedFlight.arrcoordinates.latitude > 0 ? selectedFlight.arrcoordinates.latitude : selectedFlight.depcoordinates.latitude;
                        south = selectedFlight.depcoordinates.latitude < 0 ? selectedFlight.depcoordinates.latitude : selectedFlight.arrcoordinates.latitude;
                        west = selectedFlight.arrcoordinates.longitude <103 ? selectedFlight.arrcoordinates.longitude : selectedFlight.depcoordinates.longitude;
                        east = selectedFlight.arrcoordinates.longitude <103 ? selectedFlight.depcoordinates.longitude : selectedFlight.arrcoordinates.longitude;
                    }else{
                        north = sortedLattitude[length-1].depcoordinates.latitude > selectedFlight.arrcoordinates.latitude ? sortedLattitude[length-1].depcoordinates.latitude : selectedFlight.arrcoordinates.latitude;
                        south = sortedLattitude[0].depcoordinates.latitude < selectedFlight.arrcoordinates.latitude ? sortedLattitude[0].depcoordinates.latitude : selectedFlight.arrcoordinates.latitude;
                        west = sortedLongitude[0].depcoordinates.longitude <103 ? sortedLongitude[0].arrcoordinates.longitude : sortedLongitude[0].depcoordinates.longitude;
                        east = sortedLongitude[length-1].depcoordinates.longitude < selectedFlight.arrcoordinates.longitude ? sortedLongitude[length-1].arrcoordinates.longitude : selectedFlight.arrcoordinates.longitude;
                    }
                }

                chartObj.series.values[0].events.on("inited", function(ev) {
                    if(Math.sign(Number(selectedFlight.depcoordinates.latitude)) === 1) {
                        if(Number(north) < Number(selectedFlight.depcoordinates.latitude)) north = selectedFlight.depcoordinates.latitude;
                    }else{
                        if(Number(south) > Number(selectedFlight.depcoordinates.latitude)) south = selectedFlight.depcoordinates.latitude;
                    }

                    if(Math.sign(Number(selectedFlight.depcoordinates.longitude)) === 1) {
                        if(Number(east) < Number(selectedFlight.depcoordinates.longitude)) east = selectedFlight.depcoordinates.longitude;
                    }
                    if(Number(west) > Number(selectedFlight.depcoordinates.longitude)) west = selectedFlight.depcoordinates.longitude;
                    setZoomAndGeoPointFocus(
                        chartObj,
                        Number(north),
                        Number(east),
                        Number(south),
                        Number(west),
                        1.1,
                        true,
                        500
                    );
                });
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
  return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, displayView: state.getDisplayView, isTest: state.isTest, testTime : state.testTime
    //,inboundFlights: state.inboundFlightData, outboundFlights: state.outboundFlightData
};
}

export default connect(mapStateToProps , { showFocusViewForSelectedFlight, showSelectedFlightInMap, removeSelectedFlightFromMap, initChart })(FocusFlight);