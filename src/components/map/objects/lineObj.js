const PACIFIC_OCEAN_COUNTRIES = ['LAX','SFO','SEA'];
const ATLANTIC_OCEAN_COUNTRIES = ['EWR','JFK','IAH'];
const DEFINE_PATH_THROUGH_PACIFIC_ARRSTN = ['EWR'];

export const lineObj = (am4core, flight,lineSeries, chartObj, am4maps) => {
  
  // if((flight.depcoordinates.latitude > 100 && flight.depcoordinates.longitude < 100) || (flight.depcoordinates.longitude < -60 && flight.depcoordinates.latitude < 100)) {
  //   lineSeries = chartObj.series.push(new am4maps.MapArcSeries())
  // };

  if(ATLANTIC_OCEAN_COUNTRIES.includes(flight.depStn)){
    lineSeries = chartObj.series.push(new am4maps.MapArcSeries());
    lineSeries.mapLines.template.shortestDistance=false;
  };  
  lineSeries.mapLines.template.strokeWidth = 0.5;

  if(flight.config == null){
    console.log(flight.flightId);
  }
  lineSeries.mapLines.template.stroke = am4core.color(
    flight.config.linecolor
  );

lineSeries.mapLines.template.calculatePercent = true;

var line = lineSeries.mapLines.create();
if(!DEFINE_PATH_THROUGH_PACIFIC_ARRSTN.includes(flight.arrStn)){
line.multiGeoLine = [
  [
    {
      latitude: flight.depcoordinates.latitude,
      longitude: flight.depcoordinates.longitude
    },
    {
      latitude: flight.arrcoordinates.latitude,
      longitude: flight.arrcoordinates.longitude
    }
  ]
];
}
if(DEFINE_PATH_THROUGH_PACIFIC_ARRSTN.includes(flight.arrStn)){
  line.multiGeoLine = [
    [      
      { "latitude": 1.35019, "longitude": 103.994003 },
      { "latitude": 50, "longitude": 180 },
      { "latitude": 50, "longitude": -74.005973 }
    ]
  ];
}


if(flight.depStn==='SIN' && !flight.status.misconnection) { 
  line.opacity = 0.3;
}

return line;

}