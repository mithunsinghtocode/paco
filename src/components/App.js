import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import { removeSelectedFlightFromMap, getFlightData, removeFocusViewForSelectedFlight, getFlightDataForInbound, userClick, setCurrentTimeInUTC,
    getTransitionFlightData, showSelectedFlightInMap  } from '../actions/chartDataAction';
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

        // If needed to reduce memory usage then execute this function say every 15 minutes which will reset all objects.
        setInterval(() => {
            window.location.reload();
        },900000)

    setInterval(() => {
        this.getFlightDataInTimeInterval();
         console.log(this.props.flightData);
         this.props.fltToDisplayInMap && this.props.flightData && this.props.flightData.flightSchedule.flightList.forEach((flight) => {
            if(this.props.fltToDisplayInMap.flightId === flight.flightId) {
                this.props.showSelectedFlightInMap(flight);
            }
         });
         this.props.setCurrentTimeInUTC(getCurrentTimeInUTC());
    },60000);

    // setInterval(() => {
    //     this.getFlightDataInTimeInterval();
    // },60000);
        
    }

    getFlightDataInTimeInterval = () => {
        new Promise((resolve, reject) => {
            //resolve(this.props.getTransitionFlightData());
            resolve(this.props.getFlightData());
        });
    }

    render(){
        return (
            <>
                <Header />
                <Filter goBackFunction={() => {this.props.removeSelectedFlightFromMap(null); this.props.removeFocusViewForSelectedFlight(null); clearChartComponents(this.props.chartObj, ["ALL"]); renderChartLayout(this.props.chartObj); this.props.userClick(false) }}/>
                <MapChartLayer/>
                <FocusView />
            </>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    console.log(state)
    return { state, chartObj: state.chartInit, flightData : state.allFlightData, isUserClick: state.isUserClick, fltToDisplayInMap : state.getFltToShowInMap,};
}
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart, getFlightData, getFlightDataForInbound, userClick, setCurrentTimeInUTC, getTransitionFlightData, showSelectedFlightInMap  })(App);