import React from 'react';
import { connect } from "react-redux";

import Header from './header/Header';
import Filter from './filter/Filter';
import MapChartLayer from './map/chart';
import FocusView from './focusview/FocusView';
import { removeSelectedFlightFromMap } from '../actions/chartDataAction';

class App extends React.Component {
    render(){
    return (
        <div>
            <Header />
            <Filter goBackFunction={() => this.props.removeSelectedFlightFromMap(null)}/>
            <MapChartLayer />
            < FocusView />
        </div>
    );
    }
};

const mapStateToProps = (state, ownProps) => {
    return { state };
  }
  
  export default connect(mapStateToProps , { removeSelectedFlightFromMap })(App);