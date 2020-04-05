import React from  'react';
import "./flightList.scss";
import { connect } from "react-redux";

import { showSelectedFlightInMap, removeSelectedFlightFromMap } from "../../actions/chartDataAction";

class FlightList extends React.Component {

    getPaxDetailsFormat = (selectedFlight) => {
        return this.frameCabinClass('F',selectedFlight.paxCountVo.fclassCnt) + this.frameCabinClass('J',selectedFlight.paxCountVo.jclassCnt) + this.frameCabinClass('S',selectedFlight.paxCountVo.sclassCnt) + this.frameCabinClass('Y',selectedFlight.paxCountVo.yclassCnt) ;
      }
  
      frameCabinClass = (cabinClass, count) =>  Number(count) > 0 ? ` ${cabinClass}${count}` : "";

      getFormattedFltNum = (fltNum) => `${fltNum.substr(0,2)} ${fltNum.substr(2,5)}`;

      getClassName = (flightObj) => flightObj.status.misconnection ? "rectangle-copy-2-1-misconnected" : "rectangle-copy-2-1-delay" ;

    renderFlightList = (flightList) => {
        return flightList.map((flightObj) => {            
            return(
                flightObj && <div key={ flightObj.flightId } value={ flightObj.flightId } onClick={ (e) => this.props.showSelectedFlightInMap(flightObj)} >
                     <div className="rectangle-copy-2" >
                        <div className={ this.getClassName(flightObj) }>
                             <div className="flight-num" style={{ display: "inline-block" }}>{this.getFormattedFltNum(flightObj.fltNum)}</div>  <div className="cabin-class" style={{ display: "inline-block" }}>{this.getPaxDetailsFormat(flightObj)}</div>
                         </div>
                         <div className="rectangle-copy-2-2">
                         <p className="flight-details" style={{ display: "inline-block" }}> <b style={{ marginRight: "5px" }}>STA</b> 01:07 <b style={{ display: "inline-block", marginLeft: "1px" }} className="line"></b> <b style={{ marginLeft: "10px", marginRight: "5px"}}>ETA</b> 02:05 </p>  <p className="flight-delay" style={{ display: "inline-block" }}>58 min</p>
                         </div>
                     </div>
                 </div>
           )
        })       
    }

    render(){
        return (
            <div className="legend">
                { this.props.fltToDisplayInMap !== null ? this.renderFlightList([this.props.fltToDisplayInMap]) : this.props.inboundFlights && this.renderFlightList(this.props.inboundFlights.flightList) }
           </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(state);
    return { fltToDisplayInMap : state.getFltToShowInMap, chartObj: state.chartInit, inboundFlights: state.inboundFlightData };
  }

export default connect(mapStateToProps , { showSelectedFlightInMap, removeSelectedFlightFromMap })(FlightList);