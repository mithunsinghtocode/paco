import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import FlightList from './flightlist/FlightList';
import { removeSelectedFlightFromMap } from '../actions/chartDataAction';
import { clearChartComponents } from "../components/map/objects/clearChartObjects";

import { initChart } from "../actions/chartAction";

class App extends React.Component {
    render(){
    return (
        <div>
            <Header />
            <Filter goBackFunction={() => {this.props.removeSelectedFlightFromMap(null); clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);}}/>
            <MapChartLayer />
            < FocusView />
            < FlightList />
            
        </div>
    );
    }
};

const mapStateToProps = (state, ownProps) => {
    return { state, chartObj: state.chartInit };
  }
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, initChart })(App);