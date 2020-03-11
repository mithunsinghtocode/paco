export default (state = null, action) => {
    switch (action.type) {
      case "CHART_INIT":
        //console.log("Chart Reducer");
        //console.log(action.payload);
        return action.payload;
      default:
        return state;
    }
  };
