import React from  'react';
import "./flightList.scss";
import { connect } from "react-redux";
import { getHoursAndMinutesAfterFormat, getUTCDate } from "../../utils/dateUtils";
import { showSelectedFlightInMap, removeSelectedFlightFromMap } from "../../actions/chartDataAction";
import { getTotalPaxCountBasedGroupByClassForFlight } from "../../utils/paxUtils";

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
                { this.props.fltToDisplayInMap !== null ? this.renderFlightList([this.props.fltToDisplayInMap]) : this.props.inboundFlights && this.renderFlightList(this.props.inboundFlights.flightList) }
            </div>

            <div className="overlay-arrow">
                    <i className="big arrow alternate circle down outline icon" id="down-arrow" style={{ color: "#fff" }} onClick={this.shrink}></i>
                    <i className="big arrow alternate circle up outline icon" id="up-arrow" style={{ color: "#fff",display:"none" }} onClick={this.expand}></i>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, inboundFlights: state.inboundFlightData, displayView: state.getDisplayView };
  }

export default connect(mapStateToProps , { showSelectedFlightInMap, removeSelectedFlightFromMap })(FlightList);