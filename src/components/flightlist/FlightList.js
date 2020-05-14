import React from  'react';
import "./flightList.scss";
import { connect } from "react-redux";
import { getHoursAndMinutesAfterFormat } from "../../utils/dateUtils";
import { showSelectedFlightInMap, removeSelectedFlightFromMap } from "../../actions/chartDataAction";
import { getTotalPaxCountBasedGroupByClassForFlight } from "../../utils/paxUtils";
import { sort } from "../../utils/sortUtils";

class FlightList extends React.Component {

    getPaxDetailsFormat = (selectedFlight) => {
        let paxObj = getTotalPaxCountBasedGroupByClassForFlight(selectedFlight, this.props.displayView);
        return this.frameCabinClass('F',paxObj.totFClass) + this.frameCabinClass('J',paxObj.totJClass) + this.frameCabinClass('S',paxObj.totSClass) + this.frameCabinClass('Y',paxObj.totYClass) ;
      }
  
      frameCabinClass = (cabinClass, count) =>  Number(count) > 0 ? ` ${cabinClass}${count}` : "";

      getFormattedFltNum = (fltNum) => `${fltNum.substr(0,2)} ${fltNum.substr(2,5)}`;

      getClassName = (flightObj) => flightObj.status.misconnection ? "rectangle-copy-2-1-misconnected" : "rectangle-copy-2-1-delay" ;

      getDelayInMin = (flightObj) => {
            let dif = (new Date(flightObj.eta).getTime() - new Date(flightObj.sta).getTime()); 
            //console.log(dif);
            if(dif !== NaN && dif > 0){
                return  `${Math.round((dif/1000)/60)} min`; 
            }
      }

    renderFlightList = (flightList) => {
      
        // sort the list of flights
        this.props.displayView === 'INBOUND' ?  sort({
            inputList: flightList, 
            objectProp: 'eta', 
            typeOfProp: 'date', 
            conversionRequired: true, 
            isAscending: false, 
            isNewCopyOfArr: false
        })
        : 
        sort({
            inputList: flightList, 
            objectProp: 'etd', 
            typeOfProp: 'date', 
            conversionRequired: true, 
            isAscending: true, 
            isNewCopyOfArr: false
        });

        return flightList.map((flightObj) => {
            return(
                flightObj && <div key={ flightObj.flightId } value={ flightObj.flightId } onClick={ (e) => this.props.showSelectedFlightInMap(flightObj)} >
                     <div className="rectangle-copy-2" >
                        <div className={ this.getClassName(flightObj) }>
                             <div className="flight-num" style={{ display: "inline-block" }}>{this.getFormattedFltNum(flightObj.fltNum)}</div>  <div className="cabin-class" style={{ display: "inline-block" }}>{this.getPaxDetailsFormat(flightObj)}</div>
                         </div>
                         <div className="rectangle-copy-2-2">
                         <p className="flight-details" style={{ display: "inline-block" }}> <b style={{ marginRight: "5px" }}>STA</b> {getHoursAndMinutesAfterFormat(flightObj.sta)} <b style={{ display: "inline-block", marginLeft: "1px" }} className="line"></b> <b style={{ marginLeft: "10px", marginRight: "5px"}}>ETA</b> {getHoursAndMinutesAfterFormat(flightObj.eta)} </p>  <p className="flight-delay" style={{ display: "inline-block" }}> { this.getDelayInMin(flightObj) } </p>
                         </div>
                     </div>
                 </div>
           )
        })       
    }

    shrink = () => {
        let downArrow = document.getElementById("down-arrow");
        downArrow.style.display = "none";
        document.getElementById("legend").style.maxHeight= "5%";
        document.getElementById("up-arrow").style.display = "block";
    };

    expand = () => {
        let downArrow = document.getElementById("down-arrow");
        downArrow.style.display = "block";
        document.getElementById("legend").style.maxHeight= "50%";
        document.getElementById("up-arrow").style.display = "none";
    };

    render(){
        return (
            <div>
            <div className="legend" id="legend">
                {this.props.displayView === "INBOUND" &&  (this.props.fltToDisplayInMap !== null ? this.renderFlightList([this.props.fltToDisplayInMap]) : this.props.inboundFlights && this.renderFlightList(this.props.inboundFlights.flightList)) }
                {this.props.displayView === "OUTBOUND" &&  (this.props.fltToDisplayInMap !== null ? this.renderFlightList([this.props.fltToDisplayInMap]) : this.props.outboundFlights && this.renderFlightList(this.props.outboundFlights.flightList)) }
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