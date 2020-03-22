export const inboundFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_INBOUND_FLIGHT_DATA":
      let inboundFlightData = action.payload.flightSchedule.flightList.filter(
        flight => flight.arrStn === "SIN"
      );
      let payload = [];
      payload.flightList = [...inboundFlightData];
      payload.stationcoordinates = getStationCoordinatesFromTheFlightList(inboundFlightData);
      console.log(payload.stationcoordinates);
      return payload;
    default:
      return state;
  }
};

export const outboundFlightDataReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_OUTBOUND_FLIGHT_DATA":
      let outboundFlightData = action.payload.flightSchedule.flightList.filter(
        flight => flight.depStn === "SIN"
      );
      let payload = [];
      payload.flightList = [...outboundFlightData];
      payload.stationcoordinates = action.payload.stationcoordinates;
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

const getStationCoordinatesFromTheFlightList = flightData => {
  let stationCoordinatesList = [];
  flightData.forEach(sectorObj => {
    stationCoordinatesList.push(prepareCoordinatesObject(sectorObj.depcoordinates));
    stationCoordinatesList.push(prepareCoordinatesObject(sectorObj.arrcoordinates));
  });
  console.log(stationCoordinatesList);
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