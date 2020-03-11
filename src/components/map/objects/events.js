export const mapObjectEvents = ( bullet, line, lineSeries ) => {
    bullet.tooltip.events.on(
        "hit",
        ev => {
          let a = ev.target;
          console.log(ev.target.flightData);
        },
        this
      );
      line.events.on(
        "hit",
        ev => {
          let a = ev.target;
          console.log(ev.target.flightData);
        },
        this
      );
      lineSeries.events.on(
        "hit",
        ev => {
          let a = ev.target;
          console.log(ev.target.flightData);
        },
        this
      );
  };