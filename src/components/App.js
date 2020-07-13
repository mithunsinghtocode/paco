import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import { removeSelectedFlightFromMap, getFlightData, removeFocusViewForSelectedFlight, getFlightDataForInbound } from '../actions/chartDataAction';
import { clearChartComponents } from "../components/map/objects/clearChartObjects";
import { renderChartLayout } from "../components/map/objects/renderChartLayOut";
import { initChart } from "../actions/chartAction";
import { switchFlightsViewByInBoundOrOutbound, userClick } from "../actions/chartDataAction";

class App extends React.PureComponent {
    componentDidMount(){
        // Get all the flight Data with promise
        new Promise((resolve, reject) => {
            resolve(this.props.getFlightData());
        }).then(() => {
                console.log("<><><> Setting initial zoom and position...");
                this.props.chartObj.zoomDuration = 500;
                this.props.chartObj.goHome();
                this.props.chartObj.zoomDuration = 200;
        });     
    }
    setTheInboundViewForBackButton() {
        this.props.switchFlightsViewByInBoundOrOutbound("INBOUND");
        this.props.userClick(false);
        let inboundButton = document.getElementById('INBOUND');
        let outboundButton = document.getElementById('OUTBOUND');
        outboundButton.style.borderRight = "0px";
        inboundButton.style.borderRight = "4px solid #00DC88";
   }
    render(){
        return (
            <>
                <Header />
                <Filter goBackFunction={() => {
                    this.props.removeSelectedFlightFromMap(null); 
                    this.props.removeFocusViewForSelectedFlight(null); 
                    clearChartComponents(this.props.chartObj, ["ALL"]); 
                    renderChartLayout(this.props.chartObj); 
                    !this.props.isUserClick && this.setTheInboundViewForBackButton()
                    }}/>
                <MapChartLayer />
                <FocusView />
            </>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return { state, chartObj: state.chartInit, flightData : state.allFlightData};
}
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart, getFlightData, getFlightDataForInbound,
    switchFlightsViewByInBoundOrOutbound, userClick })(App);