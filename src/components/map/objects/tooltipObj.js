import { getHoursAndMinutesAfterFormat, getAircraftPositionBasedOnFlightObj } from "../../../utils/dateUtils";
import { getTotalPaxCountForFlight } from "../../../utils/paxUtils";
import { isDepNxt3Hrs } from "../../../utils/filterUtils";

// 5 minutes once
const TIME_TO_CHECK_AIRCRAFT_POSITION = 300000;
const isTest = true;
const FOCUSSED_OUTBOUND_COLOR = "#0483F8";
const OUTBOUND_VIEW_WITHIN_3HOURS_COLOR = "#E55541";
const OUTBOUND_HANDLED = "#414141";

const checkAircraftPosition = (aircraftPosition) => {
  if(!isFinite(aircraftPosition)) return 1;
  if(aircraftPosition>1) return 1;
  return (aircraftPosition < 0 ? 0 : aircraftPosition);
}

const ishandleNeeded = (flight) => {
  if(!flight.status.handled) return ``;
  return flight.status.handled && handleIcon();
}

export const tooltipObj = (line, lineSeries, am4core, flight, displayView, index, isFocusOutbound, consolidatedCoordinates, isFocusView) => {

  if(displayView==='OUTBOUND' && isDepNxt3Hrs(flight)) {
    //flight.config.linecolor = OUTBOUND_VIEW_WITHIN_3HOURS_COLOR;
    flight.config.tooltipcolor = OUTBOUND_VIEW_WITHIN_3HOURS_COLOR;
    flight.config.bulletColor = OUTBOUND_VIEW_WITHIN_3HOURS_COLOR;
  }
  // Add a map object to line
  let bullet = line.lineObjects.create();
  bullet.nonScaling = true;
  bullet.tooltip.getFillFromObject = false;
  let aircraftPosition = getAircraftPositionBasedOnFlightObj(flight, isTest);
  bullet.position =  flight.arrStn === 'SIN' ? checkAircraftPosition(aircraftPosition) : isFocusOutbound ? 0 : flight.aircraft.position;
  bullet.fill = am4core.color(isFocusOutbound ? FOCUSSED_OUTBOUND_COLOR : flight.config.tooltipcolor);
  //bullet.height = "35px";
  flight.status.misconnection ? 
  flight.arrStn === 'SIN' ? (bullet.tooltipHTML = `<div style="margin-bottom:0px;margin-top:0px;color:#fff;max-width:1000px;height:22px;font-family:Proxima Nova Thin;font-size: 14px;margin-right:5px;" onHover="cursor: pointer">
      <b style="font-family:Proxima Nova Semibold">${getFltNum(flight)}</b> ${displayLine()} ${getETA(flight)} ${displayLine()} <b  style="font-family:Proxima Nova Semibold;margin-right:2px">${getTotMisconnectedPax(flight, displayView)}</b>
    </div>`) : bullet.tooltipHTML = `<div style="margin-bottom:0px;margin-top:0px;color:#fff;max-width:1000px;height:22px;font-family:Proxima Nova Thin;font-size: 14px;">
    ${ishandleNeeded(flight)}<b  style="font-family:Proxima Nova Semibold">${getFltNum(flight)}</b> ${displayLine()} ${getDepTime(flight)} ${displayLine()} <b  style="font-family:Proxima Nova Semibold;margin-right:2px">${getTotMisconnectedPax(flight, displayView)}</b>
    </div>`
      :
      flight.arrStn === 'SIN' ? (bullet.tooltipHTML = `<div style="margin-bottom:0px;margin-top:0px;max-width:1000px;color:#fff;height:22px;font-family:Proxima Nova Thin;font-size: 14px;">
      <b  style="font-family:Proxima Nova Semibold">${getFltNum(flight)}</b> ${displayLine()} <div style="display:inline;margin-right:5px;">${getETA(flight)}</div>
    </div>`) : bullet.tooltipHTML = `<div style="margin-bottom:0px;margin-top:0px;color:#fff;max-width:1000px;height:22px;opacity:0.3;font-family:Proxima Nova Thin;font-size: 14px;">
    ${ishandleNeeded(flight)}<b  style="font-family:Proxima Nova Semibold">${getFltNum(flight)}</b> ${displayLine()} ${getDepTime(flight)}
    </div>`
    ;

    //box-shadow: 0 0 4px 0 rgba(0,0,0,0.5);

  bullet.fillOpacity = 1;
  bullet.tooltip.fillOpacity = 1;  
  bullet.tooltip.background.fillOpacity = 1;
  bullet.tooltip.label.interactionsEnabled = true;
  bullet.tooltip.fitPointerToBounds = true;
  bullet.tooltip.background.pointerLength = 0;
  bullet.tooltip.background.cornerRadius = 0;
  bullet.tooltip.background.fill = am4core.color(isFocusOutbound ? FOCUSSED_OUTBOUND_COLOR : flight.config.tooltipcolor);
  if(displayView==='OUTBOUND' && flight.status.handled){
    bullet.tooltip.background.fill = am4core.color(OUTBOUND_HANDLED);
  }
  //bullet.tooltip.background.boxShadow = '0 0 4px 0 rgba(0,0,0,0.5)';
  bullet.tooltip.background.strokeWidth = 0;
  bullet.alwaysShowTooltip = true;
  bullet.horizontalCenter = "middle";
  bullet.verticalCenter = "middle";
  
  if(flight.arrStn === 'SIN'){
    // set the position of the aircraft.
    // Logic to move airplane based on current time needs to be added on.
    var setPositionOfPlane = setInterval(() => {
      let aircraftPosition = getAircraftPositionBasedOnFlightObj(flight, isTest);
      let bulletPosition = checkAircraftPosition(aircraftPosition);
      bullet.position = isFocusOutbound ? 0 : bulletPosition;      
    }, TIME_TO_CHECK_AIRCRAFT_POSITION);
    setInterval(() => {
      if(bullet.position >= 0.9){
        clearInterval(setPositionOfPlane);
      }
    },TIME_TO_CHECK_AIRCRAFT_POSITION);
  }
  
  let dropShadow = new am4core.DropShadowFilter();                                  
  dropShadow.dy = -30;  
  dropShadow.dx = 0;
  dropShadow.blur = 0;
  dropShadow.opacity = 1;
  dropShadow.color = am4core.color("#E55541");
  dropShadow.height = 130;
  dropShadow.clonedFrom = bullet;
  dropShadow.filterUnits='objectBoundingBox';
  // commented as using different algorithm
  if(!isFocusOutbound && flight.depStn==='SIN' && flight.status.misconnection ) bullet.tooltip.filters.push(dropShadow);
  (displayView==='OUTBOUND' && isDepNxt3Hrs(flight)) && bullet.tooltip.filters.clear();
  (displayView==='OUTBOUND' && flight.status.handled) && bullet.tooltip.filters.clear();

  bullet.tooltip.background.filters.clear();

  //(flight.depStn==='SIN') && bullet.tooltip.background.filters.push(dropShadow1);

  //  if(getETA(flight) === "" || flight.depcoordinates.longitude > 100) {
  //    bullet.tooltip.dx = 100 ;
  //  } else{
  //    bullet.tooltip.dx = -80;
  //  } 
  if(getETA(flight) === "") bullet.tooltip.dx = 40;
  //flight.depcoordinates.longitude > 100 ? bullet.tooltip.dy = 45 : bullet.tooltip.dy = 35;

  bullet.tooltip.cursorOverStyle = am4core.MouseCursorStyle.pointer;
  bullet.tooltip.flightId = flight.flightId;  
  // removed as airplane icon does not need click
  //bullet.cursorOverStyle = am4core.MouseCursorStyle.pointer;  
  bullet.tooltip.dispatchImmediately("hit");
  line.tooltip.dispatchImmediately("hit");
  lineSeries.tooltip.dispatchImmediately("hit");

  if(flight.depStn==='SIN' && !flight.status.misconnection) { 
    bullet.tooltip.opacity = 0.32;
  }
  if(index % 2 === 0) {bullet.tooltip.dx = -20;bullet.tooltip.dy = -20;bullet.tooltip.pointerOrientation = 'right'};
  if(index % 3 === 0) {bullet.tooltip.dy = 20;bullet.tooltip.pointerOrientation = 'top'};
  if(index % 5 === 0) {bullet.tooltip.dy = -45;bullet.tooltip.pointerOrientation = 'bottom'};
  if(index % 2 === 1) {bullet.tooltip.dx = 20;bullet.tooltip.dy = 20;bullet.tooltip.pointerOrientation = 'left'};
  if(flight.depcoordinates.longitude > 120) {bullet.tooltip.dx = 20;bullet.tooltip.pointerOrientation = 'left'}; 

  bullet.tooltip.pointerOrientation = isFocusOutbound ? 'left' : bullet.tooltip.pointerOrientation;
  bullet.tooltip.dx = isFocusOutbound ? 20 : bullet.tooltip.dx;
  bullet.tooltip.dy = isFocusOutbound ? -15 : bullet.tooltip.dy;

  var dropShadow1 = new am4core.DropShadowFilter();
  dropShadow1.dx = 0;
  dropShadow1.dy = 0;
  dropShadow1.blur = 4;
  dropShadow1.color = am4core.color('rgba(0,0,0,0.5)');
  //0 0 4px 0 rgba(0,0,0,0.5);

  //latitude within +-4
  // longitude within +-50
  let currentLatitude = (!isFocusView && displayView==='INBOUND') ? flight.depcoordinates.latitude : flight.arrcoordinates.latitude;
  let currentLongitude = (!isFocusView && displayView==='INBOUND') ? flight.depcoordinates.longitude : flight.arrcoordinates.longitude;
  if(consolidatedCoordinates !== null && consolidatedCoordinates !== undefined){
  for(var i=0; i<consolidatedCoordinates.length ; i++){
    if (currentLatitude === consolidatedCoordinates[i].latitude && currentLongitude === consolidatedCoordinates[i].longitude) continue;
    if((Number(currentLatitude) - Number(consolidatedCoordinates[i].latitude) <= 3) && 
    (Number(currentLatitude) - Number(consolidatedCoordinates[i].latitude) >= -3) 
      &&  (Number(currentLongitude) - Number(consolidatedCoordinates[i].longitude) <= 50)
      &&  (Number(currentLongitude) - Number(consolidatedCoordinates[i].longitude) >= -10)){
      bullet.tooltip.background.filters.push(dropShadow1);
      break;
    }
    if(((Number(currentLongitude) - Number(consolidatedCoordinates[i].longitude) <= 10) &&
    (Number(currentLongitude) - Number(consolidatedCoordinates[i].longitude) >= 0))
    &&  ((Number(currentLatitude) - Number(consolidatedCoordinates[i].latitude) <= 20)
    && (Number(currentLatitude) - Number(consolidatedCoordinates[i].latitude) >= 0))){
      bullet.tooltip.background.filters.push(dropShadow1);
      break;
    }
  };
}


  if(flight.tooltip != null && flight.tooltip === "OUTBOUND")
  {
    if(index % 2 === 0)bullet.tooltip.dx = -10;
    if(index % 2 === 1)bullet.tooltip.dx = 10;
    bullet.dy = 0;
    bullet.dx = 0;
  }
  return bullet;
};

const getETA = (flight) => flight.eta !== null ? ` ETA ${getHoursAndMinutesAfterFormat(flight.eta)}` : "";

const getDepTime = (flight) => flight.etd !== null ? ` ETD ${getHoursAndMinutesAfterFormat(flight.etd)}` : ` STD ${getHoursAndMinutesAfterFormat(flight.std)}`;

const getTotMisconnectedPax = (flight, displayView) =>  ` ${displayPaxIcon()} ${getTotalPaxCountForFlight(flight, displayView)}`;

const displayPaxIcon = () => `<svg width="11px" height="14px" style="margin-bottom: 5px" viewBox="0 0 11 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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

const displayLine = () => `<b style="margin-left: 4px;height:24px;margin-right: 8px;box-sizing: border-box; width: 1px; border: 1px solid rgba(255, 255, 255, 0.29); margin-top: 0px"></b>`;

const handleIcon = () => `<svg width="14px" height="10px" viewBox="0 0 14 10" style="margin-right:8px;margin-bottom:4px">
<title>DC8FCBAF-F767-4CDD-A847-5EB0E6D0B941</title>
<g id="Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <g id="120-Selected-Critical-Flight" transform="translate(-1228.000000, -495.000000)" fill="#00DC88">
        <g id="CONTENT" transform="translate(-1167.000000, -392.000000)">
            <g id="FLIGHTS" transform="translate(1707.000000, 547.000000)">
                <g id="flight-details-copy-8" transform="translate(679.000000, 328.000000)">
                    <g id="color/blue">
                        <path d="M22.6756757,12.3281853 C22.2432432,11.8906049 21.5405405,11.8906049 21.1081081,12.3281853 L14.027027,19.3552124 L10.8918919,16.2149292 C10.4594595,15.7773488 9.75675676,15.7773488 9.32432432,16.2149292 C8.89189189,16.6525097 8.89189189,17.3474903 9.32432432,17.7850708 L13.2432432,21.6718147 C13.6756757,22.1093951 14.3783784,22.1093951 14.8108108,21.6718147 L22.6756757,13.8725869 C23.1081081,13.4607465 23.1081081,12.7657658 22.6756757,12.3281853 Z" id="Path-Copy-3"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</g>
</svg>`;

const getFltNum = (flight) => `${flight.fltNum.substr(0,2)} ${flight.fltNum.substr(2,5)}`; 
