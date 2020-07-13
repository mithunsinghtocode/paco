import * as am4maps from "@amcharts/amcharts4/maps";
import { isDepNxt3Hrs } from "../../../utils/filterUtils";
const OUTBOUND_VIEW_WITHIN_3HOURS_COLOR = "#E55541";
const FOCUSSED_OUTBOUND_COLOR = "#FFFFFF";

export const plotStationObj = (am4core, chartObj, objData, imageSeries, imageSeriesTemplate, displayView, isFocusOutbound) => {

  if(displayView !== undefined && displayView==='OUTBOUND' && isDepNxt3Hrs(objData)) {
    objData.config.linecolor = OUTBOUND_VIEW_WITHIN_3HOURS_COLOR;
  }

  // Adds the circles to all the locations needed
  if(imageSeriesTemplate === null || imageSeriesTemplate === undefined){
    // Create image series
    imageSeries = chartObj.series.push(new am4maps.MapImageSeries());
    // Create a circle image in image series template so it gets replicated to all new images
    imageSeriesTemplate = imageSeries.mapImages.template;
  }
  var circle = imageSeriesTemplate.createChild(am4core.Circle);
  circle.radius = 1.5;
  circle.fill = objData.status ? (objData.status.misconnection || (displayView==='OUTBOUND' && isDepNxt3Hrs(objData)) ? objData.config.linecolor : "#FFFFFF") : "#FFFFFF";
  circle.stroke = objData.status ? (objData.status.misconnection || (displayView==='OUTBOUND' && isDepNxt3Hrs(objData)) ? objData.config.linecolor : "#FFFFFF") : "#FFFFFF";
  
  if(isFocusOutbound){
    circle.fill = FOCUSSED_OUTBOUND_COLOR;
    circle.stroke = FOCUSSED_OUTBOUND_COLOR;
  }
  circle.strokeWidth = 1;
  circle.nonScaling = true;
  circle.tooltipText = "{title}";
  //circle.alwaysShowTooltip = true;
  //circle.tooltipY=-10;

  // Set property fields
  imageSeriesTemplate.propertyFields.latitude = "latitude";
  imageSeriesTemplate.propertyFields.longitude = "longitude";
  imageSeries.propertyFields.tooltipText = "title";

  /* Commented for future use

  // Add circle alone and filters tooltip of the title in the json
  let stationCoordinateDataAfterFilteringCountry = flight.stationcoordinates.map(
    station => {
      return { latitude: station.latitude, longitude: station.longitude };
    }
  );
  imageSeries.data = stationCoordinateDataAfterFilteringCountry;

  */
  // This shows the tooltip of the country at the circle.
  imageSeries.data = objData.stationcoordinates ? objData.stationcoordinates : objData;


  // Create a circle image in image series template so it gets replicated to all new images
  var imageSeriesSin = chartObj.series.push(new am4maps.MapImageSeries());
  var imageSeriesTemplateSin = imageSeriesSin.mapImages.template;
  var circleSin = imageSeriesTemplateSin.createChild(am4core.Circle);
  circleSin.radius = 3;
  circleSin.fill = am4core.color("#FFFFFF");
  circleSin.stroke = am4core.color("#FFFFFF");
  circleSin.strokeWidth = 2;
  circleSin.nonScaling = true;
  circleSin.tooltipText = "{title}";
  // Set property fields
  imageSeriesTemplateSin.propertyFields.latitude = "latitude";
  imageSeriesTemplateSin.propertyFields.longitude = "longitude";
  imageSeriesSin.propertyFields.tooltipText = "title";
  imageSeriesSin.data = [{
    "latitude": 1.35019,
    "longitude": 103.994003,
    "title": "Singapore"
}];

};
