import React from "react";
import "./sideMenu.scss";
import ReactDOM from 'react-dom';

class SideMenu extends React.Component {
  toggleButton = e => {
    console.log(e.target.value);
    let inboundButton = document.getElementById('INBOUND');
    let outboundButton = document.getElementById('OUTBOUND');

      switch(e.target.value) {
        case "INBOUND":
            outboundButton.style.borderBottom= "0px";
            inboundButton.style.borderBottom = "5px solid #87C039";
            break;
        case "OUTBOUND":
            inboundButton.style.borderBottom = "0px";
            outboundButton.style.borderBottom = "5px solid #87C039";
            break;
        default:
            console.log("sdfgasdgfs");
            inboundButton.style.borderBottom = "5px solid #87C039";
            //outboundButton.style.borderBottom = "5px solid #87C039";
        
      }

  };

  render() {
    return (
      <div className="overlay" style={{ display: "inline" }}>
        <button className="ui toggle button rotate" onClick={e => this.toggleButton(e)} id="INBOUND" value="INBOUND">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;INBOUND
        </button>
        <button className="ui toggle button rotate1" onClick={e => this.toggleButton(e)} id="OUTBOUND" value="OUTBOUND"> 
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OUTBOUND </button>
      </div>
    );
  }
}

export default SideMenu;
