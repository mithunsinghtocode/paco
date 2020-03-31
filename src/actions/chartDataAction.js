import flightData from '../test/flight.json';

export const getFlightData = () => dispatch => {
    dispatch({ type: 'GET_FLIGHT_DATA', payload: flightData});
};

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


export const showCorrespondingOutBoundFlights = selectedFlt => dispatch => {
    dispatch({ type: 'SHOW_CORRESPONDING_OUTBOUND_FLIGHTS_FOR_SELECTED_INBOUND_FLIGHTS', payload: selectedFlt});
}

export const switchFlightsViewByInBoundOrOutbound = screenViewSelected => dispatch => {
    console.log(screenViewSelected);
    dispatch({ type: 'TOGGLE_INBOUND_OUTBOUND_VIEW', payload: screenViewSelected});
} 

export const showSelectedFlightInMap = selectedFlt => dispatch => {
    console.log(selectedFlt);
    dispatch({ type: 'SHOW_SELECTED_FLIGHT_IN_MAP', payload: selectedFlt});
}

export const removeSelectedFlightFromMap = selectedFlt => dispatch => {
    dispatch({ type: 'REMOVE_SELECTED_FLIGHT_SHOW_ALL_FLTS', payload: selectedFlt});
}