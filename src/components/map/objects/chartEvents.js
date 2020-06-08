export const setChartEvents = (chart) => {
    let toggle = true;
    let dragInertia = 0;   
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
          // better way of doing stuffs
            toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
            toggle = !toggle;

            // if(chart.deltaLongitude > 75 && chart.deltaLongitude < 180){
            //   //chart.deltaLongitude = 75;
            // }
            // if(chart.deltaLongitude > -180 && chart.deltaLongitude < -103){
            //   //chart.deltaLongitude = -103;
            // } 
            // better way of doing stuffs - but not satisfactory
          // requestAnimationFrame(() => {
          //   toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
          //   toggle = !toggle;
          // });
          // setTimeout(() => {
          //   if(chart.seriesContainer.isDragged){
          //     toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
          //   }else{
          //     if(dragInertia < 1) {
          //       toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
          //     }
          //     dragInertia += 1;
          //   }
          //   toggle = !toggle;
          // }, 50); 
          // dragInertia = 0;
      },
      this
    );
};