import React from 'react';
import { connect } from "react-redux";
import { getFlightDataForInbound } from "../../actions/chartDataAction";

class PathFinder extends React.Component {
    componentDidMount(){
        this.props.getFlightDataForInbound();
    }
    getChartObj = () => {
        return this.props.chartObj;
    }
    getInboundFlightData = () => {
        return this.props.inboundFlights;
    }
    renderFlightDataForInbound = () => {
        let chartObj = this.getChartObj();
        let flightObj = this.getInboundFlightData();
        if (chartObj !== null && flightObj !== null) {
            console.log("State re-renders the flight data component");
        }
    }
    render() {
        return (
             <div className=""> {this.renderFlightDataForInbound()}</div>
        )
    }
}

const mapStateToProps = (state, ownprops) => {
    console.log(state);
    return { chartObj: state.chartInit, inboundFlights: state.flightData };
  };
  
  export default connect(mapStateToProps, { getFlightDataForInbound })(PathFinder);
