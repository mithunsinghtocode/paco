import React from "react";
import { connect } from "react-redux";

import "./sideMenu.scss";
import { switchFlightsViewByInBoundOrOutbound, userClick } from "../../actions/chartDataAction";

class SideMenu extends React.Component {

  componentDidMount(){
    this.selectButtonView(this.props.displayView);
  }

  selectButtonView = (inValue) => {
    let inboundButton = document.getElementById('INBOUND');
    let outboundButton = document.getElementById('OUTBOUND');
    this.props.userClick(true);
    switch(inValue) {
      case "INBOUND":
          this.props.switchFlightsViewByInBoundOrOutbound("INBOUND");
          outboundButton.style.borderRight= "0px";
          inboundButton.style.borderRight = "4px solid #00DC88";
          break;
      case "OUTBOUND":
        this.props.switchFlightsViewByInBoundOrOutbound("OUTBOUND");
          inboundButton.style.borderRight = "0px";
          outboundButton.style.borderRight = "4px solid #00DC88";
          break;
      default:
        this.props.switchFlightsViewByInBoundOrOutbound("INBOUND");
          inboundButton.style.borderRight = "4px solid #00DC88";
    }
  }

  toggleButton = e => {
    this.selectButtonView(e);
  };

  render() {
    return (
      <div className="overlay sidemenu" >
        <button className="ui toggle button rotate" onClick={e => this.toggleButton("INBOUND")} id="INBOUND" value="INBOUND">
          <div className="label-sidemenu" style={{marginTop: "50px"}}>INBOUND</div>
        </button>
        <button className="ui toggle button rotate1" onClick={e => this.toggleButton("OUTBOUND")} id="OUTBOUND" value="OUTBOUND"> 
        <div className="label-sidemenu">OUTBOUND</div>
        </button>
      </div>
    );
  };
}

const mapStateToProps = (state, ownprops) => {
  return { displayView: state.getDisplayView };
};

export default connect(mapStateToProps, { switchFlightsViewByInBoundOrOutbound, userClick })(SideMenu);
