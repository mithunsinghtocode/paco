import React from  'react';
import "./focusView.scss";
import { connect } from "react-redux";
import { showSelectedFlightInMap, removeSelectedFlightFromMap } from "../../actions/chartDataAction";
import { clearChartComponents } from "../map/objects/clearChartObjects";

class FocusFlight extends React.Component {

    off = () => {
        this.props.removeSelectedFlightFromMap(null);
    }


    renderSelectedFlightInMap = () => {
        console.log("Into Flight Display View In Map");
        let selectedFlight = this.props.fltToDisplayInMap;
        if( selectedFlight != null){
            clearChartComponents(this.props.chartObj);
            console.log(selectedFlight);

        }else{
            return <div></div>;
        }

        
    }

    render(){
        return (
            <div> { this.renderSelectedFlightInMap() }</div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit };
}

export default connect(mapStateToProps , { showSelectedFlightInMap, removeSelectedFlightFromMap })(FocusFlight);