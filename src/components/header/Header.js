import React from "react";
import logo from "../../images/Group@2x.svg"; // Tell Webpack this JS file uses this image
import "./Header.css";

class Header extends React.Component {
  addZero = hour => {
    if (hour < 10) {
      hour = "0" + hour;
    }
    return hour;
  };

  state = {
    time: `${this.addZero(new Date().getHours())} : ${new Date().getMinutes()}`,
    alerts: [1,2]
  };

  enableAlertView = () => {
    return (
      <i className="circle-icon-wrap">
        <i className="mini circle icon"></i>
      </i>
    );
  };

  componentDidMount() {
    setInterval(() => {
      const nowDate = new Date();
      this.setState({
        time: `${this.addZero(nowDate.getHours())} : ${nowDate.getMinutes()}`
      });
    }, 5000);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light justify-content-between">
          <p className="pa-co-pax-conn-x-opt" href="#">
            <img alt="sia-logo" className="img sia-logo" src={logo} />
            &nbsp;&nbsp; <a className="line-2-copy-1"></a> &nbsp; &nbsp; PaCo -
            Pax ConnX Optimiser
          </p>
          <div className="clock-time">
            <div style={{ float: "left" }}>
              <i className="bell outline icon"></i>
              {this.state.alerts.length !== 0 ? this.enableAlertView() : ""}
              &nbsp;
            </div>
            <div style={{ float: "right" }}>
              <a className="line-2-copy-1"></a> &nbsp; {this.state.time}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
