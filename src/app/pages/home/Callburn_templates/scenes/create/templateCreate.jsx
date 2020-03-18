import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import react material ui components
import Button from '@material-ui/core/Button';
//import custom components
import ImageSelectorButton from './components/imageSelectorButton/imageSelectorButton';
import SelectItem from '../../../components/SelectItem/SelectItem';
//import images
import CallMessageImage from 'assets/images/reactImg/callMessage.jpg';
import SmsImage from 'assets/images/reactImg/sms.jpg';
import PhoneBackgroundImg from 'assets/images/reactImg/phone_back1.png';
//import styles;
import './templateCreate.scss';
//import actions;
import {showModal} from '../../../modals/modalConductorActions';
class TemplateCreatePage extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            messageType: -1,
            smsMessage:"",
            selectedItemsId: new Set()
        }
        this.messageChange = this.messageChange.bind(this);
    }
    messageChange = (event) => {
        this.setState({
            smsMessage:event.target.value
        })
    }
    setSelectItem = (id) => {
        
        if(this.state.selectedItemsId.has(id)){
            let temp = this.state.selectedItemsId;
            temp.delete(id);
            this.setState({
                selectedItemsId: temp
            })
        } else {
            this.props.templateActions.showModal("ACTIVATE_REPLAY_INTERACTION");
            let temp = this.state.selectedItemsId;
            temp.add(id);
            this.setState({
                selectedItemsId: temp
            })
        }
    }
    render(){
        return(
            <div>
                <h3>Create new template</h3>
                <div className = "type-select-area">
                    <div className = "item"
                        onClick = {()=>{
                            this.setState({
                                messageType:0
                            })
                        }}
                    >
                        <ImageSelectorButton imageUrl = {CallMessageImage} 
                                             title = "Call Message" 
                                             selected = {
                                                 this.state.messageType == 0? true : false
                                             }
                        />
                    </div>
                    <div className = "item"
                        onClick = {()=>{
                            this.setState({
                                messageType:1
                            })
                        }}
                    >
                        <ImageSelectorButton imageUrl = {SmsImage} 
                                             title = "SMS"
                                             selected = {
                                                this.state.messageType == 1? true : false
                                            }
                        />
                    </div>
                </div>
                <div className = "content-area">
                        {
                            this.state.messageType == 0 ? (
                                <div className = "vm-area">
                                    <div className = "check-section">
                                        <div className = "check-area">
                                            <div onClick = {()=> {this.setSelectItem(0)}}><SelectItem label = "Replay callmessage" choose_IDs = {this.state.selectedItemsId} id = {0}/></div>
                                            <div onClick = {()=> {this.setSelectItem(1)}}><SelectItem label = "Call Live Transfer" choose_IDs = {this.state.selectedItemsId} id = {1}/></div>
                                            <div onClick = {()=> {this.setSelectItem(2)}}><SelectItem label = "Call me back" choose_IDs = {this.state.selectedItemsId} id = {2}/></div>
                                            <div onClick = {()=> {this.setSelectItem(3)}}><SelectItem label = "Blacklist me" choose_IDs = {this.state.selectedItemsId} id = {3}/></div>
                                        </div>
                                    </div>
                                </div>   
                            ):(null)
                        }
                        {
                            this.state.messageType == 1 ? (
                                <div className = "sms-area">
                                    <div className = "message-typing-area">
                                        <textarea placeholder = "Write message text here, including optional interactions instructions (ej: press 1 to contact with us)"
                                            value = {this.state.smsMessage}
                                            onChange = {this.messageChange}
                                        ></textarea>
                                        <div>
                                            Characters count : {this.state.smsMessage.length}
                                        </div>
                                        <Button variant = "contained" color = "primary"> Confirm and select the content</Button>
                                    </div>
                                    <div className = "message-preview-area">
                                        <img src = {PhoneBackgroundImg} alt = ""/>
                                        <div className = "label-view-area">
                                            {this.state.smsMessage}
                                        </div>
                                     </div>
                                </div> 
                            ):(null)
                        }
                </div>
            </div>
        )
    }
}
export default connect(
    null,
     dispatch => ({
         templateActions: bindActionCreators(
             { showModal },
             dispatch
         )
     })
   )(TemplateCreatePage);;