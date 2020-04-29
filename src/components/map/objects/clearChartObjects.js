export const clearChartComponents = (chartObj, objectsToBeCleared) => {
  if (chartObj !== null && chartObj.series !== null) {
    objectsToBeCleared.forEach( objectToBeCleared => {
      if (objectToBeCleared === "ALL") {
        while (chartObj.series.length !== 0) {
          chartObj.series.values.forEach(inObj => {
            console.log(inObj);
            chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose();
          });
        }
        //removeChart();
      }
      else{
          chartObj.series.values.forEach(inObj => {
            console.log(inObj._className);
              inObj._className === objectToBeCleared ?  chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose() : console.log("Finding Object to be removed...") ;
            });
            chartObj.series.values.forEach(inObj => {
            console.log(inObj._className);
              inObj._className === objectToBeCleared ?  chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose() : console.log("Finding Object to be removed...") ;
            });
      }
    })
  }
};

const removeChart = () =>{
  const myNode = document.getElementById("chartdiv");
  if(myNode !=null) myNode.innerHTML = '';
}
