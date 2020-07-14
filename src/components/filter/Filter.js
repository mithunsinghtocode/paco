import React from "react";
import { connect } from "react-redux";
import "./Filter.scss";
import { getFilteredFlightDataForInbound, getFilteredFlightDataForOutbound } from '../../actions/chartDataAction';
import { clearChartComponents } from '../map/objects/clearChartObjects';
import { renderChartLayout } from '../map/objects/renderChartLayOut';

let switch1On = false;
let switch2On = false;
let switch3On = false;
let switch4On = false;

/** Filter Component */
export class Filter extends React.PureComponent {
  renderBackButton(){
    return (<button className="rectangle" onClick={this.props.goBackFunction} style={{ width : '100px'}}>
      <svg width="14px" height="14px" style={{ marginRight : '10px'}}>
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
           BACK </button>
          );
  }

  renderShowAllFlightsButton(){
    return (<button className="rectangle" onClick={this.props.goBackFunction}>
           SHOW ALL FLIGHTS </button>
          );
  }
  renderLockDecisionButton(){
    return (<button className="rectangle"  style={{display:"inline-block"}} >
    {/* return (<button className="rectangle" onClick={this.props.goBackFunction}> */}
           LOCK DECISION</button>
          );
  }
  frameFlightsForMap = (flightList) => {
    clearChartComponents(this.props.chartObj, ["ALL"]);
    renderChartLayout(this.props.chartObj);
    this.props.displayView === "INBOUND" && this.props.getFilteredFlightDataForInbound(flightList);
    this.props.displayView === "OUTBOUND" && this.props.getFilteredFlightDataForOutbound(flightList);  
  }
  renderPadding(){
    return (<div style={{"width": "172px"}} > </div> );
  }
  filterInboundFlightBasedOnToggle = () => {
    
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours()+h);
      return this;
    }
    let misconnectionToggle = document.getElementById("switch1").checked;
    let arrivWithin3HoursToggle = document.getElementById("switch2").checked;
    misconnectionToggle ? switch1On = true : switch1On = false;
    arrivWithin3HoursToggle ? switch2On = true : switch2On = false;
    if(misconnectionToggle && arrivWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
          return flight.status && 
            // Singapore variance is +8 and arriving within 3 hours => -8+3 = -5
            (flight.status.misconnection === true && (new Date(flight.eta).getTime() < (new Date().addHours(-5)).getTime()))
          }
        );
        this.frameFlightsForMap(flightList);
    } else if (misconnectionToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
          return flight.status && flight.status.misconnection === true;       
      });
        this.frameFlightsForMap(flightList);
    } else if (arrivWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
        return flight.status && (new Date(flight.eta).getTime() < (new Date().addHours(-5)).getTime());
      });
        this.frameFlightsForMap(flightList);
    } else{
        this.frameFlightsForMap(this.props.flightData);
    }
  }


  filterOutboundFlightBasedOnToggle = () => {
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours()+h);
      return this;
    }
    let hideHandledFlights = document.getElementById("switch1").checked;
    let departWithin3HoursToggle = document.getElementById("switch2").checked;

    hideHandledFlights ? switch3On = true : switch3On = false;
    departWithin3HoursToggle ? switch4On = true : switch4On = false;
    if(hideHandledFlights && departWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
          return flight.status && 
            // Singapore variance is +8 and arriving within 3 hours => -8+3 = -5
            (!flight.status.handled === true && (new Date(flight.etd).getTime() < (new Date().addHours(-5).getTime())))
          }
        );
        this.frameFlightsForMap(flightList);
    } else if (hideHandledFlights){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
          return flight.status && !flight.status.handled === true;
      });
        this.frameFlightsForMap(flightList);
    } else if (departWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
        return (new Date(flight.etd).getTime() < (new Date().addHours(-5).getTime()));
      });
        this.frameFlightsForMap(flightList);
    } else{
        this.frameFlightsForMap(this.props.flightData);
    }
  }

  getFormattedHeading = (fltObj) => {
    return (<label> <div><div style={{display:"inline-block"}} className="fltNum"> {fltObj.fltNum} </div> <div style={{display:"inline-block"}} className="flt-header">({fltObj.depStn} - {fltObj.arrStn})</div></div></label>)  
  };

  isPotentialMisconnectionPresent = () => {
    return this.props.flightData && this.props.flightData.flightSchedule.flightList.some( (flight) => {
      return flight.status && !flight.status.misconnection;
    })
  }

  isArrNxt3HrsPresent = () => {
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours()+h);
      return this;
    }
    return this.props.flightData && this.props.flightData.flightSchedule.flightList.some( (flight) => {
      return (new Date(flight.eta).getTime() < (new Date().addHours(-5)));
    });
  }

  getPotentialMisconnectionCheckBox = () => {
    if(this.isPotentialMisconnectionPresent()){
      return <input type="checkbox" checked={switch1On} id="switch1" className="switch__input"  onClick={ this.filterInboundFlightBasedOnToggle } />;
    }else{
      return <input type="checkbox" disabled checked={switch1On} id="switch1" className="switch__input"  onClick={ this.filterInboundFlightBasedOnToggle } />;
    }
  }

  getArrNxt3HrsCheckBox = () => {
    if(this.isArrNxt3HrsPresent()){
      return <input type="checkbox" checked={switch2On} id="switch2" className="switch__input" onClick={ this.filterInboundFlightBasedOnToggle }/>;
    }else{
      return <input type="checkbox" disabled checked={switch2On} id="switch2" className="switch__input" onClick={ this.filterInboundFlightBasedOnToggle }/>;
    }
  }

  getInBoundFilter = () => {
      return ( <div className="div-switch" >
        <div className="switch">
          {this.getPotentialMisconnectionCheckBox()}
          <label htmlFor="switch1" className="switch__label">
            <div className="switch__label__text">
                Potential misconnection only
            </div>
          </label>
        </div>
        {/* &nbsp;  */}
        <div className="vl"></div>
        <div className="switch">
          {this.getArrNxt3HrsCheckBox()}
          <label htmlFor="switch2" className="switch__label">
            <div className="switch__label__text">
                Arriving within next 3 hours
            </div>            
          </label>
        </div>
      </div>
      )
  };

  isHandlePresent = () => {
    return this.props.flightData && this.props.flightData.flightSchedule.flightList.some( (flight) => {
      return flight.status && flight.status.handled;
    })
  }

  isDepNxt3HrsPresent = () => {
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours()+h);
      return this;
    }
    return this.props.flightData && this.props.flightData.flightSchedule.flightList.some( (flight) => {
      return (new Date(flight.etd).getTime() < (new Date().addHours(-5).getTime()));
    });
  }

  gethandleCheckBox = () => {
    if(this.isHandlePresent()){
      return <input type="checkbox" checked={switch3On} id="switch1" className="switch__input" onClick = { this.filterOutboundFlightBasedOnToggle }/>;
    }else{
      return <input type="checkbox" disabled checked={switch3On} id="switch1" className="switch__input" onClick = { this.filterOutboundFlightBasedOnToggle }/>;
    }
    
  }

  getDepNxt3HrsCheckBox = () => {
    if(this.isDepNxt3HrsPresent()){
      return <input type="checkbox" checked={switch4On} id="switch2" className="switch__input" onClick = { this.filterOutboundFlightBasedOnToggle }/>
    }else{
      return <input type="checkbox" disabled checked={switch4On} id="switch2" className="switch__input" onClick = { this.filterOutboundFlightBasedOnToggle }/>
    }
  }

  getOutBoundFilter = () => {
     return ( <div className="div-switch">
            <div className="switch">
              {this.gethandleCheckBox()}
              <label htmlFor="switch1" className="switch__label">
              <div className="switch__label__text">
                Hide Handled flight
                </div>
              </label>
            </div>
            {/* &nbsp;  */}
            <div className="vl"></div>
            <div className="switch">              
              {this.getDepNxt3HrsCheckBox()}
              <label htmlFor="switch2" className="switch__label">
              <div className="switch__label__text">
                Departure within next 3 hours
                </div>
              </label>
            </div>
          </div>
     )
  };

  render() {
    return (
      <>
      {this.props.displayView === "INBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
        {this.props.fltToDisplayInMap !== null && this.renderShowAllFlightsButton()}
        {this.props.fltToDisplayInMap !== null && this.getFormattedHeading(this.props.fltToDisplayInMap)} 
          {this.props.fltToDisplayInMap === null && this.getInBoundFilter()}          
          { ( this.props.fltToDisplayInMap !== null &&  this.renderPadding() ) ||
              ( this.props.selectedFlightObj !== null &&  this.renderLockDecisionButton())
          }               
        </nav> }

        {this.props.displayView === "OUTBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
        {this.props.fltToDisplayInMap !== null && this.renderBackButton() }
        {this.props.fltToDisplayInMap !== null && this.getFormattedHeading(this.props.fltToDisplayInMap)}
        {this.props.fltToDisplayInMap === null && this.getOutBoundFilter()}
        { ( this.props.fltToDisplayInMap !== null &&  this.renderPadding() ) ||
              ( this.props.selectedFlightObj !== null &&  this.renderLockDecisionButton())
          }
        </nav> }
      </>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  //console.log(state);
  // console.log('===========>' + JSON.stringify(state) );
  // return { chartObj: state.chartInit, displayView: state.getDisplayView, goBackFunction : ownprops.goBackFunction, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData };
  return { chartObj: state.chartInit, displayView: state.getDisplayView, 
            goBackFunction : ownprops.goBackFunction, fltToDisplayInMap : state.getFltToShowInMap, 
            flightData : state.allFlightData, selectedFlightObj: state.selectedFlight  };
};

export default connect(mapStateToProps, { getFilteredFlightDataForInbound, getFilteredFlightDataForOutbound })(Filter);
