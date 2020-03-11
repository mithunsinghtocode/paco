import flightData from '../test/flight.json';

export const getFlightDataForInbound = () => dispatch => {
    //const response = await api.get('/inboundFlights');
    //console.log(flightData);
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};