import React from  'react';
import "./flightList.scss";
import { connect } from "react-redux";
import { getHoursAndMinutesAfterFormat, getCurrentTimeInUTC, getTestTime } from "../../utils/dateUtils";
import { showSelectedFlightInMap, removeSelectedFlightFromMap, userClick } from "../../actions/chartDataAction";
import { getTotalPaxCountBasedGroupByClassForFlight } from "../../utils/paxUtils";
import { sort } from "../../utils/sortUtils";
import { isDepNxt3Hrs } from "../../utils/filterUtils";

var scrollHeight = 0;
let MAX_HEIGHT = 86;
let MIN_HEIGHT = 50;
const TRANSITION_MULTIPLIER=1.4;
const SINGLE_RECORD = 16;
let flightListVar;
class FlightList extends React.Component {

    off = () => {
        this.props.removeSelectedFlightFromMap(null);
      };

    getIconForHandle() {
        return (<svg width="34px" height="29px" viewBox="0 0 34 29" >
        <title>AC5CD48C-3042-4A03-9D47-0B5A51C97DC0</title>
        <defs>
            <filter x="-4.1%" y="-16.0%" width="108.2%" height="132.0%" filterUnits="objectBoundingBox" id="filter-1">
                <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="4" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix>
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
            </filter>
        </defs>
        <g id="Design" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Components" transform="translate(-548.000000, -1325.000000)" fill="#00DC88">
                <g id="Flight-Box-/-Outbound-Handled" transform="translate(543.000000, 1317.000000)">
                    <g id="Group-2-Copy-7" filter="url(#filter-1)">
                        <path d="M30.5830116,16.4266409 C30.027027,15.8577864 29.1235521,15.8577864 28.5675676,16.4266409 L19.4633205,25.5617761 L15.4324324,21.479408 C14.8764479,20.9105534 13.972973,20.9105534 13.4169884,21.479408 C12.8610039,22.0482625 12.8610039,22.9517375 13.4169884,23.520592 L18.4555985,28.5733591 C19.011583,29.1422136 19.9150579,29.1422136 20.4710425,28.5733591 L30.5830116,18.4343629 C31.1389961,17.8989704 31.1389961,16.9954955 30.5830116,16.4266409 Z" id="Path"></path>
                    </g>
                </g>
            </g>
        </g>
        </svg>);
      }
    getPaxDetailsFormat = (selectedFlight) => {
        let paxObj = getTotalPaxCountBasedGroupByClassForFlight(selectedFlight, this.props.displayView);    
        let resultComponent = [];
        resultComponent.push(this.frameCabinClass('F',paxObj.totFClass));
        resultComponent.push(this.frameCabinClass('J',paxObj.totJClass));
        resultComponent.push(this.frameCabinClass('S',paxObj.totSClass));
        resultComponent.push(this.frameCabinClass('Y',paxObj.totYClass));
        return resultComponent;
      }
      frameCabinClass = (cabinClass, count) =>  {    
        let res = [];
        let cabinClassFormatted = <b style={{fontFamily: "Proxima Nova Semibold", fontWeight:"700" }}>{cabinClass}</b>;
        let countFormatted = <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900"}}>{count}</b>;        
        res.push('  ');
        res.push(cabinClassFormatted);
        res.push(countFormatted);    
        return res;
      }
      getFormattedFltNum = (fltNum) => `${fltNum.substr(0,2)} ${fltNum.substr(2,5)}`;

      getClassName = (flightObj) => {
          if(this.props.displayView === 'INBOUND') return flightObj.status.misconnection ? "rectangle-copy-2-1-misconnected" : "rectangle-copy-2-1-delay";
          if(this.props.displayView === 'OUTBOUND') {
              if(flightObj.status.handled) return 'rectangle-copy-2-1-handled';
              if(flightObj.status.misconnection && isDepNxt3Hrs(flightObj)) return 'rectangle-copy-2-1-misconnected-within3hrs';
              if(flightObj.status.misconnection && !isDepNxt3Hrs(flightObj)) return 'rectangle-copy-2-1-misconnected-outside3hrs';
          } 
      };

      getDelayInMin = (flightObj, isInbound, currentTime) => {
        //console.log(new Date(currentTime))
        //console.log(new Date(flightObj.etd))
          if(isInbound !== undefined){
            let dif = isInbound ? 
              (new Date(flightObj.eta).getTime() - ((flightObj.rta !== undefined && flightObj.rta !== null) ? new Date(flightObj.rta).getTime() : new Date(flightObj.sta).getTime()))
            : (new Date(flightObj.etd).getTime() - new Date(currentTime).getTime());
            
            if(isInbound && dif !== NaN && dif >= 0){
                return  `${Math.round((dif/1000)/60)}`; 
            }
            if(!isInbound && dif !== NaN ){
                return  `${Math.round((dif/1000)/60)}`; 
            }
        }else{
            return ;
        }
      }

      setHighlightedFlight = (highlightFlight, flightObj) => {
          if(highlightFlight) return highlightFlight.flightId === flightObj.flightId ? true : false;
          return true;
      }

      timeConvert = (n) => {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.ceil(minutes);
        rminutes = (rminutes.toString().length === 1) ? '0'+rminutes : rminutes;
        return rhours + ":" + rminutes + "h";
    }

    renderFlightList = (flightList, highlightFlight) => {
        flightListVar = flightList;
        flightList.forEach( (inObj) => {
            inObj.diffInMin = this.getDelayInMin(inObj);
        });
        // sort based on misconnection
        sort({
            inputList: flightList, 
            objectProp: 'status.misconnection', 
            typeOfProp: 'boolean', 
            conversionRequired: false, 
            isAscending: false, 
            isNewCopyOfArr: false
        });
        //sort the list of flights
        let misconxCount = 0;
        if(this.props.displayView === "OUTBOUND"){
            flightList  = flightList.filter((flight) => {
                return flight.etd !== null && flight.etd > (flight.rtd || flight.std);
              });
        }
        if(this.props.displayView === 'INBOUND'){
            let flightMisconnectionList = flightList.filter(flight => flight.status.misconnection);
            let flightDelayList = flightList.filter(flight => !flight.status.misconnection);
            sort({
                inputList: flightMisconnectionList, 
                objectProp: 'diffInMin', 
                typeOfProp: 'number', 
                conversionRequired: true, 
                isAscending: false, 
                isNewCopyOfArr: false
            });
            sort({
                inputList: flightDelayList, 
                objectProp: 'diffInMin', 
                typeOfProp: 'number', 
                conversionRequired: true, 
                isAscending: false, 
                isNewCopyOfArr: false
            });
            flightList = [...flightMisconnectionList, ...flightDelayList]
            misconxCount = flightMisconnectionList.length;
        }else{

            let flightHandledList = flightList.filter(flight => flight.status.handled);
            let flightOutside3HrsList = flightList.filter(flight => !isDepNxt3Hrs(flight));
            let flightNotHandledList = flightList.filter(flight => !flight.status.handled && isDepNxt3Hrs(flight));

            sort({
                inputList: flightNotHandledList, 
                objectProp: 'etd', 
                typeOfProp: 'date', 
                conversionRequired: true, 
                isAscending: true, 
                isNewCopyOfArr: false
            });
            sort({
                inputList: flightHandledList, 
                objectProp: 'status.handled', 
                typeOfProp: 'boolean', 
                conversionRequired: false, 
                isAscending: false, 
                isNewCopyOfArr: false
            });
            sort({
                inputList: flightOutside3HrsList, 
                objectProp: 'etd', 
                typeOfProp: 'date', 
                conversionRequired: true, 
                isAscending: true, 
                isNewCopyOfArr: false
            });
            flightHandledList = [...flightOutside3HrsList, ...flightHandledList]
            flightList = [...flightNotHandledList, ...flightHandledList];
            misconxCount = flightNotHandledList.length;        
        }
        var legendDiv = document.getElementById("legend");
        if(legendDiv !== null){
            document.getElementById("legend").style.height= this.setHeight(flightList);
        }
        return flightList.map((flightObj, index) => {
            return(
                flightObj && <div className="rectangle-container"><div key={ flightObj.flightId} value={ flightObj.flightId } 
                onClick={ (e) => this.props.showSelectedFlightInMap(flightObj)} 
                    style= {{ opacity: this.setHighlightedFlight(highlightFlight, flightObj) ? '1' : '0.32',
                            filter: this.setHighlightedFlight(highlightFlight, flightObj) ? 'grayscale(0%)' : 'grayscale(20%)',
                            marginTop: misconxCount===index ? '32px' : '0px'}}>
                     <div className= { index !== flightList.length-1 ? "rectangle-copy-2" : 'rectangle-copy-2-last-cell'} >
                        <div className={ this.getClassName(flightObj) }>
                            {flightObj.status.handled && this.getIconForHandle()}
                             <div className={!flightObj.status.handled ? "flight-num" : "flight-num-handle"} style={{ display: "inline-block" }}>{this.getFormattedFltNum(flightObj.fltNum)}</div>  
                             <div className={!flightObj.status.handled ? "cabin-class" : "cabin-class-handle"}  style={{ display: "inline-block" }}>{this.getPaxDetailsFormat(flightObj)}</div>
                         </div>

                         <div className="rectangle-copy-2-2">
                         <p className="flight-details" style={{ display: "inline-block" }}> 
                           
                                { flightObj.arrStn === 'SIN' && this.getInboundScheduleTiming(flightObj)}                         
                                 { flightObj.arrStn === 'SIN' && this.line()}
                                 {flightObj.arrStn === 'SIN' && this.getInboundTiming(flightObj) } 
                                 {flightObj.depStn === 'SIN' && this.getOutboundTiming(flightObj)}
                         </p>  
                         <p className="flight-delay" style={{ display: "inline-block" }}> 
                             {
                                this.props.getCurrentTime ? flightObj.depStn === 'SIN' && this.timeConvert(this.getDelayInMin(flightObj, false, getCurrentTimeInUTC())) : 
                                flightObj.depStn === 'SIN' && this.timeConvert(this.getDelayInMin(flightObj, false, getCurrentTimeInUTC()))
                            }
                            {
                                flightObj.arrStn === 'SIN' && this.getDelayInMin(flightObj, true) + " min"
                            }
                         </p>
                         </div>
                     </div>
                 </div>
                 </div>
           )
        });
    };
    setHeight = (flightList) => {
        // console.log("===== flightList.length =====>" + flightList.length);
       return flightList && ((flightList.length*SINGLE_RECORD < 50) ? flightList.length*SINGLE_RECORD +"%" : "50%");   
    };
    
    getInboundScheduleTiming = (flightObj) => {
        return (<div style={{display: "inline-block"}}><b style={{ marginRight: "5px" }}>
                                 {flightObj.arrStn === 'SIN' && 'STA' }
                                 </b>
                                 <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { flightObj.arrStn === 'SIN' && getHoursAndMinutesAfterFormat(flightObj.sta) }
        </b> </div>);
    }
    getOutboundTiming = (flightObj) => {
        return (
            <div>
                <b style={{ marginRight: "5px"}}>
                                     {flightObj.etd ? 'ETD' : 'STD' } 
                                 </b> 
                                 <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { flightObj.etd ? getHoursAndMinutesAfterFormat(flightObj.etd) : getHoursAndMinutesAfterFormat(flightObj.std)} 
                                 </b>
                                 </div>
                );
    };

    getInboundTiming = (flightObj) => {
        return (<div style={{display: 'inline'}}><b style={{ marginLeft: "15px", marginRight: "5px"}}>
                                     {flightObj.arrStn === 'SIN' && 'ETA' } 
                                 </b> 
                                 <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { flightObj.arrStn === 'SIN' && getHoursAndMinutesAfterFormat(flightObj.eta) }
                                    {/* : getHoursAndMinutesAfterFormat(flightObj.etd) */}
                                 </b> </div>);
    }
    line = () => {
        return (<b style={{ display: "inline-block", marginLeft: "6px", opacity: "0.3" }} className="line">
        </b>);
    }
    shrink = () => {
        let downArrow = document.getElementById("down-arrow");
        downArrow.style.display = "none";
        document.getElementById("legend").style.height= "76px";
        document.getElementById("up-arrow").style.display = "block";
        document.querySelector("#legend").scrollTop = 0;
    };

    expand = () => {
        let downArrow = document.getElementById("down-arrow");
        downArrow.style.display = "block";
        document.getElementById("legend").style.height = this.setHeight(flightListVar);
        document.getElementById("up-arrow").style.display = "none";
    };

    adjustHeight = async (e) => {
        if(flightListVar && flightListVar.length*SINGLE_RECORD < 50) document.getElementById("legend").style.height= flightListVar.length*SINGLE_RECORD +"% !important";
        MAX_HEIGHT = MAX_HEIGHT > flightListVar.length*SINGLE_RECORD ? flightListVar.length*SINGLE_RECORD : MAX_HEIGHT;
        MIN_HEIGHT = MIN_HEIGHT > flightListVar.length*SINGLE_RECORD ? flightListVar.length*SINGLE_RECORD : MIN_HEIGHT;
        //console.log(MAX_HEIGHT);
        let y = e.deltaY;
        var element = document.querySelector("#legend");
        var st = element.scrollTop;
        if(y){
            var currHeight = Number(document.getElementById("legend").style.height.replace('%',''));
            if(y>=0 && st >=0){
                    if(currHeight >= 0 && currHeight < MAX_HEIGHT) {
                        document.getElementById("down-arrow").style.display = "block";
                        document.getElementById("up-arrow").style.display = "none";
                        this.setScrollStyle('hidden', MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER  +'%');
                        scrollHeight+=1;
                    }
                    if(currHeight >= MAX_HEIGHT){ 
                        this.setScrollStyle('auto', MAX_HEIGHT +'%');
                    }
            }else{
                if(currHeight > MIN_HEIGHT && st <=1){
                        this.setScrollStyle('hidden', MIN_HEIGHT + scrollHeight*TRANSITION_MULTIPLIER  +'%');
                        scrollHeight-=1;
                }
                if(currHeight <= MIN_HEIGHT){
                    this.setScrollStyle('auto', MIN_HEIGHT +'%');
                }
            }
        }       
    };
    setScrollStyle = (overflowVal, heightVal) => {
        document.getElementById("legend").style.overflow = overflowVal;
        document.getElementById("legend").style.height= heightVal;
    }
    render(){
        return (
        this.props.selectedFlightObj === null &&
        <div>
            <div className="legend" id="legend" onWheel={this.adjustHeight} onScroll={this.adjustHeight}>
                {this.props.displayView === "INBOUND" &&  (this.props.fltToDisplayInMap !== null ? this.renderFlightList(this.props.inboundFlights.flightList, this.props.fltToDisplayInMap) : this.props.inboundFlights && this.renderFlightList(this.props.inboundFlights.flightList)) }
                {this.props.displayView === "OUTBOUND" &&  (this.props.fltToDisplayInMap !== null ? this.renderFlightList(this.props.outboundFlights.flightList,this.props.fltToDisplayInMap) : this.props.outboundFlights && this.renderFlightList(this.props.outboundFlights.flightList))}
            </div>
            <div className="overlay-arrow">
                    <button className="rectangle-down-arrow" id="down-arrow" style={{ color: "#fff" }} onClick={this.shrink}> 
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
                    <button className="rectangle-up-arrow" id="up-arrow" style={{ color: "#fff",display:"none" }} onClick={this.expand}> 
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
    }
}
const mapStateToProps = (state, ownProps) => {
    //console.log(state);
    return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, inboundFlights: state.inboundFlightData, 
        outboundFlights: state.outboundFlightData, displayView: state.getDisplayView, selectedFlightObj: state.selectedFlight,
    isUserClick: state.isUserClick, getCurrentTime: state.getCurrentTime};
  }

export default connect(mapStateToProps , { showSelectedFlightInMap, removeSelectedFlightFromMap, userClick })(FlightList);