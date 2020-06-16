import React from  'react';
import "./flightList.scss";
import { connect } from "react-redux";
import { getHoursAndMinutesAfterFormat } from "../../utils/dateUtils";
import { showSelectedFlightInMap, removeSelectedFlightFromMap } from "../../actions/chartDataAction";
import { getTotalPaxCountBasedGroupByClassForFlight } from "../../utils/paxUtils";
import { sort } from "../../utils/sortUtils";

var scrollHeight = 0;
let MAX_HEIGHT = 86;
const MIN_HEIGHT = 50;
const TRANSITION_MULTIPLIER=1.4;
const SINGLE_RECORD = 12;
let flightListVar;
class FlightList extends React.Component {

    getPaxDetailsFormat = (selectedFlight) => {
        let paxObj = getTotalPaxCountBasedGroupByClassForFlight(selectedFlight, this.props.displayView);    
        let resultComponent = [];
        resultComponent.push(this.frameCabinClass2('F',paxObj.totFClass));
        resultComponent.push(this.frameCabinClass2('J',paxObj.totFClass));
        resultComponent.push(this.frameCabinClass2('S',paxObj.totFClass));
        resultComponent.push(this.frameCabinClass2('Y',paxObj.totFClass));
        return resultComponent;

      }
      frameCabinClass2 = (cabinClass, count) =>  {
        let res = [];
        let cabinClassFormatted = <b style={{fontFamily: "Proxima Nova Bold" }}>{cabinClass}</b>;
        let countFormatted = <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>{count}</b>;
        
        res.push('  ')
        res.push(cabinClassFormatted);
        // res.push(count);
        res.push(countFormatted);
        return res;
      }
  
    //   frameCabinClass = (cabinClass, count) =>  Number(count) === 0 ? `  ${cabinClass}${count}` : `  ${cabinClass}${count}`;
      frameCabinClass = (cabinClass, count) =>  `  ${cabinClass}${count}`;

      getFormattedFltNum = (fltNum) => `${fltNum.substr(0,2)} ${fltNum.substr(2,5)}`;

      getClassName = (flightObj) => flightObj.status.misconnection ? "rectangle-copy-2-1-misconnected" : "rectangle-copy-2-1-delay" ;

      getDelayInMin = (flightObj, isInbound) => {
            let dif = isInbound ? 
              (new Date(flightObj.eta).getTime() - ((flightObj.rta !== undefined && flightObj.rta !== null) ? new Date(flightObj.rta).getTime() : new Date(flightObj.sta).getTime()))
            : (new Date(flightObj.etd).getTime() - ((flightObj.rtd !== undefined && flightObj.rtd !== null) ? new Date(flightObj.rtd).getTime() : new Date(flightObj.std).getTime()));
            //console.log(dif);
            if(dif !== NaN && dif >= 0){
                return  `${Math.round((dif/1000)/60)}`; 
            }
      }

      setHighlightedFlight = (highlightFlight, flightObj) => {
          if(highlightFlight) return highlightFlight.flightId === flightObj.flightId ? true : false;
          return true;
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
            sort({
                inputList: flightList, 
                objectProp: 'etd', 
                typeOfProp: 'date', 
                conversionRequired: true, 
                isAscending: true, 
                isNewCopyOfArr: false
            });
        }
        this.setHeight(flightList);
        return flightList.map((flightObj, index) => {
            return(
                flightObj && <div className="rectangle-container"><div key={ flightObj.flightId } value={ flightObj.flightId } 
                onClick={ (e) => this.props.showSelectedFlightInMap(flightObj)} 
                    style= {{ opacity: this.setHighlightedFlight(highlightFlight, flightObj) ? '1' : '0.32',
                            filter: this.setHighlightedFlight(highlightFlight, flightObj) ? 'grayscale(0%)' : 'grayscale(20%)',
                            marginTop: misconxCount===index ? '32px' : '0px'}}>
                     <div className= { index !== flightList.length-1 ? "rectangle-copy-2" : 'rectangle-copy-2-last-cell'} >
                        <div className={ this.getClassName(flightObj) }>
                             <div className="flight-num" style={{ display: "inline-block" }}>{this.getFormattedFltNum(flightObj.fltNum)}</div>  
                             <div className="cabin-class" style={{ display: "inline-block" }}>{this.getPaxDetailsFormat(flightObj)}</div>
                         </div>

                         <div className="rectangle-copy-2-2">
                         <p className="flight-details" style={{ display: "inline-block" }}> 
                             <b style={{ marginRight: "5px" }}>
                                 {flightObj.arrStn === 'SIN' ? 'STA' : 'STD'}
                                 </b> 
                                 <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { flightObj.arrStn === 'SIN' ? getHoursAndMinutesAfterFormat(flightObj.sta) : getHoursAndMinutesAfterFormat(flightObj.std)} 
                                 </b>                                                      
                                 <b style={{ display: "inline-block", marginLeft: "5px" }} className="line">
                                 </b> 
                                 <b style={{ marginLeft: "10px", marginRight: "5px"}}>
                                     {flightObj.arrStn === 'SIN' ? 'ETA' : 'ETD' } 
                                 </b> 
                                 <b style={{fontFamily: "Proxima Nova Thin", fontWeight:"900" }}>
                                    { flightObj.arrStn === 'SIN' ? getHoursAndMinutesAfterFormat(flightObj.eta) : getHoursAndMinutesAfterFormat(flightObj.etd)} 
                                 </b>
                         </p>  
                         <p className="flight-delay" style={{ display: "inline-block" }}> 
                             { this.getDelayInMin(flightObj, flightObj.arrStn === 'SIN' ? true : false) + " min"} 
                         </p>
                         </div>
                     </div>
                 </div>
                 </div>
           )
        });
    };
    setHeight = (flightList) => {
       return flightList && ((flightList.length*SINGLE_RECORD < 50) ? flightList.length*SINGLE_RECORD +"%" : "50%");   
    };

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
        if(flightListVar && flightListVar.length*SINGLE_RECORD < 50) return document.getElementById("legend").style.height= flightListVar.length*SINGLE_RECORD +"% !important";
        MAX_HEIGHT = MAX_HEIGHT > flightListVar.length*SINGLE_RECORD ? flightListVar.length*SINGLE_RECORD : MAX_HEIGHT;
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
    return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, inboundFlights: state.inboundFlightData, outboundFlights: state.outboundFlightData, displayView: state.getDisplayView };
  }

export default connect(mapStateToProps , { showSelectedFlightInMap, removeSelectedFlightFromMap })(FlightList);