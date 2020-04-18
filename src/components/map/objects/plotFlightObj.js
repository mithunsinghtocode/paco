
import { lineObj } from './lineObj';
import { tooltipObj } from './tooltipObj';
import { mapObjectEvents } from "./events";
import { airplaneObj } from './airplaneObj';


export const plotFlightObj = (flight, lineSeries, dispatchFuncforAction, isMapObjectEvents, am4core, displayView) => {
    let line = lineObj(am4core, flight, lineSeries);

    // adds tooltip for the flights
    let bullet = tooltipObj(line, lineSeries, am4core, flight, displayView) ;

    if(isMapObjectEvents){
        // Adds click event on the tooltip, icon and line
        mapObjectEvents(bullet, line, lineSeries, flight, dispatchFuncforAction);    
    }
    
    // Adds the position of the airplane object with svg
    airplaneObj(am4core, bullet, flight);
  
}