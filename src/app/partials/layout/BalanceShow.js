import React from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {bindActionCreators} from 'redux';
//import image
import PigBIcon from 'assets/callburn/images/images/pig-icon@3x.svg';
class TimeShow extends React.Component {
  render() {
    return (
            <Link 
                style = {{display:"flex", 
                        alignItems:"center",
                        fontSize: "20px",
                        color:"#3190e6",
                        marginRight:"10px"
                        }}
                 to = "/financials"
            >
                <img src = {PigBIcon} alt = "" style = {{height:"20px"}}/>
                <span> {" " + this.props.userBalance != undefined && this.props.userBalance!=null ? this.props.userBalance.toFixed(2):""}</span>
            </Link>
      );
  }
}

export default connect(
    state => ({
       userBalance: state.user.userData.balance
    }),
    null
  )(TimeShow);