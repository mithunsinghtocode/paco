export const getTotalPaxCountForFlight = (flight, displayView) => {
          let totalPax = 0;
          switch(displayView){
                    case "INBOUND":
                              if(flight.arrStn === 'SIN'){
                                        flight.outboundFlt && flight.outboundFlt.forEach((outBoundFlight) => {
                                        outBoundFlight.status.misconnection && (totalPax = totalPax + sumPax(outBoundFlight.paxCountVo));
                                   });
                              }
                              else{
                                   totalPax = totalPax + sumPax(flight.paxCountVo);
                              }
                              break;
                    case "OUTBOUND":
                              if(flight.depStn === 'SIN'){
                                        flight.inboundFlt && flight.inboundFlt.forEach((inBoundFlight) => {
                                                  inBoundFlight.status.misconnection && (totalPax = totalPax + sumPax(inBoundFlight.paxCountVo));
                                        });
                                   }
                                   else{
                                        totalPax = totalPax + sumPax(flight.paxCountVo);
                                   }
                              break;
                    default:
                              break;
          }
          return totalPax;
};

const sumPax = (paxObj) => {
     //console.log(paxObj);
          return Number(paxObj.fclassCnt) + Number(paxObj.sclassCnt) + Number(paxObj.jclassCnt) + Number(paxObj.yclassCnt);
};

export const getTotalPaxCountBasedGroupByClassForFlight = (flight, displayView) => {
          let totFClass = 0;
          let totJClass = 0;
          let totSClass = 0;
          let totYClass = 0;

          switch(displayView){
               case "INBOUND":
                    flight.outboundFlt && flight.outboundFlt.forEach((outBoundFlight) => {
                         if(outBoundFlight.status.misconnection){
                              totFClass = sumPaxForClass(totFClass, outBoundFlight.paxCountVo.fclassCnt);
                              totJClass = sumPaxForClass(totJClass, outBoundFlight.paxCountVo.jclassCnt);
                              totSClass = sumPaxForClass(totSClass, outBoundFlight.paxCountVo.sclassCnt);
                              totYClass = sumPaxForClass(totYClass, outBoundFlight.paxCountVo.yclassCnt);
                         }
                    });
                    break;
               case "OUTBOUND":
                    break;
               default:
                    break;
          }

          return { totFClass, totJClass, totSClass, totYClass };
};

const sumPaxForClass = (cabinClassCount, currentPaxCountByCabinClass) => {
     return cabinClassCount + Number(currentPaxCountByCabinClass);
}