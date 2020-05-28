export const mapObjectEvents = ( bullet, line, lineSeries, flight, dispatchFunc, dispatchFunc2 ) => {
    bullet.tooltip.events.on(
        "hit",
        ev => {
          let a = ev.target;
          dispatchFunc(flight);
          dispatchFunc2 && dispatchFunc2(flight);
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