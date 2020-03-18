import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import style
import './Numpad.scss';
//import actions;
import { setReplay , setCallback, setBlock, setTransfer } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
class Numpad extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            selected_id: "-1"
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.renderClassName = this.renderClassName.bind(this);
    }
    handleSelect = (number) =>{
        if(number!= "")
        {
            if(this.renderClassName(number) == "item disabled") return;
            else{
                if(this.props.interactionDigitName == "replyInteractionDigit"){
                    this.props.composeActions.setReplay({flag:true, digit:number});
                } else if(this.props.interactionDigitName == "callMeBackInteractionDigit"){
                    this.props.composeActions.setCallback({flag:true, digit:number});
                } else if(this.props.interactionDigitName == "blockListMeInteractionDigit"){
                    this.props.composeActions.setBlock({flag:true, digit:number});
                } else { //transfer
                    this.props.composeActions.setTransfer({flag:true, digit:number});
                }
            }
        }
    }
    renderClassName = (digit) =>{
        if(this.props.interactionDigitName == "replyInteractionDigit"){
            if(this.props.replay_digit == digit) return "item selected";
            else if(this.props.callback_digit == digit || this.props.do_not_call_digit == digit || this.props.transfer_digit == digit) return "item disabled";
            else return "item";
        } else if(this.props.interactionDigitName == "callMeBackInteractionDigit"){
            if(this.props.callback_digit == digit) return "item selected";
            else if(this.props.replay_digit == digit || this.props.do_not_call_digit == digit || this.props.transfer_digit == digit) return "item disabled";
            else return "item";
        } else if(this.props.interactionDigitName == "blockListMeInteractionDigit"){
            if(this.props.do_not_call_digit == digit) return "item selected";
            else if(this.props.replay_digit == digit || this.props.callback_digit == digit || this.props.transfer_digit == digit) return "item disabled";
            else return "item";
        } else { //transfer
            if(this.props.transfer_digit == digit) return "item selected";
            else if(this.props.replay_digit == digit || this.props.callback_digit == digit || this.props.do_not_call_digit == digit) return "item disabled";
            else return "item";
        }
    }
    render(){
        const numbers = ["1","2","3","4","5","6","7","8","9","","0",""];
        return(
            <div className = "numpad-area">
                <div className = "title-area">
                    {this.props.title}
                </div>
                <div className = "pad-area">
                    {
                        numbers.map((number,index)=>(
                            <div key = {index } id = {number} onClick = {()=>this.handleSelect(number)} className = {this.renderClassName(number)}><div className = "number">{number}</div></div>
                        ))
                    }
                    
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        callback_digit: state.compose.callback_digit,
        do_not_call_digit: state.compose.do_not_call_digit,
        replay_digit: state.compose.replay_digit,
        transfer_digit: state.compose.transfer_digit,
    }),
    dispatch => ({
      composeActions: bindActionCreators({ setReplay , setCallback, setBlock, setTransfer }, dispatch)
    })
  )(Numpad);
  