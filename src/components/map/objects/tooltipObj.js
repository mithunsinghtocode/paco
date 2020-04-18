import { getHoursAndMinutesAfterFormat, getUTCDate } from "../../../utils/dateUtils";
import { getTotalPaxCountForFlight } from "../../../utils/paxUtils";

export const tooltipObj = (line, lineSeries, am4core, flight, displayView) => {
  // Add a map object to line
  let bullet = line.lineObjects.create();
  bullet.nonScaling = true;
  bullet.position = flight.aircraft.position;
  bullet.fill = am4core.color(flight.config.tooltipcolor);
  
  flight.status.misconnection ? 
    bullet.tooltipHTML = `<div style="margin-bottom:2px;margin-top:-2px;color:#fff;height:20px;">
      ${getFltNum(flight)} ${getETA(flight)} ${displayLine()} ${getTotMisconnectedPax(flight, displayView)}
    </div>`
      :
    bullet.tooltipHTML = `<p style="margin-bottom:2px;margin-top:-2px;color:#fff;height:20px">
    ${getFltNum(flight)} ${getETA(flight)}
    </p>`
    ;

  bullet.tooltip.label.interactionsEnabled = true;
  //bullet.tooltip.pointerOrientation = "left";
  bullet.tooltip.fitPointerToBounds = true;
  bullet.tooltip.background.pointerLength = 0;
  bullet.tooltip.background.cornerRadius = 0;
  bullet.tooltip.background.stroke = am4core.color(flight.config.tooltipcolor);
  bullet.tooltip.background.strokeWidth = 2;
  bullet.alwaysShowTooltip = true;

  let dropShadow = new am4core.DropShadowFilter();                                  
  dropShadow.dy = -30;  
  dropShadow.dx = 0;
  dropShadow.blur = 0;
  dropShadow.opacity = 1;
  dropShadow.color = am4core.color("#E55541");
  dropShadow.height = 130;
  (flight.depStn==='SIN' && flight.status.misconnection) && bullet.tooltip.filters.push(dropShadow);
  
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

  // let dropShadow = new am4core.DropShadowFilter();
  // dropShadow.opacity = 0.5;
  // bullet.filters.push(dropShadow);

  bullet.tooltip.flightData = flight;
  line.flightData = lineSeries.flightData;

  return bullet;
};

const getETA = (flight) => flight.eta !== null ? `${displayLine()} ETA ${getHoursAndMinutesAfterFormat(flight.eta)}` : "";

const getTotMisconnectedPax = (flight, displayView) =>  ` ${displayPaxIcon()} ${getTotalPaxCountForFlight(flight, displayView)}`;

const displayPaxIcon = () => `<svg width="11px" height="14px" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>59CA7DD7-DDB0-4CE7-B689-DD292906993D</title>
<desc>Created with sketchtool.</desc>
<g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="200-All-Affected-Outbound-Flights" transform="translate(-378.000000, -175.000000)" fill="#FFFFFF" fill-rule="nonzero">
        <g id="CONTENT" transform="translate(-1167.000000, -392.000000)">
            <g id="FLIGHTS" transform="translate(1401.000000, 543.000000)">
                <g id="flight-details-copy-3" transform="translate(0.000000, 13.000000)">
                    <g id="Group" transform="translate(144.000000, 11.000000)">
                        <circle id="Oval" cx="5.5" cy="2.5" r="2.5"></circle>
                        <path d="M10.9156028,11.3333333 L8.36203916,6.49382716 C8.20569853,6.19753086 7.8669605,6 7.52822247,6 L3.4633661,6 C3.0985713,6 2.78589004,6.19753086 2.62954941,6.49382716 L0.102042567,11.3333333 C-0.132468377,11.7777778 0.0499290243,12.3209877 0.518950913,12.5185185 C0.987972801,12.7407407 1.56122178,12.5679012 1.79573272,12.1234568 L3.33308224,9.16049383 L2.65560618,13.1111111 C2.57743587,13.5802469 2.94223067,14 3.43730933,14 L7.52822247,14 C8.02330113,14 8.38809593,13.5802469 8.30992562,13.1111111 L7.63244955,9.16049383 L9.16979908,12.1234568 C9.32613971,12.4444444 9.66487774,12.617284 10.0036158,12.617284 C10.1338996,12.617284 10.2902403,12.5925926 10.4205241,12.5185185 C10.9416595,12.2962963 11.1240569,11.7530864 10.9156028,11.3333333 Z" id="Path"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</g>
</svg>`;

const displayLine = () => `<b style="margin-left: 1px;margin-right: 4px;box-sizing: border-box; width: 2px; border: 1px solid rgba(255, 255, 255, 0.29); margin-top: 0px"></b>`;

const getFltNum = (flight) => `${flight.fltNum.substr(0,2)} ${flight.fltNum.substr(2,5)}`; 
