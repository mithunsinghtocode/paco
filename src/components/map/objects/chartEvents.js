import * as am4core from "@amcharts/amcharts4/core";
export const setChartEvents = (chart) => {
    let toggle = true;
    let dragInertia = 0;   
    chart.seriesContainer.events.on("destroy", () => {
      chart.clear();
    });
    var dropShadow1 = new am4core.DropShadowFilter();
    dropShadow1.dx = 0;
    dropShadow1.dy = 0;
    dropShadow1.blur = 6;
    dropShadow1.color = am4core.color("red");
    // chart.seriesContainer.events.on(
    //   "ready",
    //   ev => {
    //     chart.series.values[1] && chart.series.values[1].mapLines && chart.series.values[1].mapLines.values.forEach((inObj, index1) => {
    //       chart.series.values[1].mapLines.values[index1].lineObjects.values.forEach((inObj2, index2) => {
    //         let currentTooltip = chart.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip;
    //         currentTooltip.filters.push(dropShadow1);
    //         chart.series.values[1].mapLines.values.forEach((inObj, index3) =>{
    //           let iterationTooltip = chart.series.values[1].mapLines.values[index3].lineObjects.getIndex(index2).tooltip;
    //           if(currentTooltip.flightId.trim() !== iterationTooltip.flightId.trim()){
    //             let measure = currentTooltip.pixelX+currentTooltip.measuredWidth;
    //               if(currentTooltip.hitTest(iterationTooltip)){
    //                 // console.log("iterationTooltip ::" +iterationTooltip.relativeX);
    //                 // console.log("currentTooltip ::" +currentTooltip.relativeX);
    //                 // console.log("measure ::" +measure);
    //                 // console.log("currentTooltip ::" +currentTooltip.flightId);
    //                 // console.log("iterationTooltip ::" +iterationTooltip.flightId);
    //                 // console.log("currentTooltip.hitTest(iterationTooltip) :: "+currentTooltip.hitTest(iterationTooltip))
    //                 currentTooltip.hitTest(iterationTooltip) && currentTooltip.filters.push(dropShadow1);
    //                 return false;
    //               }
    //             }
    //         });
    //       });
    //     });
    //   });
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