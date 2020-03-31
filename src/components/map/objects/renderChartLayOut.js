import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodataWorldLow from "@amcharts/amcharts4-geodata/worldLow";

import { homeObjectRender } from "./homeObject";
import { zoomObjectRender } from "./zoomObject";
import { mapLayoutObj } from "./mapLayoutObj";

export const renderChartLayout = (chartObj) => {
    if (chartObj !== null) {
      // create mapLayout base and set countries and border
      mapLayoutObj(chartObj, am4core, am4maps, am4geodataWorldLow);

      // create a Zoom Object and Render in Map Chart
      zoomObjectRender(chartObj, am4maps, am4core);

      // render home object to default zoom
      homeObjectRender(chartObj, am4core);
    }
}