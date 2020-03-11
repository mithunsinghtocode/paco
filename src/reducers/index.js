import { combineReducers } from 'redux';
import bannerReducer from './bannerReducer';
import chartReducer from './chartReducer';
import chartDataReducer from './chartDataReducer';

export default combineReducers({
    appData: bannerReducer,
    chartInit : chartReducer,
    flightData: chartDataReducer
});