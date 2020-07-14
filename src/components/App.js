import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import { removeSelectedFlightFromMap, getFlightData, removeFocusViewForSelectedFlight, getFlightDataForInbound, userClick, setCurrentTimeInUTC  } from '../actions/chartDataAction';
import { clearChartComponents } from "../components/map/objects/clearChartObjects";
import { renderChartLayout } from "../components/map/objects/renderChartLayOut";
import { initChart } from "../actions/chartAction";
import { getCurrentTimeInUTC } from "../utils/dateUtils";

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



    setInterval(() => {
        this.props.setCurrentTimeInUTC(getCurrentTimeInUTC());
    },30000)
    }
    render(){
        return (
            <>
                <Header />
                <Filter goBackFunction={() => {this.props.removeSelectedFlightFromMap(null); this.props.removeFocusViewForSelectedFlight(null); clearChartComponents(this.props.chartObj, ["ALL"]); renderChartLayout(this.props.chartObj); }}/>
                <MapChartLayer />
                <FocusView />
            </>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return { state, chartObj: state.chartInit, flightData : state.allFlightData, isUserClick: state.isUserClick};
}
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart, getFlightData, getFlightDataForInbound, userClick, setCurrentTimeInUTC  })(App);