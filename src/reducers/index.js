import { combineReducers } from "redux";
import bannerReducer from "./bannerReducer";
import chartReducer from "./chartReducer";
import {
  allFlightDataReducer,
  inboundFlightDataReducer,
  selectedFlightReducer,
  setFlightsViewByInBoundOrOutbound,
  selectedFlightInMapReducer,
  outboundFlightDataReducer,
  userClick, getCurrentTime, getTestState, getTestDateTime, allFlightDataReducerTransition
} from "./chartDataReducer";

export default combineReducers({
  appData: bannerReducer,
  chartInit: chartReducer,
  allFlightData: allFlightDataReducer,
  inboundFlightData: inboundFlightDataReducer,
  outboundFlightData: outboundFlightDataReducer,
  selectedFlight: selectedFlightReducer,
  getDisplayView: setFlightsViewByInBoundOrOutbound,
  getFltToShowInMap: selectedFlightInMapReducer,
  isUserClick: userClick,
  getCurrentTime : getCurrentTime,
  isTest: getTestState,
  testTime : getTestDateTime,
  allFlightDataTransition: allFlightDataReducerTransition
});
