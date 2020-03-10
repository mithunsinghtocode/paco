export default (state = [], action) => {
    switch (action.type) {
      case "NO_ACTION_TAKEN":
        console.log(action.payload);
        return action.payload;
      default:
        return state;
    }
  };