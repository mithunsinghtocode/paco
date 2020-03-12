export const mapObjectEvents = ( bullet, line, lineSeries, flight, dispatchFunc ) => {
    bullet.tooltip.events.on(
        "hit",
        ev => {
          let a = ev.target;
          dispatchFunc(flight);
        },
        this
      );
      line.events.on(
        "hit",
        ev => {
          let a = ev.target;
          dispatchFunc(flight);
        },
        this
      );
      lineSeries.events.on(
        "hit",
        ev => {
          let a = ev.target;
          dispatchFunc(flight);
        },
        this
      );
  };