import { combineReducers } from 'redux';
import bannerReducer from './bannerReducer';
import chartReducer from './chartReducer';
import { allFlightDataReducer, inboundFlightDataReducer, selectedFlightReducer, setFlightsViewByInBoundOrOutbound } from './chartDataReducer';

export default combineReducers({
    appData: bannerReducer,
    chartInit : chartReducer,
    allFlightData : allFlightDataReducer,
    inboundFlightData: inboundFlightDataReducer,
    selectedFlight: selectedFlightReducer,
    getDisplayView : setFlightsViewByInBoundOrOutbound
});