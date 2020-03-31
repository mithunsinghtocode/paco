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

class FocusFlight extends React.Component {
    off = () => {
        console.log("asdlkjfgrhskdejkghkjsdfghk;jlsdfghjl;ksfjhl;kjefhlkj");
        this.props.removeSelectedFlightFromMap(null);
    }

    renderSelectedFlightInMap = () => {
        console.log("Into Flight Display View In Map");
        let chartObj = this.props.chartObj;
        let selectedFlight = this.props.fltToDisplayInMap;
        if(chartObj != null && selectedFlight != null){         
            console.log(selectedFlight);
            clearChartComponents(chartObj, ["MapLineSeries", "MapImageSeries"]);
            //this.off();

            // Adds line or arc based on the coordinates
            let lineSeries = chartObj.series.push(new am4maps.MapLineSeries());
            plotFlightObj(selectedFlight, lineSeries, null , false, am4core);

            selectedFlight.outboundFlt && selectedFlight.outboundFlt.forEach( outboundFlt => {
                console.log(outboundFlt);
                outboundFlt.tooltip = "OUTBOUND";
                outboundFlt.aircraft.position = 0.95;
                plotFlightObj(outboundFlt, lineSeries, this.props.showFocusViewForSelectedFlight , true, am4core);
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
  console.log(state);
  return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit };
}

export default connect(mapStateToProps , { showFocusViewForSelectedFlight, showSelectedFlightInMap, removeSelectedFlightFromMap, initChart })(FocusFlight);