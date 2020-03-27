import React from "react";
import "./chart.scss";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodataWorldLow from "@amcharts/amcharts4-geodata/worldLow";
import { connect } from "react-redux";
import { initChart } from "../../actions/chartAction";
import PathFinder from "./PathFinder";
import { homeObjectRender } from "./objects/homeObject";
import { zoomObjectRender } from "./objects/zoomObject";
import { mapLayoutObj } from "./objects/mapLayoutObj";
import Loader from '../loader/Loader';

import SideMenu from "./SideMenu";

class MapChartLayer extends React.Component {
  componentDidMount() {
    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.seriesContainer.draggable = false;
    // Get the App Data for the Banner from Store
    this.props.initChart(chart);
  }

  renderChart = () => {
    let chartObj = this.props.chartObj;
    if (chartObj !== null) {
      // create mapLayout base and set countries and border
      mapLayoutObj(chartObj, am4core, am4maps, am4geodataWorldLow);

      // create a Zoom Object and Render in Map Chart
      zoomObjectRender(chartObj, am4maps, am4core);

      // render home object to default zoom
      homeObjectRender(chartObj, am4core);
    }
  };

  clearChartComponents(){
    let chartObj = this.props.chartObj;
    this.renderLoading();
    if(chartObj !== null && chartObj.series !== null){
      console.log(chartObj.series.length);
      while(chartObj.series.length !== 0){
      chartObj.series.values.forEach((inObj) => {
        console.log(inObj);
        chartObj.series.removeIndex(
          chartObj.series.indexOf(inObj)
        ).dispose();
      });
    }
      console.log(chartObj.series);
    }
  }

  renderLoading = () => {
     return <Loader loader="Map Loading..." />;
  }

  render() {
    return (
      <div>
        <SideMenu />
        {this.props.chartObj != null ? (this.props.chartObj.series == null ? this.renderLoading() : "") : ""}
        <div className="chartdiv"> {this.renderChart()}</div>
        {this.props.displayView === "INBOUND" && <div>{ this.clearChartComponents() } {this.renderChart()} <PathFinder chartObj={this.props.chartObj} /> </div>}
        {this.props.displayView === "OUTBOUND" && <div>{ this.clearChartComponents() } {this.renderChart()}  </div>}
        
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { chartObj: state.chartInit, displayView: state.getDisplayView };
};

export default connect(mapStateToProps, { initChart })(MapChartLayer);
