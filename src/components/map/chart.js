import React from "react";
import "./chart.scss";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodataWorldLow from "@amcharts/amcharts4-geodata/worldLow";
import { connect } from "react-redux";
import { initChart } from "../../actions/chartAction";
import InboundPathFinder from "./InboundPathFinder";
import OutboundPathFinder from "./OutboundPathFinder";
import { homeObjectRender } from "./objects/homeObject";
import { zoomObjectRender } from "./objects/zoomObject";
import { mapLayoutObj } from "./objects/mapLayoutObj";
import Loader from '../loader/Loader';
import FocusFlight from '../focusview/FocusFlight';
import FlightList from '../flightlist/FlightList';
import { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight } from '../../actions/chartDataAction';
import { freeUpMemory } from './objects/clearChartObjects';
import SideMenu from "./SideMenu";
import { setChartEvents } from '../map/objects/chartEvents';

class MapChartLayer extends React.PureComponent {
  componentDidMount() {
    // Create map instance
    am4core.options.queue = true;
    am4core.options.onlyShowOnViewport = true;
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    //chart.seriesContainer.draggable = false;
    chart.panBehavior = 'move';
    chart.chartContainer.wheelable = false;
    chart.paddingLeft = '0px';
    chart.paddingRight = '0px';
    chart.maxPanOut=0;
    // Get the App Data for the Banner from Store
    this.props.initChart(chart);
    
    setChartEvents(chart);

    freeUpMemory([chart]);
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
    freeUpMemory([chartObj]);
  };

  removeChart(){
    const myNode = document.getElementById("chartdiv");
    if(myNode !=null) myNode.innerHTML = '';
  }

  clearChartComponents(){
    let chartObj = this.props.chartObj;
    this.renderLoading();
    if(chartObj !== null && chartObj.series !== null){
      //console.log(chartObj.series.length);
      while(chartObj.series.length !== 0){
        chartObj.series.values.forEach((inObj) => {
          //console.log(inObj);
          chartObj.series.removeIndex(
            chartObj.series.indexOf(inObj)
          ).dispose();
        });
      }
      chartObj.deepInvalidate();
     this.removeChart();
    }
    freeUpMemory([chartObj]);
  }

  renderLoading = () => {
     return <Loader loader="Map Loading..." />;
  }

  render() {
    return (
      <>
        <SideMenu />
        {this.props.chartObj != null ? (this.props.chartObj.series == null ? this.renderLoading() : "") : ""}
        <div className="chartdiv"> {this.renderChart()}</div>
        {this.props.displayView === "INBOUND" && <>{ this.props.removeSelectedFlightFromMap(null)} {this.props.removeFocusViewForSelectedFlight(null)} { this.clearChartComponents() } {this.renderChart()} <InboundPathFinder chartObj={this.props.chartObj} /> < FocusFlight /> <FlightList /></>}
        {this.props.displayView === "OUTBOUND" && <>{ this.props.removeSelectedFlightFromMap(null)} {this.props.removeFocusViewForSelectedFlight(null)} {this.clearChartComponents() } {this.renderChart()} <OutboundPathFinder chartObj={this.props.chartObj} /> < FocusFlight /> <FlightList />  </>}
      </>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { chartObj: state.chartInit, displayView: state.getDisplayView };
};

export default connect(mapStateToProps, { removeSelectedFlightFromMap, removeFocusViewForSelectedFlight, initChart })(MapChartLayer);
