export const inboundFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_INBOUND_FLIGHT_DATA":
      let flightList = Array.isArray(action.payload) ? action.payload : action.payload.flightSchedule.flightList;
      let inboundFlightData = flightList.filter(
        flight => (flight.arrStn === "SIN" || flight.depStn !== "SIN") && flight.eta !== null && flight.eta > (flight.rta || flight.sta)
      );
      let payload = [];
      payload.flightList = [...inboundFlightData];
      payload.stationcoordinates = getStationCoordinatesFromTheFlightList(inboundFlightData);
      //console.log(payload.stationcoordinates);
      return payload;
      case "GET_TRANSITION_INBOUND_FLIGHT_DATA":
      let flightList1 = Array.isArray(action.payload) ? action.payload : action.payload.flightSchedule.flightList;
      let inboundFlightData1 = flightList1.filter(
        flight => (flight.arrStn === "SIN" || flight.depStn !== "SIN") 
      );
      // && flight.eta !== null && flight.eta > (flight.rta || flight.sta)
      let newState =  state.flightList;
      let filterState =  newState.filter((flight) => {
          return inboundFlightData1.find((newObj) => flight.flightId === newObj.flightId) === undefined ? true : false;
        });
        //console.log(filterState);
      let payload1 = [];
      let inboundFlightData2 = inboundFlightData1.filter(
        flight => (flight.arrStn === "SIN" || flight.depStn !== "SIN") && flight.eta !== null && flight.eta > (flight.rta || flight.sta)
      );
      let filterState2 = filterState.filter(
        flight => (flight.arrStn === "SIN" || flight.depStn !== "SIN") && flight.eta !== null && flight.eta > (flight.rta || flight.sta)
      );
      payload1.flightList = [...filterState2,...inboundFlightData2];
      payload1.stationcoordinates = getStationCoordinatesFromTheFlightList(payload1.flightList);
      //console.log(payload.stationcoordinates);
      return payload1;
    default:
      return state;
  }
};

export const outboundFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_OUTBOUND_FLIGHT_DATA":
      let flightList = Array.isArray(action.payload) ? action.payload : action.payload.flightSchedule.flightList;
      let outboundFlightData = flightList.filter(
        flight => flight.depStn === "SIN" 
        //&& flight.etd !== null && flight.etd > (flight.rtd || flight.std)
      );
      let payload = [];
      payload.flightList = [...outboundFlightData];
      payload.stationcoordinates = getStationCoordinatesFromTheFlightList(outboundFlightData);
      //console.log(outboundFlightData)
      return payload;
    case "GET_TRANSITION_OUTBOUND_FLIGHT_DATA":
      let flightList1 = Array.isArray(action.payload) ? action.payload : action.payload.flightSchedule.flightList;
      let outboundFlightData1 = flightList1.filter(
        flight => flight.depStn === "SIN" 
    );
    let newState =  state.flightList;
    let filterState =  newState.filter((flight) => {
        return outboundFlightData1.find((newObj) => flight.flightId === newObj.flightId)  === undefined ? true : false;;
      });
      //console.log(filterState);
    let payload1 = [];
    payload1.flightList = [...filterState,...outboundFlightData1];
    payload1.stationcoordinates = getStationCoordinatesFromTheFlightList(payload1.flightList);
    //console.log(payload.stationcoordinates);
    return payload1;
    default:
      return state;
  }
};

export const allFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_FLIGHT_DATA":
      return action.payload;
    case "GET_FLIGHT_DATA_TRANSITION":
      let newState =  state.flightSchedule.flightList;
    let filterState =  newState.filter((flight) => {
        return action.payload.flightSchedule.flightList.find((newObj) => flight.flightId === newObj.flightId)  === undefined ? true : false;;
      });
    let allFlightData = {};
    allFlightData.flightSchedule = {};
    allFlightData.flightSchedule.flightList = [...filterState,...action.payload.flightSchedule.flightList];
      return allFlightData;
    default:
      return state;
  }
};

export const allFlightDataReducerTransition = (state = null, action) => {
  switch (action.type) {
    case "GET_FLIGHT_DATA_TRANSITION":
      return action.payload;
    default:
      return state;
  }
};

export const selectedFlightReducer = (selectFlight = null, action) => {
  if (action.type === "SHOW_FOCUS_VIEW_FOR_SELECTED_FLIGHT") {
    return action.payload;
  }
  if (action.type === "REMOVE_FOCUS_VIEW_FOR_SELECTED_FLIGHT") {
    return action.payload;
  }
  return selectFlight;
};

export const selectedFlightInMapReducer = (selectFlight = null, action) => {
  if (action.type === "SHOW_SELECTED_FLIGHT_IN_MAP") {
    return action.payload;
  }
  if (action.type === "REMOVE_SELECTED_FLIGHT_SHOW_ALL_FLTS") {
    return action.payload;
  }
  return selectFlight;
};

const getStationCoordinatesFromTheFlightList = flightData => {
  let stationCoordinatesList = [];
  flightData.forEach(sectorObj => {
    let flightStationCoordinates = [];
    let depCoordinates = prepareCoordinatesObject(sectorObj.depcoordinates);
    let arrcoordinates = prepareCoordinatesObject(sectorObj.arrcoordinates);
    stationCoordinatesList.push(depCoordinates);
    stationCoordinatesList.push(arrcoordinates);
    flightStationCoordinates.push(depCoordinates);
    flightStationCoordinates.push(arrcoordinates);
    sectorObj.stationcoordinates = flightStationCoordinates;
  });
  //console.log(stationCoordinatesList);
  return stationCoordinatesList;
};

const prepareCoordinatesObject = (stationObj) => {
  return { latitude : Number(stationObj.latitude), longitude : Number(stationObj.longitude), title: stationObj.title };
}

const getLocalStorage = (key) => {
  if (typeof(Storage) !== "undefined") {
    // Retrieve
    return localStorage.getItem(key);
    }
  }

const setLocalStorage = (key, value) => {
  if (typeof(Storage) !== "undefined") {
    // Store
    return localStorage.setItem(key, value);
}
}


export const setFlightsViewByInBoundOrOutbound = (screenViewSelected=getLocalStorage('screenname') ? getLocalStorage('screenname') : "INBOUND", action) => {
  if (action.type === "TOGGLE_INBOUND_OUTBOUND_VIEW") {
    setLocalStorage('screenname',action.payload);
    return action.payload;
  }
  return screenViewSelected;
}

export const userClick = (screenViewSelected=true, action) => {
  if (action.type === "USER_CLICK") {
    return action.payload;
  }
  return screenViewSelected;
}

export const getCurrentTime = (currentTime = null, action) => {
  if (action.type === "CURRENT_TIME") {
    return action.payload;
  }
  return currentTime;
}
export const getTestState = (isTest = false, action) => {
  if (action.type === "TEST_STATE") {
    return action.payload;
  }
  return isTest;
}
export const getTestDateTime = (dateTime = null, action) => {
  if (action.type === "DATE_TIME") {
    return action.payload;
  }
  return dateTime;
}

