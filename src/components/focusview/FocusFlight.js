import React from  'react';
import "./focusView.scss";
import { connect } from "react-redux";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";

import { showSelectedFlightInMap, removeSelectedFlightFromMap, showFocusViewForSelectedFlight } from "../../actions/chartDataAction";
import { clearChartComponents } from "../map/objects/clearChartObjects";
import { renderChartLayout } from "../../components/map/objects/renderChartLayOut";
import { initChart } from "../../actions/chartAction";
import { plotFlightObj } from "../../components/map/objects/plotFlightObj";
import { Filter } from "../filter/Filter";

import { plotStationObj } from "../map/objects/plotStationObj";

import { getStationCoordinatesFromTheFlightList } from "../../utils/stationUtils";

class FocusFlight extends React.Component {
    off = () => {
        console.log("akgfhjwhdgfhagdfssfikghasdkfhsdwgfjkhfs");
        this.props.removeSelectedFlightFromMap(null);
    }

    renderSelectedFlightInMap = () => {
        console.log("Into Flight Display View In Map");
        let chartObj = this.props.chartObj;
        let selectedFlight = this.props.fltToDisplayInMap;
        if(chartObj != null && selectedFlight != null){         
            console.log(selectedFlight);
            clearChartComponents(chartObj, ["MapLineSeries", "MapImageSeries","MapArcSeries"]);
            //this.off();

            // Adds line or arc based on the coordinates
            let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());


            let stationCoordinates = getStationCoordinatesFromTheFlightList([selectedFlight]);

            if(this.props.displayView === "INBOUND"){
                plotFlightObj(selectedFlight, lineSeries, null , false, am4core, this.props.displayView);
                selectedFlight.outboundFlt && selectedFlight.outboundFlt.forEach( outboundFlt => {
                    getStationCoordinatesFromTheFlightList([outboundFlt]).forEach(stationObj => {
                        stationCoordinates = [...stationCoordinates, stationObj];
                    });
                    
                    console.log(outboundFlt);
                    outboundFlt.tooltip = "OUTBOUND";
                    outboundFlt.aircraft.position = 0.95;
                    plotFlightObj(outboundFlt, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core, this.props.displayView);
                });
            }
            if(this.props.displayView === "OUTBOUND"){
                selectedFlight.aircraft.position = 0.95;
                plotFlightObj(selectedFlight, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core, this.props.displayView);
                selectedFlight.inboundFlt && selectedFlight.inboundFlt.forEach( inboundFlt => {
                    getStationCoordinatesFromTheFlightList([inboundFlt]).forEach(stationObj => {
                        stationCoordinates = [...stationCoordinates, stationObj];
                    });
                    
                    console.log(inboundFlt);
                    inboundFlt.tooltip = "INBOUND";
                    plotFlightObj(inboundFlt, lineSeries, null , false, am4core, this.props.displayView);
                });
        }

            plotStationObj( am4core, chartObj, stationCoordinates );
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
  console.log(state);
  return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, displayView: state.getDisplayView };
}

export default connect(mapStateToProps , { showFocusViewForSelectedFlight, showSelectedFlightInMap, removeSelectedFlightFromMap, initChart })(FocusFlight);