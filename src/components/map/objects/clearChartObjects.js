export const clearChartComponents = (chartObj, objectsToBeCleared) => {
  if (chartObj !== null && chartObj.series !== null) {
    objectsToBeCleared.forEach( async objectToBeCleared => {
      if (objectToBeCleared === "ALL") {
        while (chartObj.series.length !== 0) {
          chartObj.series.values.forEach(( inObj, index) => {
            chartObj.series.removeIndex(index).dispose();
          });
        }
        //removeChart();
      }
      else{
          chartObj.series.values.forEach(inObj => {
            //console.log(inObj._className);
              inObj._className === objectToBeCleared ?  chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose() : console.log("Finding Object to be removed...") ;
            });
            chartObj.series.values.forEach(inObj => {
            //console.log(inObj._className);
              inObj._className === objectToBeCleared ?  chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose() : console.log("Finding Object to be removed...") ;
            });
      }
    });
  }
};

export const freeUpMemory = (...uselessObjInMemory) => {
  console.log("<><><><> Clearing Unused Objects...")
  uselessObjInMemory.forEach((obj) => {
    obj = null;
    obj = undefined;
  });
};
// const removeChart = () =>{
//   const myNode = document.getElementById("chartdiv");
//   if(myNode !=null) myNode.innerHTML = '';
// }

export const removeTooltip = (chart) => {

  chart.series.values[1].mapLines && chart.series.values[1].mapLines.values.forEach((inObj, index1) => {
            chart.series.values[1].mapLines.values[index1].lineObjects.values.forEach((inObj2, index2) => {
              chart.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.remove && chart.series.values[1].mapLines.values[index1].lineObjects.getIndex(index2).tooltip.remove();
            });
          });

  chart.series.values[1].remove && 
  chart.series.values[1].remove();
}