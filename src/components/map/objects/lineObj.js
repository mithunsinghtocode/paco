import { isDepNxt3Hrs } from "../../../utils/filterUtils";
const PACIFIC_OCEAN_COUNTRIES = ['LAX','SFO','SEA'];
const ATLANTIC_OCEAN_COUNTRIES = ['EWR','JFK','IAH'];
const DEFINE_PATH_THROUGH_PACIFIC_ARRSTN = ['EWR'];
const FOCUSSED_OUTBOUND_COLOR = "#0483F8";
const OUTBOUND_VIEW_WITHIN_3HOURS_COLOR = "#E55541";
const OUTBOUND_HANDLED = "#696969";

export const lineObj = (am4core, flight,lineSeries, chartObj, am4maps, isFocusOutbound, displayView) => {
  
  // if((flight.depcoordinates.latitude > 100 && flight.depcoordinates.longitude < 100) || (flight.depcoordinates.longitude < -60 && flight.depcoordinates.latitude < 100)) {
  //   lineSeries = chartObj.series.push(new am4maps.MapArcSeries())
  // };

  if(displayView!== undefined && displayView==='OUTBOUND' && isDepNxt3Hrs(flight)) {
    flight.config.linecolor = OUTBOUND_VIEW_WITHIN_3HOURS_COLOR;
  }

  if(displayView!== undefined && displayView==='OUTBOUND' && flight.status.handled) {
    flight.config.linecolor = OUTBOUND_HANDLED;
  }

  if(ATLANTIC_OCEAN_COUNTRIES.includes(flight.depStn)){
    lineSeries = chartObj.series.push(new am4maps.MapArcSeries());
      lineSeries.mapLines.template.line.nonScalingStroke = true;
       lineSeries.mapLines.template.line.controlPointPosition = 0.5; 
       lineSeries.mapLines.template.line.controlPointDistance = 0.25;
       lineSeries.interpolationDuration = 1000;
       lineSeries.mapLines.template.maxZoomCount = 1;
       lineSeries.mapLines.template.shortestDistance = true;
       
  };  
  lineSeries.mapLines.template.line.strokeWidth = 1;
   lineSeries.mapLines.template.line.nonScalingStroke = true;
   //lineSeries.mapLines.nonScaling = true;

  // Dont enable this unless you need very high quelity lines draw and no worry on performance.
  //lineSeries.mapLines.template.pixelPerfect = true;

  if(flight.config == null){
    console.log(flight.flightId);
  }
  lineSeries.mapLines.template.stroke = am4core.color(
    isFocusOutbound ? FOCUSSED_OUTBOUND_COLOR : flight.config.linecolor
  );

lineSeries.mapLines.template.calculatePercent = true;


var line = lineSeries.mapLines.create();
if(!DEFINE_PATH_THROUGH_PACIFIC_ARRSTN.includes(flight.arrStn)){
  if(ATLANTIC_OCEAN_COUNTRIES.includes(flight.depStn)){
    line.multiGeoLine = [
      [      
        { latitude: Number(flight.depcoordinates.latitude), longitude: Number(flight.depcoordinates.longitude) },
        { "latitude": Number(flight.arrcoordinates.latitude), "longitude": Number(flight.arrcoordinates.longitude) }
      ]
    ];
  }
  else{
    line.multiGeoLine = [
      [      
        { latitude: Number(flight.depcoordinates.latitude), longitude: Number(flight.depcoordinates.longitude) },
        { "latitude": Number(flight.arrcoordinates.latitude), "longitude": Number(flight.arrcoordinates.longitude) }
      ]
    ];
  }
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

if(displayView === 'OUTBOUND' && flight.depStn==='SIN' && flight.status.handled) { 
  line.opacity = 1;
}

return line;

}