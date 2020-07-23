import React from "react";
import logo from "../../images/Group@2x.svg"; // Tell Webpack this JS file uses this image
import logoInvision from "../../images/logoInvision.svg"; // Tell Webpack this JS file uses this image
import notificationsBell from "../../images/notifications.svg"; // Tell Webpack this JS file uses this image
import "./Header.scss";
import { connect } from "react-redux";
import { fetchAppData } from "../../actions";
import { setTestState, setTestDateTimeStamp } from "../../actions/chartDataAction";
import { getCurrentTimeInUTC } from "../../utils/dateUtils";


class Header extends React.PureComponent {
  addZero = hour => {
    if (hour < 10) {
      hour = "0" + hour;
    }
    return hour;
  };

  state = {
    time: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getHours())} : ${this.addZero(
      new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getMinutes()
    )}`,
    hours: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getHours())}`,
    minutes: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getMinutes())}`,
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
      this.setTime(this.props.isTest);
    }, 60000);

    
  };
//15/03/2020 13:54:00
  setTime = (isTest) => {

    Date.prototype.addMinutes = function(h) {
      this.setMinutes(this.getMinutes()+1);
      return this;
    }
    let testDateTime = this.props.testTime;
    let updatedTestTime = testDateTime && new Date(new Date(testDateTime.year, testDateTime.mon-1, testDateTime.dd, testDateTime.hh, testDateTime.mm, testDateTime.ss, 0).addMinutes().getTime());

    let updatedTestTimeObj = updatedTestTime &&  {year: updatedTestTime.getYear()+1900, mon:updatedTestTime.getMonth()+1, dd:updatedTestTime.getDate(), hh:updatedTestTime.getHours(), mm:updatedTestTime.getMinutes(), ss:updatedTestTime.getSeconds()};

    updatedTestTimeObj && this.props.setTestDateTimeStamp(updatedTestTimeObj);
    updatedTestTime ? this.setState({
        time: `${this.addZero(updatedTestTime.getHours())} : ${this.addZero(
          updatedTestTime.getMinutes()
        )}`
      }) : this.setState({
        time: `${this.addZero(new Date(getCurrentTimeInUTC(isTest, testDateTime)).getHours())} : ${this.addZero(
          new Date(getCurrentTimeInUTC(isTest, testDateTime)).getMinutes()
        )}`
      });
      updatedTestTime ?  this.setState({ 
          hours: `${this.addZero(updatedTestTime.getHours().getHours())}`,
          minutes: `${this.addZero(updatedTestTime.getHours().getMinutes())}`
        }) : 
        this.setState({ 
          hours: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getHours())}`,
          minutes: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getMinutes())}`
        });
  };

  setTestState = () => {
    let isTest = document.getElementById("switch5").checked;
    let testDate = document.getElementById("testdate").value;
    let dd;
    let mon;
    let year;
    let hh;
    let mm;
    let ss;
    if(testDate && testDate.length === 19){
    let inDate = testDate && testDate.split("/");
      dd = inDate[0];
      mon = inDate[1];
      let yearTime = inDate[2].split(" ");
      year = yearTime[0];
      let inTime = yearTime[1].split(":");
        hh = inTime[0];
        mm = inTime[1];
        ss = inTime[2];
    };
    let dateTimeStamp = (testDate && testDate.length===19) ? {dd, mon, year, hh, mm, ss}: undefined;
    this.props.setTestState(isTest);
    dateTimeStamp && this.props.setTestDateTimeStamp(dateTimeStamp);
    this.setState({
      time: `${this.addZero(new Date(getCurrentTimeInUTC(isTest, dateTimeStamp)).getHours())} : ${this.addZero(
        new Date(getCurrentTimeInUTC(isTest, dateTimeStamp)).getMinutes()
      )}`
    });
    this.setState({ 
      hours: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getHours())}`,
      minutes: `${this.addZero(new Date(getCurrentTimeInUTC(this.props.isTest, this.props.testTime)).getMinutes())}`
    });
  }

  enableField = () => {
    let eltest = document.getElementById("testdate");
    eltest.disabled = false;
    eltest.setAttribute("disabled", false);
  }

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
                PaCo
            </div>
            <div className="test-area" style={{border: "1px solid white", marginTop:"0px",paddingBottom:"45px", paddingRight:"40px"}}>
            <div className="test-area">Enable Test</div>
          <div className="switch" style={{display:"inline-block", marginTop:"12px", marginLeft: "15px"}}>         
          <input type="checkbox" id="switch5" className="switch__input" onClick = { this.setTestState }/>
              <label htmlFor="switch5" className="switch__label">
              </label>
            </div>

            <div className="test-area">Enter Test Date</div>
          <div className="switch" style={{display:"inline-block", marginTop:"10px", marginLeft: "15px"}}>         
              <input type="text" id="testdate" className="form-control form-control-sm" placeholder="dd/mm/yyyy hh:mm:ss"/>
              {/* onClick={this.enableField} disabled="true" value="15/03/2020 13:54:00"  */}
          </div>
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
                {/* {this.state.time}  */}
                {this.state.hours}<span class="blinking"> : </span> {this.state.minutes}
            </div>
          </div>
        </nav>
      </>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { appData: state.appData, isTest: state.isTest, testTime : state.testTime};
};

export default connect(mapStateToProps, { fetchAppData, setTestState, setTestDateTimeStamp })(Header);
