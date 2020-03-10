import React from "react";
import "./Filter.scss";

class Filter extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-light justify-content-between filter">
        <div style={{ marginLeft: "30%" }}>
          <div className="switch">
            <input type="checkbox" id="switch1" className="switch__input" />
            <label htmlFor="switch1" className="switch__label">
              Potential misconnection only

           &nbsp; <a className="line-2-copy-1" href="#">
                {/* to avoid warning */ ""}
              </a>
            </label>
          </div>
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
