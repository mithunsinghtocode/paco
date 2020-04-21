export const lineObj = (am4core, flight,lineSeries) => {

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
lineSeries.mapLines.template.shortestDistance=true;

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
//lineSeries.mapLines.template.line.controlPointDistance = 0.2;
//lineSeries.mapLines.template.line.controlPointPosition = 0.5;


return line;

}