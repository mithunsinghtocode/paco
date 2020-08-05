import flightJSONData from '../test/flight.json';
import flightJSONData1 from '../test/flight1.json';
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

// export const getTransitionFlightData = () => async (dispatch, getState) => {
//     console.log("<><><> About to fetch from Backend...");
//     Promise.resolve(
//         await dispatch(fetchTransitionFlightData())
//     ).then(
//         (data) => {
//             dispatch( getTransitionFlightDataForInbound(data.payload.flightSchedule.flightList))
//             return data;
//         }
//     ).then(
//         (data) => { dispatch( getTransitionFlightDataForOutBound(data.payload.flightSchedule.flightList))}
//     );
// };

// export const fetchTransitionFlightData = () => {
//     // Bad Approach !!! - Breaking rules of redux if not used thunk as below
//     return async (dispatch) => {
//         const response = await backend.get('/paco-api/getTransitionFlightDetails');
//        return dispatch({ type: 'GET_FLIGHT_DATA_TRANSITION', payload: response.data});
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

export const getTransitionFlightData = () => (dispatch, getState) => {
    console.log("<><><> About to fetch from Sample File...");
    Promise.resolve( 
        dispatch({ type: 'GET_FLIGHT_DATA_TRANSITION', payload: flightJSONData1})
    ).then(
        (data) => { 
           dispatch(getTransitionFlightDataForInbound(data.payload.flightSchedule.flightList));
           return data;
        }
    ).then(
        (data) => dispatch(getTransitionFlightDataForOutBound(data.payload.flightSchedule.flightList))
    );
};

export const getTransitionFlightDataForOutBound = (flightData) => dispatch => {
    dispatch({ type: 'GET_TRANSITION_OUTBOUND_FLIGHT_DATA', payload: flightData});
};

export const getTransitionFlightDataForInbound = (flightData) => dispatch => {
    dispatch({ type: 'GET_TRANSITION_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFlightDataForOutBound = (flightData) => dispatch => {
    dispatch({ type: 'GET_OUTBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFlightDataForInbound = (flightData) => dispatch => {
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFilteredFlightDataForInbound = flightData => dispatch => {
    dispatch({ type: 'GET_INBOUND_FLIGHT_DATA', payload: flightData});
};

export const getFilteredFlightDataForOutbound = flightData => dispatch => {
    dispatch({ type: 'GET_OUTBOUND_FLIGHT_DATA', payload: flightData});
};

export const showFocusViewForSelectedFlight = selectedFlt => dispatch => {
    dispatch({ type: 'SHOW_FOCUS_VIEW_FOR_SELECTED_FLIGHT', payload: selectedFlt});
}

export const removeFocusViewForSelectedFlight = selectedFlt => dispatch => {
    dispatch({ type: 'REMOVE_FOCUS_VIEW_FOR_SELECTED_FLIGHT', payload: selectedFlt});
}


export const showCorrespondingOutBoundFlights = selectedFlt => dispatch => {
    dispatch({ type: 'SHOW_CORRESPONDING_OUTBOUND_FLIGHTS_FOR_SELECTED_INBOUND_FLIGHTS', payload: selectedFlt});
}

export const switchFlightsViewByInBoundOrOutbound = screenViewSelected => dispatch => {
    dispatch({ type: 'TOGGLE_INBOUND_OUTBOUND_VIEW', payload: screenViewSelected});
}

export const userClick = isUserClick => dispatch => {
    dispatch({ type: 'USER_CLICK', payload: isUserClick});
}

export const showSelectedFlightInMap = selectedFlt => dispatch => {
    dispatch({ type: 'SHOW_SELECTED_FLIGHT_IN_MAP', payload: selectedFlt});
}

export const removeSelectedFlightFromMap = selectedFlt => dispatch => {
    dispatch({ type: 'REMOVE_SELECTED_FLIGHT_SHOW_ALL_FLTS', payload: selectedFlt});
}

export const setCurrentTimeInUTC = currTime => dispatch => {
    dispatch({ type: 'CURRENT_TIME', payload: currTime});
}

export const setTestState = isTest => dispatch => {
    dispatch({ type: 'TEST_STATE', payload: isTest});
}

export const setTestDateTimeStamp = dateTime => dispatch => {
    dispatch({ type: 'DATE_TIME', payload: dateTime});
}