import * as am4maps from "@amcharts/amcharts4/maps";

export const plotStationObj = (am4core, chartObj, flight) => {
  // Adds the circles to all the locations needed
  // Create image series
  var imageSeries = chartObj.series.push(new am4maps.MapImageSeries());

  // Create a circle image in image series template so it gets replicated to all new images
  var imageSeriesTemplate = imageSeries.mapImages.template;
  var circle = imageSeriesTemplate.createChild(am4core.Circle);
  circle.radius = 1.5;
  circle.fill = am4core.color("#FFFFFF");
  circle.stroke = am4core.color("#FFFFFF");
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
  imageSeries.data = flight.stationcoordinates;


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
    "latitude": 1.3521,
    "longitude": 103.8198,
    "title": "Singapore"
}];

};
