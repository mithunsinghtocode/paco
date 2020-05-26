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
