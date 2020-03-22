import React from "react";
import { connect } from "react-redux";
import "./filter.scss";

class Filter extends React.Component {
  render() {
    return (
      <div>
      {this.props.displayView === "INBOUND" &&
        <nav className="navbar navbar-light justify-content-between filter">
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
  return { displayView: state.getDisplayView };
};

export default connect(mapStateToProps)(Filter);
