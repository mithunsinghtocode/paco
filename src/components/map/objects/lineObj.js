const PACIFIC_OCEAN_COUNTRIES = ['LAX','SFO','SEA'];
const ATLANTIC_OCEAN_COUNTRIES = ['EWR','JFK','IAH'];
const DEFINE_PATH_THROUGH_PACIFIC_ARRSTN = ['EWR'];

export const lineObj = (am4core, flight,lineSeries, chartObj, am4maps) => {
  
  // if((flight.depcoordinates.latitude > 100 && flight.depcoordinates.longitude < 100) || (flight.depcoordinates.longitude < -60 && flight.depcoordinates.latitude < 100)) {
  //   lineSeries = chartObj.series.push(new am4maps.MapArcSeries())
  // };

  if(ATLANTIC_OCEAN_COUNTRIES.includes(flight.depStn)){
    lineSeries = chartObj.series.push(new am4maps.MapArcSeries());
    if(flight.flightId === "SQ021202003151445EWRSIN1"){
      lineSeries.mapLines.template.line.nonScalingStroke = true;
    lineSeries.mapLines.template.line.rtl = true;
          // lineSeries.mapArc.template.marginBottom = 20;     
      // lineSeries.mapArc.template.layout = 'none'; 
      // lineSeries.mapArc.template.interactionsEnabled = false; 
    }
  };  
  lineSeries.mapLines.template.strokeWidth = 0.5;
  lineSeries.mapLines.template.nonScalingStroke = true;
  lineSeries.mapLines.nonScaling = true;

  // Dont enable this unless you need very high quelity lines draw and no worry on performance.
  //lineSeries.mapLines.template.pixelPerfect = true;

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
      { latitude: flight.depcoordinates.latitude, longitude: flight.depcoordinates.longitude },
      { "latitude": flight.arrcoordinates.latitude, "longitude": 180 },
      { "latitude": flight.arrcoordinates.latitude, "longitude": flight.arrcoordinates.longitude }
    ]
  ];
}


if(flight.depStn==='SIN' && !flight.status.misconnection) { 
  line.opacity = 0.3;
}

return line;

}