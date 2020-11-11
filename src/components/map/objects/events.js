export const mapObjectEvents = ( bullet, line, lineSeries, flight, dispatchFunc, dispatchFunc2, dispatchFunc3 ) => {
    bullet.tooltip.events.on(
        "hit",
        ev => {
          let a = ev.target;
          dispatchFunc(flight);
          dispatchFunc2 && dispatchFunc2(flight);
          dispatchFunc3 && dispatchFunc3(true);
        },
        this
      );
      // commented as the events to be only on tooltip
      // line.events.on(
      //   "hit",
      //   ev => {
      //     let a = ev.target;
      //     dispatchFunc(flight);
      //     dispatchFunc2 && dispatchFunc2(flight);
      //   },
      //   this
      // );
      // lineSeries.mapLines.events.on(
      //   "hit",
      //   ev => {
      //     let a = ev.target;
      //     dispatchFunc(flight);
      //     dispatchFunc2 && dispatchFunc2(flight);
      //   },
      //   this
      // );
  };