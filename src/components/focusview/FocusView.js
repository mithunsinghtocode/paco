import React from "react";
import "./focusView.scss";
import { connect } from "react-redux";
import {
  showFocusViewForSelectedFlight,
  removeFocusViewForSelectedFlight,
  getFlightDataForOutBound
  ,switchFlightsViewByInBoundOrOutbound,
  showSelectedFlightInMap, userClick
} from "../../actions/chartDataAction";
import {  getHoursAndMinutesAfterFormat, getMock2hTimeFromDateTime,convertMillisecondsToHoursAndMinutesAfterFormat } from "../../utils/dateUtils";
import { sort } from "../../utils/sortUtils";

var scrollHeight = 0;
let MAX_HEIGHT = 86;
let MIN_HEIGHT = 50;
const TRANSITION_MULTIPLIER=1.4;
const SINGLE_RECORD = 12;
let inboundFlightListlen = 0;

class FocusView extends React.PureComponent {
  off = () => {
    this.props.removeFocusViewForSelectedFlight(null);
  };

  getBayGateTerminalDetailsOutbound = selectedFlight => {
    return selectedFlight.depBayGateNo !== null
      ? `${selectedFlight.depTerminal} / ${selectedFlight.depBayGateNo}`
      : "-";
  };
  getBayGateTerminalDetailsInbound = selectedFlight => {
    return selectedFlight.arrTerminal !== null && selectedFlight.arrBayGateNo !== null
      ? `${selectedFlight.arrTerminal} / ${selectedFlight.arrBayGateNo}`
      :  selectedFlight.arrTerminal !== null ? `${selectedFlight.arrTerminal} / –` : "–/–";
  };

  getFormattedFltNum = (fltNum) => `${fltNum.substr(0,2)} ${fltNum.substr(2,5)}`;

  getPaxDetailsFormat = (selectedFlight) => {
      let resultComponent = [];
      resultComponent.push(this.frameCabinClass('F', selectedFlight.paxCountVo.fclassCnt));
      resultComponent.push(this.frameCabinClass('J', selectedFlight.paxCountVo.jclassCnt));
      resultComponent.push(this.frameCabinClass('S', selectedFlight.paxCountVo.sclassCnt));
      resultComponent.push(this.frameCabinClass('Y', selectedFlight.paxCountVo.yclassCnt));
      return resultComponent;
  }
  frameCabinClass = (cabinClass, count) =>  {    
      let res = [];
      let cabinClassFormatted = <b style={{fontFamily: "Proxima Nova Semibold", fontWeight:"900", letterSpacing:"2px" }}>{cabinClass}</b>;
      let countFormatted = <b style={{fontFamily: "Proxima Nova Thin"}}>{count}</b>;        
      res.push('   ')
      res.push(cabinClassFormatted);
      res.push(countFormatted);
      return res;
  }  
  getPaxDetailsFormatConnectingInbound = (selectedFlight) => {
    let resultComponent = [];
    resultComponent.push(this.frameCabinClassConnectingInbound('F', selectedFlight.paxCountVo.fclassCnt));
    resultComponent.push(this.frameCabinClassConnectingInbound('J', selectedFlight.paxCountVo.jclassCnt));
    resultComponent.push(this.frameCabinClassConnectingInbound('S', selectedFlight.paxCountVo.sclassCnt));
    resultComponent.push(this.frameCabinClassConnectingInbound('Y', selectedFlight.paxCountVo.yclassCnt));
    return resultComponent;
}
frameCabinClassConnectingInbound = (cabinClass, count) =>  {    
    let res = [];
    let cabinClassFormatted = <b style={{fontFamily: "Proxima Nova Semibold", fontWeight:"900", letterSpacing:"4px", marginLeft:"2px" }}>{cabinClass}</b>;
    let countFormatted = <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900", letterSpacing:"1px"}}>{count}</b>;            
    if(cabinClass==='Y'){
      console.log('hello');
      countFormatted = <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900"}}>{count}</b>;            
    }
    res.push('   ')
    res.push(cabinClassFormatted);
    res.push(countFormatted);
    return res;
}  
  
setHeight = () => {
  let totLen = document.body.clientHeight;  
  let paneLen = 16+8 + document.getElementById("focusview-main-card").offsetHeight 
              + document.getElementById("focusview-secondary-inbound-card").offsetHeight;    

  let len = paneLen < (totLen-133) ? 100*Number( ( (paneLen)/(totLen) ).toFixed(2) ) : 100*Number( ( (totLen-133)/(totLen) ).toFixed(2) ) ;
  console.log("### setHeight() len =>" + len);
  return this.props.selectedFlightObj && ( len +".25%");    
};
setPaneHeight = () => {
  console.log("#### setPaneHeight() inboundFlightListlen = " + inboundFlightListlen);
  let totLen = document.body.clientHeight; 
  // let paneLen = inboundFlightListlen>0 ?( 646+42 + (81+7)*(inboundFlightListlen-1) ) : (646+42 + 45) ; // comment temporary
  let paneLen = inboundFlightListlen>0 ?( 646+42 + 81+7 ) : (646 + 42 + 45) ;
  paneLen = paneLen < (totLen-133) ? Number((paneLen/totLen).toFixed(2))  : Number(((totLen-133)/totLen).toFixed(2)) ;
  paneLen = 100*paneLen;
  console.log("#### setPaneHeight() paneLen = " + paneLen);
  return paneLen+"%";
};
shrink = () => {
   document.getElementById("down-arrow-focusview").style.display = "none";
   document.getElementById("up-arrow-focusview").style.display = "block";
   document.getElementById("legend-focusview").scrollTop = 1;   
   document.getElementById("legend-focusview").style.height= "76px";   

   console.log("######## shrink() new H ==>" + document.getElementById("legend-focusview").style.height );
   console.log("\n");
};

expand = () => {
  let downArrow = document.getElementById("down-arrow-focusview");
  downArrow.style.display = "block"; 
  document.getElementById("legend-focusview").style.height = this.setHeight();   
  document.getElementById("up-arrow-focusview").style.display = "none";
};

showAvailFlightsInThreeHour = () => {
  let availFlightsInThreeHourToggle = document.getElementById("switch1").checked;

  console.log("availFlightsInThreeHourToggle :: "+availFlightsInThreeHourToggle);

  if(availFlightsInThreeHourToggle){
    // let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
    //   if(flight.status === null){
    //     return false;
    //   }else{
    //     Date.prototype.addHours = function(h) {
    //       this.setHours(this.getHours()+h);
    //       return this;
    //     }
    //     return (new Date(flight.std).getTime() < (new Date().addHours(-5)));
    //   }
    //   });
      //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);
      // clearChartComponents(this.props.chartObj, ["ALL"]);
      // renderChartLayout(this.props.chartObj);
      // this.props.getFlightDataForOutBound(flightList);
  } else{
    //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);
    // clearChartComponents(this.props.chartObj, ["ALL"]);
    // renderChartLayout(this.props.chartObj);

    // this.props.getFlightDataForOutBound(flightData);
  }

  Date.prototype.addHours = function(h) {
    this.setHours(this.getHours()+h);
    return this;
  }

}
setScrollStyle = (overflowVal, heightVal) => {
  document.getElementById("legend-focusview").style.overflow = overflowVal;
  document.getElementById("legend-focusview").style.height= heightVal;
  // console.log("##### heightVal =>" + heightVal);
}
adjustHeight = async (e) => {

  // if( this.props.selectedFlightObj ){
  //   console.log("######### before setHeight()  ############"  );
  //   document.getElementById("legend-focusview").style.height = this.setHeight();   
  // }  
  
  let totLen = document.body.clientHeight;  
  let paneLen = 16+8 + document.getElementById("focusview-main-card").offsetHeight 
              + document.getElementById("focusview-secondary-inbound-card").offsetHeight;

  let maxHeight = paneLen < (totLen-133) ? Number((paneLen/totLen).toFixed(2))  : Number(((totLen-133)/totLen).toFixed(2)) ;
  maxHeight = maxHeight*100;
  MAX_HEIGHT = MAX_HEIGHT>maxHeight ? maxHeight : MAX_HEIGHT;

  MIN_HEIGHT = paneLen < (totLen-133) ? Number((paneLen/totLen).toFixed(2))  : Number(((totLen-133)/totLen).toFixed(2)) ;
  MIN_HEIGHT = MIN_HEIGHT*100;

  // console.log("##### MAX_HEIGHT =>" + MAX_HEIGHT);
  // console.log("##### MIN_HEIGHT =>" + MIN_HEIGHT);

  let y = e.deltaY;
  var element = document.querySelector("#legend-focusview");
  var st = element.scrollTop;
  // console.log("##### st before if : " + st );
  if(y){
      var currHeight = Number(document.getElementById("legend-focusview").style.height.replace('%',''));     
      // console.log("\n##### MAX_HEIGHT =>" + MAX_HEIGHT);
      // console.log("##### MIN_HEIGHT =>" + MIN_HEIGHT);
      // console.log("##### currHeight =>" + currHeight);

      // console.log("##### y / st  =>" + y + " / " + st );
      if(y>=0 && st >=0){
              if(currHeight >= 0 && currHeight < MAX_HEIGHT) {
                  document.getElementById("down-arrow-focusview").style.display = "block";
                  document.getElementById("up-arrow-focusview").style.display = "none";
                  let tempH = MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER ;
                  tempH = MAX_HEIGHT>tempH ? tempH : MAX_HEIGHT;
                  this.setScrollStyle('hidden', tempH  +'.25%');
                  // this.setScrollStyle('hidden', MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER  +'.25%');
                  scrollHeight+=1;
                  // console.log("##### 111111111 =>\n" );
              }
              if(currHeight >= MAX_HEIGHT){ 
                  // this.setScrollStyle('auto', MAX_HEIGHT +'.25%');
                  this.setScrollStyle('auto', MAX_HEIGHT +'.25%');
                  // element.over
                  // console.log("##### 222222222 =>\n" );
              }
      }else{
          if(currHeight > MIN_HEIGHT && st <=1){
                // console.log("##### 333333333 =>\n" );
                let tempH = MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER ;                
                tempH = MIN_HEIGHT<tempH ? tempH : MIN_HEIGHT;
                this.setScrollStyle('hidden', tempH  +'.25%');
                // this.setScrollStyle('hidden', MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER  +'.25%');
                scrollHeight-=1;
          }
          if(currHeight <= MIN_HEIGHT){
              // console.log("##### 44444444 =>\n" );
              this.setScrollStyle('auto', MIN_HEIGHT +'.25%');
          }
      }
  }       
};

  renderSelectedFlightFocusViewPopup = () => {

    let selectedFlight = this.props.selectedFlightObj;
    // if (selectedFlight !== null) {
    //   console.log(selectedFlight);

    let groundTimeVal = 2*60*60*1000;
    let groundTime = convertMillisecondsToHoursAndMinutesAfterFormat( groundTimeVal ) ;
    let mgtVal =  1.5*60*60*1000;
    let mgt =  convertMillisecondsToHoursAndMinutesAfterFormat( mgtVal ) ;
      
      return ( 
        <div className="legend-focusview" id="legend-focusview" onWheel={this.adjustHeight} onScroll={this.adjustHeight} 
            style={{height:this.setPaneHeight()}}
            >
          <div className="card text-white mb-3" id="focusview-main-card">              
            <div className="card-header" style={{ background: '#0483F8' }}>{this.getFormattedFltNum(selectedFlight.fltNum)}</div>                      

            <div className="card-body" >
              <div className="row dimmed" style={{marginTop:"8px"}}>
                <div className="col-2 col-md-3">STD</div>
                <div className="col-1 col-md-3">GATE</div>
                <div className="col-3 col-md-5">BOOKED</div>
              </div>

              <div className="row value">
                <div className="col-2 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                  {getHoursAndMinutesAfterFormat(selectedFlight.std)}
                </div>
                <div className="col-1 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                  {this.getBayGateTerminalDetailsOutbound(selectedFlight)}
                </div>
                <div className="col-3 col-md-5">
                  {this.getPaxDetailsFormat( this.getFullPaxDetailsOfMatchingOutboundFlgiht(selectedFlight, this.props.outboundFlights.flightList) )}
                </div>
              </div>

              <div className="row arrival dimmed">
                <div className="col-2 col-md-3">STA</div>
                <div className="col-1 col-md-3">ETA</div>
                <div className="col-3 col-md-5">AVAIL. FLIGHTS IN 3 HRS</div>
              </div>

              <div className="row value" style={{ fontSize: "21px" }}>
                <div className="col-2 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                  {getHoursAndMinutesAfterFormat(selectedFlight.sta)}
                </div>
                <div className="col-1 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                  {getHoursAndMinutesAfterFormat(selectedFlight.eta)}
                </div>
                <div className="col-3 col-md-5"
                    style={{ fontFamily: "Proxima Nova Regular" }}
                  // style={{ fontSize: "21px", marginTop: "6px", fontFamily: "Proxima Nova Regular" }}
                >
                  <div className="switch__label__text"> 4 Flights &nbsp; </div>   
                  <div className="switch">         
                    <label htmlFor="switch1" className="switch__label">                    
                    </label>
                    <input type="checkbox" id="switch1" className="switch__input"  onClick={ this.showAvailFlightsInThreeHour } />
                  </div>

                </div>
              </div>

              {/* <hr className="divider-line" style={{ borderTop: "1px solid #9b9696" }} /> */}
              <hr className="divider-line" style={{ borderTop: "1px solid #9b9696", opacity: "0.3"}} />

              <div className="row option  dimmed">              
                <div className="col">NOTES</div>                            
              </div>

              <div className="card-body notes">  
                  <div style={{height:"37px", margin:" 0px 0px 0px 0px", paddingTop: "8px"}}>
                    <span className="dot"></span> 
                    &nbsp;&nbsp;
                    <cust className="notes-text"
                    // style={{ color:"#ece6e6",fontSize: "12px",marginTop:"15px"}}
                    style={{ color:"#FFFFFF",fontSize: "14px",marginTop:"0px", fontFamily:"Proxima Nova", letterSpacing:"-0.18px"}}
                    >Australian Prime Minister</cust>
                  </div>
              </div>
{/*
              <div className="row option">
                
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-block cost"
                    style={{ backgroundColor: "Transparent" }}
                  >
                    <br />
                    <i>Coming Soon</i>
                    <br />
                    <br />
                  </button>
                </div>
              </div>
*/}
              <hr className="divider-line" style={{ borderTop: "1px solid #9b9696", opacity: "0.3" }} />

              <div className="row option  dimmed" style={{ marginTop:"30px"}}>
                <div className="col cost-based-delay-opt">COST BASED DELAY OPTIONS</div>
              </div>
{/*}
              <div className="row option">
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-block cost"
                    style={{ backgroundColor: "Transparent" }}
                  >
                    <br />
                    <i>Coming Soon</i>
                    <br />
                    <br />
                  </button>
                </div>
              </div>
*/}
              {/* <div className="row margin-high"></div> */}

              
  {/*  */}
              <div className="row option">
                <div className="col-6 first-col">
                    <button type="button" 
                      className="btn btn-block cost"
                      // className="btn btn-primary btn-block"
                    >
                      <bigfont className="big-font"> 0 min </bigfont> 
                    <br/> 
                    <smallfont className="small-font">21,768.00 SGD</smallfont>
                  </button>
                </div>
                <div className="col-6">
                    <button type="button" 
                        className="btn btn-primary btn-block"
                        // className="btn btn-block cost"
                      > 
                      <bigfont className="big-font"> +30 min </bigfont> 
                        <br/> 
                      <smallfont className="small-font">61,742.00 SGD </smallfont>
                    </button>
                </div>
              </div>
        
              <div className="row margin-high">
                <button type="button" className="btn btn-block details" 
                  // style={{ width: "96%" }}
                >
                      <medfont className="show-cost-calc"> SHOW COST CALCULATION </medfont> 
                </button>
              </div>

  {/*  */}


              <hr className="divider-line"
                style={{ borderTop: "1px solid #9b9696", marginTop: "25px", opacity: "0.3" }}
              />
{/* 
            <div className="row arrival dimmed">
                <div className="col">RETURN</div>
                <div className="col">STD</div>
                <div className="col">GROUND TIME / MGT</div>
                <div className="col">
                  <h6>
                    <span className="badge badge-danger">AGT</span>
                  </h6>
                </div> 
              </div> */}

              <div className="row arrival dimmed">
                <div className="col-2 col-md-3 ">RETURN</div>
                <div className="col-1 col-md-3 ">STD</div>
                <div className="col-3 col-md-5 ground-time-mgt "
                  style={{ background :  groundTimeVal < mgtVal ? 'red' : ''}}
                 >GROUND TIME / MGT</div>
              </div>
{/* 
              <div className="row value med-level-up-font">
                <div className="col">SQ 529</div>
                  <div className="col">23:15</div>
                  <div className="col">1:00h</div>
                  {/* <div className="col">0:50h</div> */}
                {/* <center style={{ fontSize: "14px", marginLeft: "35%" }}>
                  {" "}
                  <i>coming soon</i>
                </center> * /}
              </div>  */}
            
              <div className="row value med-level-up-font">                  
                  <div className="col-2 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                    {this.getFormattedFltNum( 'SQXXX' )}
                  </div>
                  <div className="col-1 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                    {selectedFlight.eta!==null && selectedFlight.eta!==undefined? getHoursAndMinutesAfterFormat( getMock2hTimeFromDateTime(selectedFlight.eta, 2) ) : 
                      getHoursAndMinutesAfterFormat( getMock2hTimeFromDateTime(selectedFlight.sta, 2) )}
                    
                  </div>
                  <div className="col-3 col-md-5"
                      style={{ fontFamily: "Proxima Nova Regular" }} >
                      {groundTime}h / {mgt}h
                  </div>
              </div>
              

            </div>
          
          </div>

          <div className="card text-white mb-3" id="focusview-secondary-inbound-card">
          {/* <div className="card-footer"> */}
                
            <div className="card-body" >            

              <div className="row inbound" >
                  <div className="col">
                    {/* &nbsp;&nbsp; */}
                    INBOUND FLIGHTS
                  </div>
              </div>
            
            {/* // Temporary commented: */}
              {/* { this.props.selectedFlightObj !== null ? 
                  this.renderInboundFlightList(this.props.inboundFlights.flightList, this.props.selectedFlightObj) : 
                      this.props.inboundFlights && this.renderInboundFlightList(this.props.inboundFlights.flightList)  
              } */}
                {this.props.outboundFlights && this.renderInboundFlightList(this.props.outboundFlights.flightList, this.props.selectedFlightObj) }
            </div>
          </div>
        </div>


      );
    // }       
  }
  
  getDelayInMin = (flightObj, isInbound) => {
    let dif = isInbound ? 
      (new Date(flightObj.eta).getTime() - ((flightObj.rta !== undefined && flightObj.rta !== null) ? new Date(flightObj.rta).getTime() : new Date(flightObj.sta).getTime()))
    : (new Date(flightObj.etd).getTime() - ((flightObj.rtd !== undefined && flightObj.rtd !== null) ? new Date(flightObj.rtd).getTime() : new Date(flightObj.std).getTime()));
    //console.log(dif);
    if(dif !== NaN && dif >= 0){
        return  `${Math.round((dif/1000)/60)}`; 
    }
  }
  getMCTInMin = (inboundFlight, outboundFlight) => {
    let dif = outboundFlight.etd!==null && outboundFlight.etd !== undefined && inboundFlight.eta!==null && inboundFlight.eta !== undefined ? 
              ( new Date(outboundFlight.etd).getTime() - new Date(inboundFlight.eta).getTime() ) : 
              ( outboundFlight.std!==null && outboundFlight.std !== undefined && inboundFlight.eta!==null && inboundFlight.eta !== undefined ? 
                ( new Date(outboundFlight.std).getTime() - new Date(inboundFlight.eta).getTime() ) : ( new Date(outboundFlight.std).getTime() - new Date(inboundFlight.sta).getTime() )   
              ) ;
              
    //console.log(dif);
    if(dif !== NaN ){
      return  `${Math.round((dif/1000)/60)}`; 
    }
  }
  setHighlightedFlight = (highlightFlight, flightObj) => {
    if(highlightFlight) return highlightFlight.flightId === flightObj.flightId ? true : false;
    return true;
  }
  getClassName = (flightObj) => flightObj.status.misconnection ? '#E55541' : '#87C039'  ;

  getFullPaxDetailsOfMatchingOutboundFlgiht = (focusedFlight, outboundFlights) => {
      let matchingOutboundFlight = outboundFlights.filter(flight => flight.flightId===focusedFlight.flightId);
      return (matchingOutboundFlight!==null && matchingOutboundFlight!==undefined && matchingOutboundFlight.length>0) ?  matchingOutboundFlight[0] : focusedFlight;
  }
  renderInboundFlightList = (outboundFlightList, highlightFlight) => {

    // let flightMisconnectionList = outboundFlightList.filter(flight => flight.status.misconnection);
    let outboundFlightListVar = outboundFlightList.filter(flight => flight.flightId===highlightFlight.flightId);
    let outboundFlight = (outboundFlightListVar!==null && outboundFlightListVar!==undefined && outboundFlightListVar.length>0)?outboundFlightListVar[0]:'';

    let missconnectedInboundsOfFocusedOutbound = outboundFlight.inboundFlt.filter( inboundFlight => inboundFlight.status.misconnection===true );
    let misconxCount =  missconnectedInboundsOfFocusedOutbound.length;
    inboundFlightListlen = misconxCount;

    console.log("#### inboundFlightListlen = " + inboundFlightListlen);
    return missconnectedInboundsOfFocusedOutbound.map((flightObj, index) => {
        return(
            flightObj && 
           
            <div className="card text-white mb-1"  
                  key={ flightObj.flightId } value={ flightObj.flightId } 
                        // onClick={ (e) => this.props.showSelectedFlightInMap(flightObj)} 
                style= {{marginTop: misconxCount===index ? '32px' : '7px'}}>                
                  
                    <div className="card-header inbound" style={{ background:  flightObj.status.misconnection ? '#E55541' : '#87C039', borderRadius: "7px 7px 0px 0px" }}>
                        <div className="flight-num-inbound" style={{ display: "inline-block" }}>{this.getFormattedFltNum(flightObj.fltNum)}</div>  
                        <div className="cabin-class-inbound" style={{ display: "inline-block" }}>{this.getPaxDetailsFormatConnectingInbound(flightObj)}</div>                                       
                    </div>

                    <div className="card-body inbound">
                        <div className="flight-details-inbound" style={{ display: "inline-block", fontSize:"14px" }}> 
                             <b style={{ marginRight: "5px", fontFamily: "Proxima Nova Semibold", fontWeight:"900"  }}>ETA</b> 
                              <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                  {getHoursAndMinutesAfterFormat(flightObj.eta)} 
                              </b>                                                      
                              <b style={{ display: "inline-block", marginLeft: "13px", opacity:"0.3" }} className="line">
                              </b> 
                              <b style={{ marginLeft: "29px", marginRight: "5px", fontFamily: "Proxima Nova Semibold", fontWeight:"900" }}>MCT</b> 
                              <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { this.getMCTInMin(flightObj,highlightFlight )  + " min" }
                              </b>
                         </div>  
                         <div className="flight-gate-inbound" style={{ display: "inline-block" }}> 
                              {this.getBayGateTerminalDetailsInbound(flightObj)}
                         </div>
                    </div>
            </div>   
       )
    });
  }

  getFlightBasedOnFlightIdFromOutbound() {
    return this.props.outboundFlights && this.props.outboundFlights.flightList.filter((flight) => {
      return flight.flightId === this.props.selectedFlightObj.flightId;
    });
  }
  setTheOutboundViewForSelectedFlight(selectedFlight){
    this.props.userClick(false);
    this.props.showSelectedFlightInMap(selectedFlight);
    // this.props.fltToDisplayInMap(this.props.fltToDisplayInMap);
    this.props.switchFlightsViewByInBoundOrOutbound("OUTBOUND") ;
    let inboundButton = document.getElementById('INBOUND');
    let outboundButton = document.getElementById('OUTBOUND');
    inboundButton.style.borderRight = "0px";
    outboundButton.style.borderRight = "4px solid #00DC88";
  }
  renderSelectedFlightInFocusView = () => {
    
    // let selectedFlight = this.props.selectedFlightObj;

    // console.log('############ props type ->' + typeof(this.props));
    // console.log('############ props  ->' + JSON.stringify(this.props) );
    // console.log('############ props.flightData  ->' + JSON.stringify(this.props.flightData) );
    if (this.props.selectedFlightObj !== null) {
      
      console.log(this.props.selectedFlightObj);      

      let selectedFlightList = this.getFlightBasedOnFlightIdFromOutbound();      
      // console.log("##### debug 1 : ");
      // console.log(selectedFlightList.length );
      if(selectedFlightList.length>0){
        let selectedFlight = selectedFlightList[0];      
        this.setTheOutboundViewForSelectedFlight(selectedFlight);
      }
      

      return (
        // <div id="showHide">
        selectedFlightList.length>0 &&
        this.props.selectedFlightObj !== null &&
        <div>
        

          {/* <div className="overlay" id="legend" onWheel={this.adjustHeight} onScroll={this.adjustHeight}>         */}
              {this.renderSelectedFlightFocusViewPopup()}                                       
          {/* </div> */}

          {/* <div className="overlay-arrow">
            <i
              className="big arrow alternate circle down outline icon"
              onClick={this.off}
              style={{ color: "#fff" }}
            ></i>
          </div> */}

          {/* {this.props.selectedFlightObj!==null && this.setHeight()} */}

            
          <div className="overlay-arrow">
                    <button className="rectangle-down-arrow" id="down-arrow-focusview" style={{ color: "#fff" }} onClick={this.shrink}> 
                    <svg width="14px" height="14px">
                        <title>FA330ECD-E438-49D6-AEB5-DD2670AE9D78</title>
                        <desc>Created with sketchtool.</desc>
                        <g id="Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="120-Selected-Critical-Flight" transform="translate(-43.000000, -91.000000)" fill="#FFFFFF" fillRule="nonzero">
                                <g id="Button-/-Back" transform="translate(34.000000, 78.000000)">
                                    <g id="Group-4">
                                        <polygon id="Shape" transform="translate(16.000000, 20.000000) scale(-1, 1) translate(-16.000000, -20.000000) " points="16 13 14.76625 14.23375 19.64875 19.125 9 19.125 9 20.875 19.64875 20.875 14.76625 25.76625 16 27 23 20"></polygon>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                    </button>
                    <button className="rectangle-up-arrow" id="up-arrow-focusview" style={{ color: "#fff",display:"none" }} onClick={this.expand}> 
                    <svg width="14px" height="14px">
                        <title>FA330ECD-E438-49D6-AEB5-DD2670AE9D78</title>
                        <desc>Created with sketchtool.</desc>
                        <g id="Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="120-Selected-Critical-Flight" transform="translate(-43.000000, -91.000000)" fill="#FFFFFF" fillRule="nonzero">
                                <g id="Button-/-Back" transform="translate(34.000000, 78.000000)">
                                    <g id="Group-4">
                                        <polygon id="Shape" transform="translate(16.000000, 20.000000) scale(-1, 1) translate(-16.000000, -20.000000) " points="16 13 14.76625 14.23375 19.64875 19.125 9 19.125 9 20.875 19.64875 20.875 14.76625 25.76625 16 27 23 20"></polygon>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                    </button>
                    {/* <i className="big arrow alternate circle down outline icon" id="down-arrow" style={{ color: "#fff" }} onClick={this.shrink}></i>
                    <i className="big arrow alternate circle up outline icon" id="up-arrow" style={{ color: "#fff",display:"none" }} onClick={this.expand}></i> */}
                </div>
        </div>
      );
    } else {
      return <></>;
    }
  };

  render() {
    return <div> {this.renderSelectedFlightInFocusView()}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  //console.log(state);
  // console.log('=====FocusView.state======>' + JSON.stringify(state) );
  // console.log('=====ownProps======>' + JSON.stringify(ownProps) );
  return { selectedFlightObj: state.selectedFlight, inboundFlights: state.inboundFlightData

            , outboundFlights: state.outboundFlightData, fltToDisplayInMap : state.getFltToShowInMap 
            , selectedFlightObj: state.selectedFlight , chartObj: state.chartInit  };
};


export default connect(mapStateToProps, {
  showFocusViewForSelectedFlight,
  removeFocusViewForSelectedFlight,
  getFlightDataForOutBound,
  switchFlightsViewByInBoundOrOutbound,
  showSelectedFlightInMap,
  userClick
})(FocusView);
