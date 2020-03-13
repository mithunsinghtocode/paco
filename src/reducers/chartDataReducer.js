export const chartDataReducer = (state = null, action) => {
    switch (action.type) {
      case "GET_INBOUND_FLIGHT_DATA":
        return action.payload;
      default:
        return state;
    }
  };

export const selectedFlightReducer = (selectFlight=null, action) => {
    if(action.type === 'SHOW_FOCUS_VIEW_FOR_SELECTED_FLIGHT'){
      console.log(action.payload);
        return action.payload;
    }
    if(action.type === 'REMOVE_FOCUS_VIEW_FOR_SELECTED_FLIGHT'){
      console.log(action.payload);
        return action.payload;
    }
    return selectFlight;
};


