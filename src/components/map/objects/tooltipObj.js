export const tooltipObj = (line, lineSeries, am4core, flight) => {
  // Add a map object to line
  let bullet = line.lineObjects.create();
  bullet.nonScaling = true;
  bullet.position = flight.aircraft.position;
  bullet.fill = am4core.color(flight.config.linecolor);
  bullet.tooltipHTML = `<p style="margin-bottom:-4px;margin-top:-4px;color:#fff;height:25px">
    {flightData.carrierCode} {flightData.fltNum} | ETA {flightData.eta} 
    </p>`;
  bullet.tooltip.label.interactionsEnabled = true;
  bullet.tooltip.pointerOrientation = "left";
  bullet.tooltip.fitPointerToBounds = true;
  bullet.tooltip.background.pointerLength = 0;
  bullet.alwaysShowTooltip = true;
  bullet.tooltipY = 15;
  bullet.dy = 1;
  bullet.tooltip.dx = 10;
  bullet.tooltip.dy = -10;

  let dropShadow = new am4core.DropShadowFilter();
  dropShadow.opacity = 0.5;
  bullet.filters.push(dropShadow);

  lineSeries.flightData = {
    carrierCode: flight.carrierCode,
    fltNum: flight.flightNum,
    fbpDate: flight.fbpDate,
    sectorNum: flight.sectorNum
  };

  bullet.tooltip.flightData = lineSeries.flightData;
  line.flightData = lineSeries.flightData;

  return bullet;
};
