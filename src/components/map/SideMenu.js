import React from "react";
import { connect } from "react-redux";

import "./sideMenu.scss";
import { switchFlightsViewByInBoundOrOutbound } from "../../actions/chartDataAction";

class SideMenu extends React.Component {

  componentDidMount(){
    this.selectButtonView(this.props.displayView);
  }

  selectButtonView = (inValue) => {
    let inboundButton = document.getElementById('INBOUND');
    let outboundButton = document.getElementById('OUTBOUND');
    switch(inValue) {
      case "INBOUND":
          this.props.switchFlightsViewByInBoundOrOutbound("INBOUND");
          outboundButton.style.borderBottom= "0px";
          inboundButton.style.borderBottom = "5px solid #00DC88";
          break;
      case "OUTBOUND":
        this.props.switchFlightsViewByInBoundOrOutbound("OUTBOUND");
          inboundButton.style.borderBottom = "0px";
          outboundButton.style.borderBottom = "5px solid #00DC88";
          break;
      default:
        this.props.switchFlightsViewByInBoundOrOutbound("INBOUND");
          inboundButton.style.borderBottom = "5px solid #00DC88";
    }
  }

  toggleButton = e => {
    this.selectButtonView(e.target.value);
  };

  render() {
    return (
      
      <div className="overlay sidemenu" style={{ height: "84.5% !important" }}>
        <button className="ui toggle button rotate" onClick={e => this.toggleButton(e)} id="INBOUND" value="INBOUND" style={{ textAlign : "left", marginBottom : "100px" }}>
          INBOUND 
        </button>
        <button className="ui toggle button rotate1" onClick={e => this.toggleButton(e)} id="OUTBOUND" value="OUTBOUND"> 
          OUTBOUND 
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  return { displayView: state.getDisplayView };
};

export default connect(mapStateToProps, { switchFlightsViewByInBoundOrOutbound })(SideMenu);
