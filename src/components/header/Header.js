import React from "react";
import logo from "../../images/Group@2x.svg"; // Tell Webpack this JS file uses this image
import logoInvision from "../../images/logoInvision.svg"; // Tell Webpack this JS file uses this image
import notificationsBell from "../../images/notifications.svg"; // Tell Webpack this JS file uses this image
import "./Header.scss";
import { connect } from "react-redux";
import { fetchAppData } from "../../actions";


class Header extends React.PureComponent {
  addZero = hour => {
    console.log(hour)
    if (hour < 10) {
      hour = "0" + hour;
    }
    return hour;
  };

  state = {
    time: `${this.addZero(new Date().getUTCHours())} : ${this.addZero(
      new Date().getMinutes()
    )}`,
    alerts: [1, 2]
  };

  enableAlertView = () => {
    return (
      <i className="circle-icon-wrap">
        {/* <i className="mini circle icon"></i> */}
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
        time: `${this.addZero((nowDate.getUTCHours()))} : ${this.addZero(
          nowDate.getMinutes()
        )}`
      });
  };

  render() {
    return (
      <>
        <nav className="navbar navbar-light justify-content-between">
          <div className="pa-co-pax-conn-x-opt">          
            <div className="sia-logo">
              <img alt="sia-logo" className="img sia-logo" src={logoInvision} />                          
            </div>          
            <a className="line-2-copy-1" href="#">
              {/* to avoid warning */ ""}
            </a>          
            <div className="project-title">                
                PaCo -{this.props.appData.name}
            </div>
            
          </div>
          <div className="clock-time">            
            <div className="notification-bell-component" >
              {/* <i className="bell outline icon"></i> */}
              <img alt="notification-bell" className="bell outline icon" src={notificationsBell} />        
              {this.state.alerts.length !== 0 ? this.enableAlertView() : ""}              
            </div>
            <a className="line-2-copy-1" href="#">
                {/* to avoid warning */ ""}
              </a>              
            <div className="current-time" >
                {this.state.time}
            </div>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { appData: state.appData };
};

export default connect(mapStateToProps, { fetchAppData })(Header);
