import React from "react";
import "./chart.scss";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodataWorldLow from "@amcharts/amcharts4-geodata/worldLow";

import SideMenu from './SideMenu';

class MapChartLayer extends React.Component {
  componentDidMount() {
    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    // Set map definition
    chart.geodata = am4geodataWorldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    //polygonSeries.opacity=0.1;

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    //polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#292929");
    polygonTemplate.strokeOpacity = 0.05;
    polygonTemplate.strokeFill = "#000000";

    // focus the ares of map
    // polygonTemplate.events.on("hit", function(ev) {
    //   ev.target.series.chart.zoomToMapObject(ev.target)
    // });

    // Remove Antarctica
    polygonSeries.exclude = ["AQ"];

    //chart.smallMap = new am4maps.SmallMap();
    //chart.smallMap.series.push(polygonSeries);

    // Zoom Slider
    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.align = "right";
    chart.zoomControl.valign = "top";
    chart.zoomControl.marginRight="10px"
    chart.zoomControl.marginTop="10px"
    chart.zoomControl.background.fill = am4core.color("#2E2E2E");
    chart.zoomControl.plusButton.background.cornerRadius(5, 5, 5, 5);
    chart.zoomControl.plusButton.background.fill = am4core.color("#2E2E2E");
    chart.zoomControl.plusButton.background.stroke =am4core.color("#2E2E2E");
    chart.zoomControl.plusButton.stroke = am4core.color("#ffffff");
    chart.zoomControl.plusButton.strokeWidth = 1;

    chart.zoomControl.minusButton.background.cornerRadius(5, 5, 5, 5);
    chart.zoomControl.minusButton.background.fill = am4core.color("#2E2E2E");
    chart.zoomControl.minusButton.stroke = am4core.color("#ffffff");
    chart.zoomControl.minusButton.background.stroke =am4core.color("#2E2E2E");
    chart.zoomControl.minusButton.strokeWidth = 1;

    chart.hideSeriesTooltipsOnSelection = true;

    // set initial zoom and map points
    chart.homeZoomLevel = 1.05;
    chart.homeGeoPoint = {
      latitude: 25,
      longitude: 10
    };
  }

  render() {
    return (
      <div>
       <SideMenu />         
        <div className="chartdiv"></div>
      </div>
    );
  }
}

export default MapChartLayer;
