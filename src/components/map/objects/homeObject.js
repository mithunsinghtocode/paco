export const homeObjectRender = ( chartObj, am4core ) => {

    let home = chartObj.chartContainer.createChild(am4core.Button);
    home.padding(10, 10, 10, 10);
    home.align = "right";
    home.valign = "top";
    home.marginRight = -30;
    home.marginTop = 90;
    home.background.fill = am4core.color("#2E2E2E");
      home.background.cornerRadius(5, 5, 5, 5);
      home.background.stroke = am4core.color(
        "#2E2E2E"
      );
      home.stroke = am4core.color("#ffffff");
      chartObj.zoomControl.plusButton.strokeWidth = 1;
    home.events.on("hit", function() {
      chartObj.goHome();
    });
    home.icon = new am4core.Sprite();
    home.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    home.icon.fill = am4core.color("#ffffff");

}