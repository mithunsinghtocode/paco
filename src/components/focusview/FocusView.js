import React from "react";
import "./focusView.scss";
import { connect } from "react-redux";
import {
  showFocusViewForSelectedFlight,
  removeFocusViewForSelectedFlight,
  getFlightDataForOutBound
} from "../../actions/chartDataAction";
import {
  getHoursAndMinutesAfterFormat
} from "../../utils/dateUtils";

class FocusView extends React.PureComponent {
  off = () => {
    this.props.removeFocusViewForSelectedFlight(null);
  };

  getBayGateTerminalDetails = selectedFlight => {
    return selectedFlight.depBayGateNo !== null
      ? `${selectedFlight.depTerminal} / ${selectedFlight.depBayGateNo}`
      : "-";
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
      let cabinClassFormatted = <b style={{fontFamily: "Proxima Nova Semibold", fontWeight:"900" }}>{cabinClass}</b>;
      let countFormatted = <b style={{fontFamily: "Proxima Nova Thin"}}>{count}</b>;        
      res.push('  ')
      res.push(cabinClassFormatted);
      res.push(countFormatted);
      return res;
  }  

  
// setHeight = (flightList) => {
//   return flightList && ((flightList.length*SINGLE_RECORD < 50) ? flightList.length*SINGLE_RECORD +"%" : "50%");   
// };

shrink = () => {
   let downArrow = document.getElementById("down-arrow-focusview");
   downArrow.style.display = "none";
  //  document.getElementById("legend").style.height= "76px";
  //  document.getElementById("rectangle-container").style.height= "76px";
   document.getElementById("showHide").style.height= "76px";
   document.getElementById("up-arrow").style.display = "block";
   document.querySelector("#legend").scrollTop = 0;
};

expand = () => {
   let downArrow = document.getElementById("down-arrow-focusview");
   downArrow.style.display = "block";
  //  document.getElementById("legend").style.height = this.setHeight(flightListVar);
  //  document.getElementById("legend").style.height = "75%";
  // document.getElementById("rectangle-container").style.height = "75%";   
  document.getElementById("showHide").style.height = "75%";   
   document.getElementById("up-arrow").style.display = "none";
};

showAvailFlightsInThreeHour = () => {
  let availFlightsInThreeHourToggle = document.getElementById("switch1").checked;

  console.log("availFlightsInThreeHourToggle :: "+availFlightsInThreeHourToggle);

  if(availFlightsInThreeHourToggle){
    let flightList = this.props.flightData.flightSchedule.flightList.filter((flight) => {
      if(flight.status === null){
        return false;
      }else{
        Date.prototype.addHours = function(h) {
          this.setHours(this.getHours()+h);
          return this;
        }
        return (new Date(flight.std).getTime() < (new Date().addHours(-5)));
      }
      });
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

  renderSelectedFlightInFocusView = () => {
    //console.log("Into Focus View");
    let selectedFlight = this.props.selectedFlightObj;

    // console.log('############ props type ->' + typeof(this.props));
    // console.log('############ props  ->' + JSON.stringify(this.props) );
    // console.log('############ props.flightData  ->' + JSON.stringify(this.props.flightData) );
    if (selectedFlight != null) {
      console.log(selectedFlight);

      return (
        <div id="showHide">
          <div id="overlay">
            <div className="card text-white mb-3">              
              <div className="card-header" style={{ background: '#0483F8' }}>{this.getFormattedFltNum(selectedFlight.fltNum)}</div>                      

              <div className="card-body" style={{ marginLeft: "10px" }}>
                <div className="row dimmed">
                  <div className="col-2 col-md-3">STD</div>
                  <div className="col-1 col-md-3">GATE</div>
                  <div className="col-3 col-md-5">PAX</div>
                </div>
                <div className="row value">
                  <div className="col-2 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                    {getHoursAndMinutesAfterFormat(selectedFlight.std)}
                  </div>
                  <div className="col-1 col-md-3"  style={{fontFamily: "Proxima Nova Regular"}}>
                    {this.getBayGateTerminalDetails(selectedFlight)}
                  </div>
                  <div className="col-3 col-md-5">
                    {this.getPaxDetailsFormat(selectedFlight)}
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
                  <div
                    className="col-3 col-md-5"
                    style={{ fontSize: "21px", marginTop: "6px", fontFamily: "Proxima Nova Regular" }}
                  >
                    <div className="switch">                      
                      <label htmlFor="switch1" className="switch__label">
                        <div className="switch__label__text">
                          4 Flights
                        </div>                        
                      </label>
                      <input type="checkbox" id="switch1" className="switch__input"  onClick={ this.showAvailFlightsInThreeHour } />
                    </div>

                  </div>
                </div>

                {/* <hr className="divider-line" style={{ borderTop: "1px solid #9b9696" }} /> */}
                <hr style={{ borderTop: "1px solid #9b9696" }} />

                <div className="row option  dimmed">
                  <div className="col">NOTES</div>
                </div>
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
                <hr style={{ borderTop: "1px solid #9b9696" }} />

                <div className="row option  dimmed">
                  <div className="col">COST BASED DELAY OPTIONS</div>
                </div>
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
                <div className="row margin-high"></div>

                
{/*  */}
                <div className="row option">
                    <div className="col-6">
                      <button type="button" className="btn btn-block cost">
                        <bigfont className="big-font"> 0 min </bigfont> 
                      <br/> 
                      <smallfont className="small-font">21,768.00 SGD</smallfont>
                    </button>
                  </div>
                    <div className="col-6">
                      <button type="button" className="btn btn-primary btn-block"> 
                        <bigfont className="big-font"> +30 min </bigfont> 
                          <br/> 
                        <smallfont className="small-font">61,742.00 SGD </smallfont>
                      </button>
                    </div>
                  </div>
          
                  <div className="row margin-high">
                    <button type="button" className="btn btn-block details" style={{ width: "96%" }}>
                        <medfont className="med-font"> SHOW DETAILS </medfont> 
                  </button>
                  </div>

{/*  */}


                <hr
                  style={{ borderTop: "1px solid #9b9696", marginTop: "25px" }}
                />

                <div className="row arrival dimmed">
                  <div className="col">RETURN</div>
                  <div className="col">STD</div>
                  <div className="col">MGT</div>
                  <div className="col">
                    <h6>
                      <span className="badge badge-danger">AGT</span>
                    </h6>
                  </div>
                </div>

                <div className="row med-level-up-font">
                  {/* <div className="col">SQ 529</div>
                    <div className="col">23:15</div>
                    <div className="col">1:00h</div>
                    <div className="col">0:50h</div> */}
                  <center style={{ fontSize: "14px", marginLeft: "35%" }}>
                    {" "}
                    <i>coming soon</i>
                  </center>
                </div>
              </div>

              <div className="card-footer">
                <div className="row inbound">
                  <div className="col" style={{ fontSize: "18px" }}>
                    &nbsp;&nbsp;INBOUND FLIGHTS
                  </div>
                </div>
              </div>

              <div className="card text-white mb-1" style={{ width: "365px" }}>
                <div className="card-header inbound" style={{ background:  selectedFlight.status.misconnection ? '#E55541' : '#0284f7' }}>
                  <div className="row med-level-down-font">
                    <div className="col"></div>
                    <div className="col"></div>
                  </div>
                </div>
                <div className="card-body inbound-time">
                  <div className="row med-level-down-font">
                    <div className="col"></div>
                    <div className="col"></div>

                    <div className="col bay-gate"> </div>
                  </div>

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
                  <cust
                    style={{
                      color: "#ece6e6",
                      fontSize: "12px",
                      marginTop: "15px"
                    }}
                  ></cust>
                </div>
              </div>
{/*  */}
              <div className="card text-white mb-1" style={{width: "365px"}}>
              <div className="card-header inbound">
                <div className="row med-level-down-font">
                  <div className="col">&nbsp;&nbsp;&nbsp;&nbsp;<b>LH 758</b></div>
                  <div className="col"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; F0 &nbsp;&nbsp; J3 &nbsp;&nbsp; S0 &nbsp;&nbsp; Y1</div>
                </div>
              </div>
              <div className="card-body inbound-time">
                <div className="row med-level-down-font">
                  <div className="col">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ETA <lightfont style={{fontWeight: "lighter"}}> &nbsp;&nbsp;23:35 &nbsp;&nbsp;|</lightfont></div>
                  <div className="col">MCT <lightfont style={{fontWeight: "lighter"}}> &nbsp;&nbsp; 20 min </lightfont></div>
                  
                  <div className="col bay-gate"> T2/F32 </div>
                </div>
          
                <hr style={{ borderTop: "1px solid #9b9696",marginTop:"10px" }}/>
                
                <span className="dot"></span> &nbsp;&nbsp;
                <cust style={{ color:"#ece6e6",fontSize: "12px",marginTop:"15px"}}>VIP Foreign Minister Of India</cust>
          
              </div>
          </div>
{/*  */}          
            </div>
          </div>
          {/* <div className="overlay-arrow">
            <i
              className="big arrow alternate circle down outline icon"
              onClick={this.off}
              style={{ color: "#fff" }}
            ></i>
          </div> */}

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
  return { selectedFlightObj: state.selectedFlight };
};


export default connect(mapStateToProps, {
  showFocusViewForSelectedFlight,
  removeFocusViewForSelectedFlight,
  getFlightDataForOutBound
})(FocusView);
