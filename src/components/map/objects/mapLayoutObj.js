export const mapLayoutObj = (chartObj, am4core, am4maps, am4geodataWorldLow ) => {

    chartObj.scrollbarX = new am4core.Scrollbar();
    chartObj.scrollbarX.parent = chartObj.bottomAxesContainer;

    // Set map definition
    chartObj.geodata = am4geodataWorldLow;

    // Set projection
    chartObj.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chartObj.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.opacity=1;

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.calculateVisualCenter = true;
    //polygonSeries.mapPolygons.template.tooltipPosition = "fixed";

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    //polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#292929");
    polygonTemplate.strokeOpacity = 0.15;
    polygonTemplate.stroke = am4core.color("#000");

    // focus the ares of map
    //  polygonTemplate.events.on("hit", function(ev) {
    //    ev.target.series.chart.zoomToMapObject(ev.target)
    //  });

    // Remove Antarctica
    polygonSeries.exclude = ["AQ"];

    //chart.smallMap = new am4maps.SmallMap();
    //chart.smallMap.series.push(polygonSeries);

    // var slider = chartObj.chartContainer.createChild(am4core.Slider);
    // slider.start = 0.5;
    // slider.margin(0,0,20,0);
    // slider.valign = "bottom";
    // slider.align = "center";
    // slider.width = 500;
    // slider.events.on("rangechanged", ()=>{
    //     chartObj.deltaLongitude = slider.start * 360 - 180;
    // });
}