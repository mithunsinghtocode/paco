export const lineObj = (am4core, flight,lineSeries) => {

lineSeries.mapLines.template.strokeWidth = 2;
lineSeries.mapLines.template.stroke = am4core.color(
  flight.config.linecolor
);
lineSeries.mapLines.template.nonScalingStroke = true;
lineSeries.tooltip.background.stroke = am4core.color(
  flight.config.linecolor
);

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

return line;

}