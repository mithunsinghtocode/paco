import flightJSONData from '../test/flight.json';
import backend from '../api/backend';

// export const getFlightData = () => async (dispatch, getState) => {
//     console.log("<><><> About to fetch from Backend...");
//     Promise.resolve(
//         await dispatch(fetchFlightData())
//     ).then(
//         (data) => {
//             dispatch( getFlightDataForInbound(data.payload.flightSchedule.flightList))
//             return data;
//         }
//     ).then(
//         (data) => { dispatch( getFlightDataForOutBound(data.payload.flightSchedule.flightList))}
//     );
// };

// export const fetchFlightData = () => {
//     // Bad Approach !!! - Breaking rules of redux if not used thunk as below
//     return async (dispatch) => {
//         const response = await backend.get('/paco-api/getFlightDetails');
//        return dispatch({ type: 'GET_FLIGHT_DATA', payload: response.data});
//     };
// };

export const getFlightData = () => (dispatch, getState) => {
    console.log("<><><> About to fetch from Sample File...");
    Promise.resolve( 
        dispatch({ type: 'GET_FLIGHT_DATA', payload: flightJSONData})
    ).then(
        (data) => { 
           dispatch(getFlightDataForInbound(data.payload.flightSchedule.flightList));
           return data;
        }
    ).then(
        (data) => dispatch(getFlightDataForOutBound(data.payload.flightSchedule.flightList))
    );
};

export const getFlightDataForOutBound = (flightData) => dispatch => {
    console.log("Into outbound action");
    dispatch({ type: 'GET_OUTBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFlightDataForInbound = (flightData) => dispatch => {
    console.log("Into inbound action");
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFilteredFlightDataForInbound = flightData => dispatch => {
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