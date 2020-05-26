
import * as mapConst from "../mapConst";
export const setDefaultZoomAndGeoPointFocus = (chartObj) => {
  chartObj.homeZoomLevel = mapConst.$_asian_continents_zoom_level;
  chartObj.homeGeoPoint = {
    latitude: mapConst.$_asia_latitude,
    longitude: mapConst.$_asia_longitude,
  };
      // let isAmericaPresent = flightObj.stationcoordinates.filter(station =>
      //   station.longitude < -10 ? true : false
      // );
      // // set initial zoom and map points
      // if (isAmericaPresent !== undefined && isAmericaPresent.length > 0) {
      //   this.setDefaultZoomAndGeoPointFocus(
      //     chartObj,
      //     mapConst.$_america_asian_continents_zoom_level,
      //     mapConst.$_america_asia_latitude,
      //     mapConst.$_america_asia_longitude
      //   );
      // } else {
      //   this.setDefaultZoomAndGeoPointFocus(
      //     chartObj,
      //     mapConst.$_asian_continents_zoom_level,
      //     mapConst.$_asia_latitude,
      //     mapConst.$_asia_longitude
      //   );
      // }
};

export const goToHome = (chartObj) => {
chartObj.series.values[0].events.on("inited", function(ev) {
          chartObj.zoomDuration = 300;
          chartObj.goHome();
          });
chartObj.zoomLevel = chartObj.zoomLevel + 0.0001;
};
