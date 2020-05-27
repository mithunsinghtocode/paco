export const setChartEvents = (chart) => {
    let toggle = true;
   
    chart.seriesContainer.events.on("destroy", () => {
      chart.clear();
    });
    chart.seriesContainer.events.on(
      "drag",
      ev => {
        // for showing tooltip
          // chart.series.values[1].mapLines.values.forEach((inObj, index1) => {
          //   chart.series.values[1].mapLines.values[index1].lineObjects.values.forEach((inObj2, index2) => {
          //     chart.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.hide();
          //     chart.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.show();
          //   });
          // });
          toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
          toggle = !toggle;
        let a = ev.target;
      },
      this
    );
};