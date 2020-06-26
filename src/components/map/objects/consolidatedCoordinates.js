export  const consolidatedCoordinates = (flightList, displayView) =>{
          let coordinatesList = [];
          flightList.forEach( (fltObj, index) => {
                    switch(displayView){
                              case "INBOUND":
                                        coordinatesList.push(formCoordinate(fltObj, "depcoordinates"));
                                        break;
                              case "OUTBOUND":
                                        coordinatesList.push(formCoordinate(fltObj, "arrcoordinates"));
                                        break;
                              case "FOCUS_FLIGHT":
                                        coordinatesList.push(formCoordinate(fltObj, "arrcoordinates"));
                                        break;
                              default:
                                        break;
                    }

          });
          return coordinatesList;
}

const formCoordinate = (fltObj, prop) => {
          return { latitude: read_prop(fltObj, prop+".latitude"), longitude: read_prop(fltObj,prop+".longitude")};
}

const read_prop = (obj, prop) => {
          let nestedProps = prop.split('.');
          let returnValue;
           nestedProps.forEach((inprop, index) => {
                    obj = obj[nestedProps[index]];
                    if(index === nestedProps.length-1) returnValue = obj
          });
          return returnValue;
};