import React from "react";
import { connect } from "react-redux";
import "./filter.scss";

export class Filter extends React.Component {
  renderBackButton(){
    return (<button className="rectangle" onClick={this.props.goBackFunction}>
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
          &nbsp; BACK </button>
          );
  }
  render() {
    return (
      <div>
      {this.props.displayView === "INBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
        {this.props.fltToDisplayInMap !== null && this.renderBackButton()}
          
          <div className="div-switch">
            <div className="switch">
              <input type="checkbox" id="switch1" className="switch__input" />
              <label htmlFor="switch1" className="switch__label">
                Potential misconnection only
              </label>
            </div>
            &nbsp; <div className="vl"></div>
            <div className="switch">
              <input type="checkbox" id="switch2" className="switch__input" />
              <label htmlFor="switch2" className="switch__label">
                Arriving within next 3 hours
              </label>
            </div>
          </div>
        </nav> }

        {this.props.displayView === "OUTBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
          <div className="div-switch">
            <div className="switch">
              <input type="checkbox" id="switch1" className="switch__input" />
              <label htmlFor="switch1" className="switch__label">
                Hide Handled flight
              </label>
            </div>
            &nbsp; <div className="vl"></div>
            <div className="switch">
              <input type="checkbox" id="switch2" className="switch__input" />
              <label htmlFor="switch2" className="switch__label">
                Departure within next 3 hours
              </label>
            </div>
          </div>
        </nav> }
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  console.log(ownprops.goBackFunction);
  return { displayView: state.getDisplayView, goBackFunction : ownprops.goBackFunction, fltToDisplayInMap : state.getFltToShowInMap };
};

export default connect(mapStateToProps)(Filter);
