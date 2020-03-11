import flightData from '../test/flight.json';

export const getFlightDataForInbound = () => dispatch => {
    //const response = await api.get('/inboundFlights');
    //console.log(flightData);
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const showFocusViewForSelectedFlight = (flightObj) => dispatch => {

    dispatch({ type: 'SHOW_FOCUS_VIEW_FOR_SELECTED_FLIGHT', payload: flightData});
}