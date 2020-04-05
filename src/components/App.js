import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import FlightList from './flightlist/FlightList';
import { removeSelectedFlightFromMap, getFlightData, removeFocusViewForSelectedFlight } from '../actions/chartDataAction';
import { clearChartComponents } from "../components/map/objects/clearChartObjects";

import { initChart } from "../actions/chartAction";

class App extends React.Component {
    componentDidMount(){
        // Get all the flight Data
        this.props.getFlightData();
    }
    render(){
    return (
        <div>
            <Header />
            <Filter goBackFunction={() => {this.props.removeSelectedFlightFromMap(null); this.props.removeFocusViewForSelectedFlight(null); clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);}}/>
            <MapChartLayer />
            <FlightList />
            <FocusView />
            
        </div>
    );
    }
};

const mapStateToProps = (state, ownProps) => {
    return { state, chartObj: state.chartInit };
  }
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart, getFlightData })(App);