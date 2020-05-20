export const setChartEvents = (chart) => {
    let toggle = true;
    chart.seriesContainer.events.on(
      "dragstart",
      ev => {
        // for hiding tooltip
      // let chartObj = this.props.chartObj;
      //   chartObj.series.values[1].mapLines.values.forEach((inObj, index1) => {
      //     chartObj.series.values[1].mapLines.values[index1].lineObjects.values.forEach((inObj2, index2) => {
      //       chartObj.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.hide();
      //     });
      //   });
        let a = ev.target;
        toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
        toggle = !toggle;
      },
      this
    );
    chart.seriesContainer.events.on("destroy", () => {
      chart.clear();
    });
    chart.seriesContainer.events.on(
      "dragged",
      ev => {
        // for showing tooltip
        // let chartObj = this.props.chartObj;
        //   chartObj.series.values[1].mapLines.values.forEach((inObj, index1) => {
        //     chartObj.series.values[1].mapLines.values[index1].lineObjects.values.forEach((inObj2, index2) => {
        //       chartObj.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.show();
        //     });
        //   });
          toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
          toggle = !toggle;
        let a = ev.target;
      },
      this
    );
};