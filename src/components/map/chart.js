import React from "react";
import "./chart.scss";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodataWorldLow from "@amcharts/amcharts4-geodata/worldLow";
import { connect } from "react-redux";
import { initChart } from "../../actions/chartAction";
import PathFinder from './PathFinder';

import SideMenu from "./SideMenu";

class MapChartLayer extends React.Component {
  componentDidMount() {
    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Get the App Data for the Banner from Store
    this.props.initChart(chart);
  }

  renderChart = () => {
    let chartObj = this.props.chartObj;
    if (chartObj !== null) {
      //console.log(chartObj);

      chartObj.scrollbarX = new am4core.Scrollbar();
      chartObj.scrollbarX.parent = chartObj.bottomAxesContainer;

      // Set map definition
      chartObj.geodata = am4geodataWorldLow;

      // Set projection
      chartObj.projection = new am4maps.projections.Miller();

      // Create map polygon series
      let polygonSeries = chartObj.series.push(new am4maps.MapPolygonSeries());
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
      chartObj.zoomControl = new am4maps.ZoomControl();
      chartObj.zoomControl.align = "right";
      chartObj.zoomControl.valign = "top";
      chartObj.zoomControl.marginRight = "10px";
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

      // set initial zoom and map points
      chartObj.homeZoomLevel = 1.05;
      chartObj.homeGeoPoint = {
        latitude: 25,
        longitude: 10
      };

    var home = chartObj.chartContainer.createChild(am4core.Button);
    home.padding(10, 10, 10, 10);
    home.align = "right";
    home.valign = "top";
    home.marginRight = 10;
    home.marginTop = 90;
    home.background.fill = am4core.color("#2E2E2E");
      home.background.cornerRadius(5, 5, 5, 5);
      home.background.stroke = am4core.color(
        "#2E2E2E"
      );
      home.stroke = am4core.color("#ffffff");
      chartObj.zoomControl.plusButton.strokeWidth = 1;
    home.events.on("hit", function() {
      chartObj.goHome();
    });
    home.icon = new am4core.Sprite();
    home.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    home.icon.fill = am4core.color("#ffffff");

    }
  };

  render() {
    return (
      <div>
        <SideMenu />
        <div className="chartdiv"> {this.renderChart()}</div>
        <PathFinder chartObj = {this.props.chartObj}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  //console.log(state.chartInit);
  return { chartObj: state.chartInit };
};

export default connect(mapStateToProps, { initChart })(MapChartLayer);
