import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import { removeSelectedFlightFromMap, getFlightData, removeFocusViewForSelectedFlight, getFlightDataForInbound, userClick, setCurrentTimeInUTC,
    getTransitionFlightData, showSelectedFlightInMap, switchFlightsViewByInBoundOrOutbound  } from '../actions/chartDataAction';
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
        //this.props.setCurrentTimeInUTC(getCurrentTimeInUTC());
        //this.getFlightDataInTimeInterval();
         console.log(this.props.flightData);
        //  this.props.fltToDisplayInMap && this.props.flightData && this.props.flightData.flightSchedule.flightList.forEach((flight) => {
        //     if(this.props.fltToDisplayInMap.flightId === flight.flightId) {
        //         this.props.showSelectedFlightInMap(flight);
        //     }
        //  });
         //this.props.setCurrentTimeInUTC(getCurrentTimeInUTC());
    },300000);

    // setInterval(() => {
    //     this.getFlightDataInTimeInterval();
    // },60000);
        
    }

    getFlightDataInTimeInterval = () => {
        new Promise((resolve, reject) => {
            resolve(this.props.getTransitionFlightData());
            //resolve(this.props.getFlightData());
        });
    }

    render(){
        return (
            <>
                <Header />
                <Filter goBackFunction={() => {
                        //this.props.userClick(false); 
                        //console.log(this.props.selectedFlightObj.flightId);
                        //console.log(this.props.fltToDisplayInMap.flightId);
                        let fltFocusObj = this.props.fltToDisplayInMap;
                        let isTransition = false;
                        if(this.props.displayView === 'OUTBOUND' && 
                        this.props.fltToDisplayInMap.flightId === this.props.selectedFlightObj.flightId){
                            console.log('Inside User Click')
                            //this.props.userClick(true);
                            isTransition = true;                            
                        }
                        if(this.props.displayView === 'OUTBOUND' && this.props.fltToDisplayInMap.flightId !== this.props.selectedFlightObj.flightId){
                            this.props.showSelectedFlightInMap(fltFocusObj);
                            this.props.removeFocusViewForSelectedFlight(null);
                        }else{
                            this.props.removeSelectedFlightFromMap(null); 
                        }
                        isTransition && this.props.removeFocusViewForSelectedFlight(null);
                        !isTransition && !this.props.isUserClick && this.props.switchFlightsViewByInBoundOrOutbound("INBOUND") ;
                        
                        if(!isTransition && !this.props.isUserClick){
                            let inboundButton = document.getElementById('INBOUND');
                            let outboundButton = document.getElementById('OUTBOUND');
                            inboundButton.style.borderRight = "4px solid #00DC88";
                            outboundButton.style.borderRight = "0px";
                        }
                        console.log(this.props.isUserClick);
                        clearChartComponents(this.props.chartObj, ["ALL"]); 
                        renderChartLayout(this.props.chartObj); 
                        //this.props.userClick(false); 
                    }}/>
                <MapChartLayer/>
                <FocusView />
            </>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    console.log(state)
    console.log(state.isUserClick);
    return { state, chartObj: state.chartInit, flightData : state.allFlightData, isUserClick: state.isUserClick, fltToDisplayInMap : state.getFltToShowInMap,
        displayView: state.getDisplayView, selectedFlightObj: state.selectedFlight};
}
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart, getFlightData, getFlightDataForInbound, userClick, setCurrentTimeInUTC, getTransitionFlightData, showSelectedFlightInMap, switchFlightsViewByInBoundOrOutbound  })(App);