export const getStationCoordinatesFromTheFlightList = flightData => {
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