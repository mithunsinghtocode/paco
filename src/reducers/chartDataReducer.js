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
    default:
      return state;
  }
};

export const allFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_FLIGHT_DATA":
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

export const setFlightsViewByInBoundOrOutbound = (screenViewSelected="INBOUND", action) => {
  if (action.type === "TOGGLE_INBOUND_OUTBOUND_VIEW") {
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
