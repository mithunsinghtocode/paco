export const airplaneObj = ( am4core, bullet, flight ) => {
  let planeObj = bullet.createChild(am4core.Sprite);
  planeObj.scale = 0.1;
  planeObj.path =
    "m2,-30h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
    planeObj.fill = am4core.color(flight.config.airplanecolor);
    planeObj.strokeOpacity = 0;
  return planeObj;
};
