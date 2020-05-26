import React from "react";
import logo from "../../images/Group@2x.svg"; // Tell Webpack this JS file uses this image
import "./header.scss";
import { connect } from "react-redux";
import { fetchAppData } from "../../actions";


class Header extends React.Component {
  addZero = hour => {
    if (hour < 10) {
      hour = "0" + hour;
    }
    return hour;
  };

  state = {
    time: `${this.addZero(new Date().getHours())} : ${this.addZero(
      new Date().getMinutes()
    )}`,
    alerts: [1, 2]
  };

  enableAlertView = () => {
    return (
      <i className="circle-icon-wrap">
        <i className="mini circle icon"></i>
      </i>
    );
  };

  componentDidMount() {
    // Get the App Data for the Banner from Store
    this.props.fetchAppData();
    this.setTime();
    // Set the state of Date in the Banner
    setInterval(() => {
      this.setTime();
    }, 60000);
  };

  setTime = () => {
    const nowDate = new Date();
      this.setState({
        time: `${this.addZero((nowDate.getHours()-8))} : ${this.addZero(
          nowDate.getMinutes()
        )}`
      });
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-light justify-content-between">
          <p className="pa-co-pax-conn-x-opt">
            <img alt="sia-logo" className="img sia-logo" src={logo} />
            &nbsp;&nbsp;{" "}
            <a className="line-2-copy-1" href="#">
              {/* to avoid warning */ ""}
            </a>{" "}
            &nbsp; &nbsp; PaCo -{this.props.appData.name}
          </p>
          <div className="clock-time">
            <div style={{ float: "left" }}>
              <i className="bell outline icon"></i>
              {this.state.alerts.length !== 0 ? this.enableAlertView() : ""}
              &nbsp;
            </div>
            <div style={{ float: "right" }}>
              <a className="line-2-copy-1" href="#">
                {/* to avoid warning */ ""}
              </a>
              &nbsp; {this.state.time}
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { appData: state.appData };
};

export default connect(mapStateToProps, { fetchAppData })(Header);
