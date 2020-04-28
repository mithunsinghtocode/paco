export const lineObj = (am4core, flight,lineSeries, chartObj, am4maps) => {
  if((flight.depcoordinates.latitude > 100 && flight.depcoordinates.longitude < 100) || (flight.depcoordinates.longitude < -60 && flight.depcoordinates.latitude < 100)) {
    lineSeries = chartObj.series.push(new am4maps.MapArcSeries())
  };

lineSeries.mapLines.template.strokeWidth = 0.5;

if(flight.config == null){
  console.log(flight.flightId);
}
lineSeries.mapLines.template.stroke = am4core.color(
  flight.config.linecolor
);
//lineSeries.mapLines.template.nonScalingStroke = false;
// lineSeries.tooltip.background.stroke = am4core.color(
//   flight.config.linecolor
// );
lineSeries.mapLines.template.calculatePercent = true;
(flight.depcoordinates.latitude > 100 && flight.depcoordinates.longitude < 100) ? lineSeries.mapLines.template.shortestDistance=false : lineSeries.mapLines.template.shortestDistance=true;


var line = lineSeries.mapLines.create();
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

/** For MapArcSeries props */
lineSeries.mapLines.template.line.controlPointDistance = 0.2;
lineSeries.mapLines.template.line.controlPointPosition = 0.5;


return line;

}