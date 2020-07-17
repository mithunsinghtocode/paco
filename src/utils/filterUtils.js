import {getCurrentTimeInUTC} from './dateUtils';

export const isDepNxt3Hrs = (flight, isTest, testTime) => {
          Date.prototype.addHours = function(h) {
                    this.setHours(this.getHours()+h);
                    return this;
                  }
                  return (new Date(flight.etd).getTime() <= (new Date(getCurrentTimeInUTC(isTest, testTime)).addHours(3).getTime()));
                  
}

export const isArrNxt3Hrs = (flight, isTest, testTime) => {
  Date.prototype.addHours = function(h) {
            this.setHours(this.getHours()+h);
            return this;
          }
          return (new Date(flight.etd).getTime() <= (new Date(getCurrentTimeInUTC(isTest, testTime)).addHours(3).getTime()));
          
}