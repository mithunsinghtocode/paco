import { getHoursAndMinutesAfterFormat, getUTCDate } from "../../../utils/dateUtils";

export const tooltipObj = (line, lineSeries, am4core, flight) => {
  // Add a map object to line
  let bullet = line.lineObjects.create();
  bullet.nonScaling = true;
  bullet.position = flight.aircraft.position;
  bullet.fill = am4core.color(flight.config.tooltipcolor);
  bullet.tooltipHTML = `<p style="margin-bottom:-2px;margin-top:-2px;color:#fff;height:26px">
    ${getFltNume(flight)} ${getETA(flight)}
    </p>`;
  bullet.tooltip.label.interactionsEnabled = true;
  //bullet.tooltip.pointerOrientation = "left";
  bullet.tooltip.fitPointerToBounds = true;
  bullet.tooltip.background.pointerLength = 0;
  bullet.tooltip.background.stroke = am4core.color(flight.config.tooltipcolor);
  bullet.alwaysShowTooltip = true;
  //bullet.tooltipY = 10;
  //bullet.tooltipX = -5;
  //bullet.dy = 5;
  (getETA(flight) === "" || flight.depcoordinates.longitude > 100) ? bullet.tooltip.dx = 70 : bullet.tooltip.dx = -80;
  if(getETA(flight) === "") bullet.tooltip.dx = 40;
  flight.depcoordinates.longitude > 100 ? bullet.tooltip.dy = 45 : bullet.tooltip.dy = 35;

  if(flight.tooltip != null && flight.tooltip === "OUTBOUND")
  {
    bullet.tooltip.dy = 0;
    bullet.tooltip.dx = 0;
    bullet.dy = 0;
    bullet.dx = 0;
  }

  let dropShadow = new am4core.DropShadowFilter();
  dropShadow.opacity = 0.5;
  bullet.filters.push(dropShadow);

  // Commented as taken the object from store itself having single source of truth
  // lineSeries.flightData = {
  //   carrierCode: flight.carrierCode,
  //   fltNum: flight.flightNum,
  //   fbpDate: flight.fbpDate,
  //   sectorNum: flight.sectorNum,
  //   flightId: flight.flightId
  // };

  bullet.tooltip.flightData = flight;
  line.flightData = lineSeries.flightData;

  return bullet;
};

const getETA = (flight) => flight.eta !== null ? `| ETA ${getHoursAndMinutesAfterFormat(flight.eta)}` : "";


const getFltNume = (flight) => `${flight.fltNum.substr(0,2)} ${flight.fltNum.substr(2,5)}`;  
