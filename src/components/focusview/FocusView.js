import React from "react";
import "./focusView.scss";
import { connect } from "react-redux";
import {
  showFocusViewForSelectedFlight,
  removeFocusViewForSelectedFlight
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

  getPaxDetailsFormat = selectedFlight => {
    return (
      this.frameCabinClass("F", selectedFlight.paxCountVo.fclassCnt) +
      this.frameCabinClass("J", selectedFlight.paxCountVo.jclassCnt) +
      this.frameCabinClass("S", selectedFlight.paxCountVo.sclassCnt) +
      this.frameCabinClass("Y", selectedFlight.paxCountVo.yclassCnt)
    );
  };

  frameCabinClass = (cabinClass, count) =>
    Number(count) > 0 ? ` ${cabinClass}${count}` : "";

  renderSelectedFlightInFocusView = () => {
    //console.log("Into Focus View");
    let selectedFlight = this.props.selectedFlightObj;
    if (selectedFlight != null) {
      console.log(selectedFlight);

      return (
        <div id="showHide">
          <div id="overlay">
            <div className="card text-white mb-3">
              <div className="card-header" style={{ background:  selectedFlight.status.misconnection ? '#E55541' : '#0284f7' }}>{selectedFlight.fltNum}</div>

              <div className="card-body" style={{ marginLeft: "10px" }}>
                <div className="row">
                  <div className="col-2 col-md-3">STD</div>
                  <div className="col-1 col-md-3">GATE</div>
                  <div className="col-3 col-md-5">PAX</div>
                </div>
                <div className="row value">
                  <div className="col-2 col-md-3">
                    {getHoursAndMinutesAfterFormat(selectedFlight.std)}
                  </div>
                  <div className="col-1 col-md-3">
                    {this.getBayGateTerminalDetails(selectedFlight)}
                  </div>
                  <div className="col-3 col-md-5">
                    {this.getPaxDetailsFormat(selectedFlight)}
                  </div>
                </div>

                <div className="row arrival">
                  <div className="col-2 col-md-3">STA</div>
                  <div className="col-1 col-md-3">ETA</div>
                  <div className="col-3 col-md-5">AVAIL. FLIGHTS IN 3 HRS</div>
                </div>

                <div className="row value" style={{ fontSize: "20px" }}>
                  <div className="col-2 col-md-3">
                    {getHoursAndMinutesAfterFormat(selectedFlight.sta)}
                  </div>
                  <div className="col-1 col-md-3">
                    {getHoursAndMinutesAfterFormat(selectedFlight.eta)}
                  </div>
                  <div
                    className="col-3 col-md-5"
                    style={{ fontSize: "14px", marginTop: "6px" }}
                  >
                    <i>Coming Soon</i>
                  </div>
                </div>

                <hr style={{ borderTop: "1px solid #9b9696" }} />

                <div className="row option">
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
                {/* <div className="row option">
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
                  </div> */}

                <hr
                  style={{ borderTop: "1px solid #9b9696", marginTop: "25px" }}
                />

                <div className="row arrival">
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

              {/* <div className="card text-white mb-1" style={{width: "365px"}}>
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
          </div> */}
            </div>
          </div>
          <div className="overlay-arrow">
            <i
              className="big arrow alternate circle down outline icon"
              onClick={this.off}
              style={{ color: "#fff" }}
            ></i>
          </div>
        </div>
      );
    } else {
      return <div></div>;
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
  removeFocusViewForSelectedFlight
})(FocusView);
