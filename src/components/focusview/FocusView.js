import React from  'react';
import "./focusView.scss";
import { connect } from "react-redux";
import { showFocusViewForSelectedFlight } from "../../actions/chartDataAction";

class FocusView extends React.Component {

    componentDidMount(){
        let selectedFlight = this.props.selectedFlightObj;
        if( selectedFlight != null ){
            console.log(selectedFlight);
        }
    }

    render(){
        return (
            <div> Hello </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  return { selectedFlightObj : state.selectedFlight };
}

export default connect(mapStateToProps , { showFocusViewForSelectedFlight })(FocusView);