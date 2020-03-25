export const clearChartComponents = (chartObj, ObjectToBeCleared) => {
  if (chartObj !== null && chartObj.series !== null) {
    if (ObjectToBeCleared === "ALL") {
      while (chartObj.series.length !== 0) {
        chartObj.series.values.forEach(inObj => {
          console.log(inObj);
          chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose();
        });
      }
    }else{
        chartObj.series.values.forEach(inObj => {
            inObj._className === ObjectToBeCleared ?  chartObj.series.removeIndex(chartObj.series.indexOf(inObj)).dispose() : "Finding Object to be removed..." ;
          });
    }
  }
};
