export const isDepNxt3Hrs = (flight) => {
          Date.prototype.addHours = function(h) {
                    this.setHours(this.getHours()+h);
                    return this;
                  }
                  return (new Date(flight.etd).getTime() < (new Date().addHours(-5).getTime()));
}