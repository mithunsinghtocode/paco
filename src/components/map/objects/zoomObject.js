import * as am4maps from "@amcharts/amcharts4/maps";
export const zoomObjectRender = ( chartObj, am4maps, am4core ) => {
  chartObj.zoomDuration = 50;
      // Zoom Slider
      chartObj.zoomControl = new am4maps.ZoomControl();
      chartObj.zoomControl.align = "right";
      chartObj.zoomControl.valign = "top";
      chartObj.zoomControl.marginRight = "-70px";
      chartObj.zoomControl.marginTop = "10px";
      chartObj.zoomControl.background.fill = am4core.color("#2E2E2E");
      chartObj.zoomControl.plusButton.background.cornerRadius(5, 5, 5, 5);
      chartObj.zoomControl.plusButton.background.fill = am4core.color(
        "#2E2E2E"
      );
      chartObj.zoomControl.plusButton.background.stroke = am4core.color(
        "#2E2E2E"
      );
      chartObj.zoomControl.plusButton.stroke = am4core.color("#ffffff");
      chartObj.zoomControl.plusButton.strokeWidth = 1;

      chartObj.zoomControl.minusButton.background.cornerRadius(5, 5, 5, 5);
      chartObj.zoomControl.minusButton.background.fill = am4core.color(
        "#2E2E2E"
      );
      chartObj.zoomControl.minusButton.stroke = am4core.color("#ffffff");
      chartObj.zoomControl.minusButton.background.stroke = am4core.color(
        "#2E2E2E"
      );
      chartObj.zoomControl.minusButton.strokeWidth = 1;

      chartObj.hideSeriesTooltipsOnSelection = true;

}