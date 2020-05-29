export const setChartEvents = (chart) => {
    let toggle = true;
    let dragInertia = 0;   
    chart.seriesContainer.events.on("destroy", () => {
      chart.clear();
    });
    chart.seriesContainer.events.on(
      "drag",
      ev => {
          // better way of doing stuffs
            toggle ? chart.zoomLevel = chart.zoomLevel + 0.0001 :  chart.zoomLevel = chart.zoomLevel - 0.0001;
            toggle = !toggle;


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
          // }, 0); 
          // dragInertia = 0;
      },
      this
    );
};