export default (state = null, action) => {
    switch (action.type) {
      case "GET_INBOUND_FLIGHT_DATA":
        //console.log("Inbound Flights");
        return action.payload;
      default:
        return state;
    }
  };