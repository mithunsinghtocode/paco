import React from "react";
import "./Filter.scss";

class Filter extends React.Component {
  render() {
    return (
      <div>
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
        </nav>
      </div>
    );
  }
}

export default Filter;
