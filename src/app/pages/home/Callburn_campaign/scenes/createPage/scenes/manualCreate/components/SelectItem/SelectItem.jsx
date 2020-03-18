import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {List, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import CachedIcon from '@material-ui/icons/Cached';
import PhoneCallBackIcon from '@material-ui/icons/PhoneCallback';
import LockIcon from '@material-ui/icons/Lock';
import './style.scss';
class SelectItem extends React.Component{
    constructor(props)
    {
        super(props);
    }
    renderClassname = () => {
        if(this.props.interactionDigitName == "replyInteractionDigit"){
            if(this.props.is_replay_active) return "selector-area-call-check selected1";
            else return "selector-area-call-check";
        } else if(this.props.interactionDigitName == "callMeBackInteractionDigit"){
            if(this.props.is_callback_active) return "selector-area-call-check selected1";
            else return "selector-area-call-check";
        } else if(this.props.interactionDigitName == "blockListMeInteractionDigit"){
            if(this.props.is_donotcall_active) return "selector-area-call-check selected1";
            else return "selector-area-call-check";
        } else { //transfer
            if(this.props.is_transfer_active) return "selector-area-call-check selected1";
            else return "selector-area-call-check";
        }
    }
    render(){
        return(
            <div className = {this.renderClassname()}>
                <List >
                    <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            {
                                this.props.interactionDigitName =="replyInteractionDigit"?(
                                    <PlayCircleOutlineIcon/>
                                ):(null)
                            }
                            {
                                // this.props.primary == "Call Live Transfer" Call me back Blacklist me
                            }
                            {
                                this.props.interactionDigitName =="liveTransferInteractionDigit"?(
                                    <CachedIcon/>
                                ):(null)
                            }
                            {
                                this.props.interactionDigitName =="callMeBackInteractionDigit"?(
                                    <PhoneCallBackIcon/>
                                ):(null)
                            }
                            {
                                this.props.interactionDigitName =="blockListMeInteractionDigit"?(
                                    <LockIcon/>
                                ):(null)
                            }
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={this.props.primary} secondary={this.props.secondary} />
                    </ListItem>
                </List>
            </div>
        )
    }
}
export default connect(
    state => ({
        is_callback_active: state.compose.is_callback_active,
        is_donotcall_active: state.compose.is_donotcall_active,
        is_replay_active: state.compose.is_replay_active,
        is_transfer_active: state.compose.is_transfer_active
    }),
    null
  )(SelectItem);
  