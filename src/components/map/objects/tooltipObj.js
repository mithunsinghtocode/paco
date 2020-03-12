export const tooltipObj = (line, lineSeries, am4core, flight) => {
  // Add a map object to line
  let bullet = line.lineObjects.create();
  bullet.nonScaling = true;
  bullet.position = flight.aircraft.position;
  bullet.fill = am4core.color(flight.config.linecolor);
  bullet.tooltipHTML = `<p style="margin-bottom:-4px;margin-top:-4px;color:#fff;height:25px">
    {flightData.carrierCode} {flightData.flightNum} | ETA {flightData.eta}
    </p>`;
  bullet.tooltip.label.interactionsEnabled = true;
  //bullet.tooltip.pointerOrientation = "left";
  bullet.tooltip.fitPointerToBounds = true;
  bullet.tooltip.background.pointerLength = 0;
  bullet.alwaysShowTooltip = true;
  bullet.tooltipY = 15;
  bullet.tooltipX = -5;
  //bullet.dy = 1;
  bullet.tooltip.dx = 110;
  bullet.tooltip.dy = -15;

  let dropShadow = new am4core.DropShadowFilter();
  dropShadow.opacity = 0.5;
  bullet.filters.push(dropShadow);

  // Commented as taken the object from store itself having single source of truth
  lineSeries.flightData = {
    carrierCode: flight.carrierCode,
    fltNum: flight.flightNum,
    fbpDate: flight.fbpDate,
    sectorNum: flight.sectorNum,
    flightId: flight.flightId
  };

  bullet.tooltip.flightData = flight;
  line.flightData = lineSeries.flightData;

  return bullet;
};
