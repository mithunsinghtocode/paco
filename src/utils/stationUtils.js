export const getStationCoordinatesFromTheFlightList = flightData => {
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