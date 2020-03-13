import flightData from '../test/flight.json';

export const getFlightDataForInbound = () => dispatch => {
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const showFocusViewForSelectedFlight = selectedFlt => dispatch => {
    console.log(selectedFlt);
    dispatch({ type: 'SHOW_FOCUS_VIEW_FOR_SELECTED_FLIGHT', payload: selectedFlt});
}

export const removeFocusViewForSelectedFlight = selectedFlt => dispatch => {
    console.log(selectedFlt);
    dispatch({ type: 'REMOVE_FOCUS_VIEW_FOR_SELECTED_FLIGHT', payload: selectedFlt});
}
