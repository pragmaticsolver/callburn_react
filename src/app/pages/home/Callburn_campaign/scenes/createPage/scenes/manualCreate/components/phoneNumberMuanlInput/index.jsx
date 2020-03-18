import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Form, Spinner} from 'react-bootstrap';
import {Button} from '@material-ui/core';
import './style.scss';
import Trans from '../../../../../../../utils/Trans';
//import Actions;
import { addNumberManualy } from '../../../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
class InputNumberForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            phoneNumbers : [],
            number: ""
        }
        this.phoneNumbers = [];
    }
    render(){
        return(
            <div className = "manual-input-area">
                <div className = "manual-input-wrapper">
                    <p>
                        <Trans id = "campaign_compose_compose_step_2_type_recipients"/>
                    </p>
                    <div className = "wrapper1_1">
                        <Form style = {{width:"100%"}}>
                                <Form.Group style = {{padding:"10px", border:"1px solid #f1eaea", padding:"10px"}}>
                                    <div style = {{display:"inline-block"}}>
                                        {
                                            this.props.phonenumbers_status && this.props.phonenumbers_status.length > 0 && this.props.phonenumbers_status.map((number, index) => (
                                                <div className = {number.status === "success" ? "number-item" : "number-item unsupported"} key = {index}>
                                                    {
                                                        number.number
                                                    }
                                                    <span className = "close-btn"
                                                        onClick = {()=>{
                                                            if(this.props.manualinputLoading) return;
                                                            for( var i = 0; i < this.phoneNumbers.length; i++){ 
                                                                if ( this.phoneNumbers[i] === number.number) {
                                                                     this.phoneNumbers.splice(i, 1)
                                                                }
                                                             }
                                                             var params = {
                                                                all_contacts: this.props.all_contacts != null?this.props.all_contacts: false,
                                                                data: this.phoneNumbers,
                                                                file_id: this.props.file_id?this.props.file_id:"",
                                                                is_campaign_create: true,
                                                                sms_text: this.props.message_content != null?this.props.messageType:"",
                                                                type: this.props.messageType?this.props.messageType:""
                                                            }
                                                            this.props.Actions.addNumberManualy(params);
                                                        }}
                                                    >×</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <Form.Control placeholder = "Add phone numbers..."
                                        onChange = {(e)=>{
                                            this.setState({
                                                number:e.target.value
                                            })
                                        }}
                                        type = "number"
                                    />
                                </Form.Group>
                        </Form>
                        <Button variant = "contained" color = "secondary"
                            onClick = {()=>{
                                if(this.phoneNumbers.includes(this.state.number) || this.props.manualinputLoading) return;
                                this.phoneNumbers.push(this.state.number);
                                var params = {
                                    all_contacts: this.props.all_contacts != null?this.props.all_contacts: false,
                                    data: this.phoneNumbers,
                                    file_id: this.props.file_id?this.props.file_id:"",
                                    is_campaign_create: true,
                                    sms_text: this.props.message_content != null?this.props.messageType:"",
                                    type: this.props.messageType?this.props.messageType:""
                                }
                                this.props.Actions.addNumberManualy(params);
                            }}
                        >
                            {
                                this.props.manualinputLoading == true ? (
                                    <Spinner animation = "border"/>
                                ):(
                                    <div>Add</div>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({
        messageType: state.compose.messageType,
        file_id : state.compose.file_id,
        message_content: state.compose.message_content,
        all_contacts: state.compose.all_contacts,
        phonenumbers_status: state.compose.phonenumbers_status,
        manualinputLoading: state.compose.manualinputLoading,
    }),
    dispatch => ({
        Actions: bindActionCreators({ addNumberManualy }, dispatch)
    })
  )(InputNumberForm);
  