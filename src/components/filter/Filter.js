import React from "react";
import { connect } from "react-redux";
import "./Filter.scss";
import { getFilteredFlightDataForInbound } from '../../actions/chartDataAction';
import { clearChartComponents } from '../map/objects/clearChartObjects';
import { renderChartLayout } from '../map/objects/renderChartLayOut';
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
  filterInboundFlightBasedOnToggle = () => {
    let misconnectionToggle = document.getElementById("switch1").checked;
    let arrivWithin3HoursToggle = document.getElementById("switch2").checked;

    //console.log("misconnectionToggle :: "+misconnectionToggle);
    //console.log("arrivWithin3HoursToggle :: "+ arrivWithin3HoursToggle);

    if(misconnectionToggle && arrivWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
        if(flight.status === null){
          return false;
        }else{
          // Singapore variance is +8 and arriving within 3 hours => -8+3 = -5
          return (flight.status.misconnection === true && (new Date(flight.eta).getTime() < (new Date().addHours(-5))))
        }
        });
        //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries","MapArcSeries","MapArcSeries"]);
        clearChartComponents(this.props.chartObj, ["ALL"]);
        renderChartLayout(this.props.chartObj);
        this.props.getFilteredFlightDataForInbound(flightList);
    } else if (misconnectionToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
        return flight.status && flight.status.misconnection === true;       
        });
        //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries","MapArcSeries","MapArcSeries"]);
        clearChartComponents(this.props.chartObj, ["ALL"]);
        renderChartLayout(this.props.chartObj);
        this.props.getFilteredFlightDataForInbound(flightList);

    } else if (arrivWithin3HoursToggle){
      let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
        if(flight.status === null){
          return false;
        }else{
          Date.prototype.addHours = function(h) {
            this.setHours(this.getHours()+h);
            return this;
          }
          return (new Date(flight.eta).getTime() < (new Date().addHours(-5)));
        }
        });
        //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);
        clearChartComponents(this.props.chartObj, ["ALL"]);
        renderChartLayout(this.props.chartObj);
        this.props.getFilteredFlightDataForInbound(flightList);
    } else{
      //clearChartComponents(this.props.chartObj, ["MapLineSeries", "MapImageSeries"]);
      clearChartComponents(this.props.chartObj, ["ALL"]);
      renderChartLayout(this.props.chartObj);
      this.props.getFilteredFlightDataForInbound(this.props.flightData);
    }

    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours()+h);
      return this;
    }

  }

  getFormattedHeading = (fltObj) => {
    return (<label style={{marginRight: "45%" }}> <div><div style={{display:"inline-block"}} className="fltNum"> {fltObj.fltNum} </div> <div style={{display:"inline-block"}} className="flt-header">({fltObj.depStn} - {fltObj.arrStn})</div></div></label>)  
  };

  getInBoundFilter = () => {
      return ( <div className="div-switch" >
        <div className="switch">
          <input type="checkbox" id="switch1" className="switch__input"  onClick={ this.filterInboundFlightBasedOnToggle } />
          <label htmlFor="switch1" className="switch__label">
            <div className="switch__label__text">
                Potential misconnection only
            </div>
          </label>
        </div>
        {/* &nbsp;  */}
        <div className="vl"></div>
        <div className="switch">
          <input type="checkbox" id="switch2" className="switch__input" onClick={ this.filterInboundFlightBasedOnToggle }/>
          <label htmlFor="switch2" className="switch__label">
            <div className="switch__label__text">
                Arriving within next 3 hours
            </div>            
          </label>
        </div>
      </div>
      )
  };

  getOutBoundFilter = () => {
     return ( <div className="div-switch">
            <div className="switch">
              <input type="checkbox" id="switch1" className="switch__input" />
              <label htmlFor="switch1" className="switch__label">
                Hide Handled flight
              </label>
            </div>
            {/* &nbsp;  */}
            <div className="vl"></div>
            <div className="switch">
              <input type="checkbox" id="switch2" className="switch__input" />
              <label htmlFor="switch2" className="switch__label">
                Departure within next 3 hours
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
        </nav> }

        {this.props.displayView === "OUTBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
        {this.props.fltToDisplayInMap !== null && this.renderBackButton() }
        {this.props.fltToDisplayInMap !== null && this.getFormattedHeading(this.props.fltToDisplayInMap)}
        {this.props.fltToDisplayInMap === null && this.getOutBoundFilter()}
        </nav> }
      </>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  //console.log(state);
  return { chartObj: state.chartInit, displayView: state.getDisplayView, goBackFunction : ownprops.goBackFunction, fltToDisplayInMap : state.getFltToShowInMap, flightData : state.allFlightData };
};

export default connect(mapStateToProps, { getFilteredFlightDataForInbound })(Filter);
