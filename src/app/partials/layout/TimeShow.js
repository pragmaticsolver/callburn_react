import React from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
//import image
import TimeIcon from 'assets/callburn/images/images/TimeZoneIcon.svg';
class TimeShow extends React.Component {
  render() {
    return (
        <div 
            style = {{display:"flex", 
                     alignItems:"center",
                     fontSize: "20px",
                     color:"#3190e6"
                    }}
        >
            <img src = {TimeIcon} alt = "" style = {{height:"20px"}}/>
            <span> {" " + this.props.currentTime}</span>
        </div>
      );
  }
}

export default connect(
    state => ({
       currentTime: state.user.currentTime 
    }),
    null
  )(TimeShow);