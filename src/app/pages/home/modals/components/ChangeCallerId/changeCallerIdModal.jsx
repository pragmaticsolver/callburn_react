import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPhoneInput from "react-phone-input-2";
import {toastr} from 'react-redux-toastr';
import {Spinner} from 'react-bootstrap';
//import material ui components;
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Table, TableHead, TableRow, TableCell,TableBody} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import ModalWrapper from '../../components/ModalWrapper';
//import style
//import actions
import {getUserData} from '../../../../../store/app_services/user/userAction';
import { setSenderName, setCallerId } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import { hideModal } from '../../modalConductorActions';
import Trans from '../../../utils/Trans';
//
import { sendVerificationCode, addCallerId } from '../../../../../store/app_services/campaignCompose/campaignComposeApi';
class ChangeCallerIdModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       type : "",
       sender_name: this.props.compose.senderName,
       caller_id : this.props.compose.callerId,
       addCallerIdModal: false,
       addingCallerId:"",
       sendCodeBtnShow: false,
       sendCodeLoading: false,
       sendCodeResult: false,
       verificationCode: "",
       addCallerIDLoading: false,
    }
  }

  sendCode = async () =>{
    var _phone = this.state.addingCallerId.replace(/[(]/g, '').replace(/[)]/g, '').replace(/[-]/g, '').replace(/\s/g, '');
    this.setState({
      sendCodeLoading: true
    })
    await sendVerificationCode({
      phonenumber: _phone
    }).then((data) => {
      if(data.resource.error.no === 0)
      {
        this.setState({
          sendCodeLoading: false,
          sendCodeResult:  true
        })
      } else {
        toastr.error("Error", data.resource.error.text);
        this.setState({
          sendCodeLoading: false,
          sendCodeResult: false
        })
      }
       
    })
  }
  addCallerID = async () => {
    var _phone = this.state.addingCallerId.replace(/[(]/g, '').replace(/[)]/g, '').replace(/[-]/g, '').replace(/\s/g, '');
    if(_phone[0] === "+") _phone = _phone.substr(1);
    this.setState({
      addCallerIDLoading: true
    })
    await addCallerId({
      phonenumber: _phone,
      voice_code: this.state.verificationCode
    }).then(data => {
      if(data.resource.error.no === 0)
      {
        this.setState({
          addCallerIDLoading: false,
          addCallerIdModal: false,
          verificationCode: "",
          addingCallerId : null,
          sendCodeResult: false
        }, ()=>{
          this.props.Actions.getUserData();
        })
      } else {
        toastr.error("Error", data.resource.error.text)
        this.setState({
          addCallerIDLoading: false,
        })
      }
    })
  }
  changeCallerId = () => {
    if(this.props.compose.messageType === "VOICE_MESSAGE" || this.props.compose.messageType === "VOICE_WITH_SMS")
    {
       if(this.state.caller_id !== "" && this.state.caller_id !== null && this.state.caller_id !== undefined)
       {
         this.props.Actions.setCallerId(this.state.caller_id);
       }
    }
    if(this.props.compose.messageType === "SMS" || this.props.compose.messageType === "VOICE_WITH_SMS")
    {
      if(this.state.sender_name !=="" && this.state.sender_name !== null && this.state.sender_name !== undefined)
      {
        this.props.Actions.setSenderName(this.state.sender_name);
      }
    }
    this.props.modalActions.hideModal();
  }
  render() {
    return (
      <ModalWrapper
        title=  {(<Trans id = "modal_title_change_caller_id"/>)}
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        okText = {(<Trans id = "button_use_chosen_caller_id"/>)}
        toggle = {false} 
        onOk = {this.changeCallerId}
      >
         <Box style = {{fontWeight:"bold", fontSize:"1.2rem", padding:"10px 0px", color:"black"}}>
           <Trans id = "change_caller_id_modal_text_choose_a_different"/>
         </Box>
         {
           this.props.compose.messageType === "VOICE_MESSAGE" || this.props.compose.messageType === "VOICE_WITH_SMS" ? (
            <Box>
                <Box style = {{color:"#3190e6"}}>
                  <Box><Trans id = "change_caller_id_vm"/></Box>
                  <Box><Button variant = "contained" color = "primary" size = "small" 
                    onClick = {()=>{
                        this.setState({
                          addCallerIdModal: !this.state.addCallerIdModal
                        })
                    }}
                  ><Trans id = "modals_settings_settings_modal_add_new_caller_id"/></Button></Box>
                 </Box>
                 {
                   this.state.addCallerIdModal && (
                     <Box style = {{
                       padding:"10px",
                       backgroundColor:"#f1eeee",
                       color:"black",
                       border:"1px solid #dad9d9",
                       marginTop:"10px",
                       borderRadius:"5px"
                     }}>
                         <Box style = {{textAlign:"center", fontSize:"1.2rem"}}><Trans id = "callerid_missing_title_1"/></Box>
                         <Box style = {{textAlign:"center"}}><Trans id = "callerid_missing_title_2"/></Box>
                         <Box>
                         <ReactPhoneInput
                            inputExtraProps={{
                              name: "phone",
                              required: true,
                              autoFocus: true
                            }}
                            defaultCountry={"it"}
                            value={this.state.addingCallerId}
                            onChange={(value) => {
                              this.setState({
                                addingCallerId: value
                              })
                            }}
                         />
                         </Box>
                         <Box>
                               <Button variant = "contained" color = "primary" size = "small"
                                  style = {{display:"flex", justifyContent:"center", alignItems:"center"}}
                                  onClick = {()=>{
                                     this.sendCode();
                                  }}
                                  disabled = {this.state.sendCodeLoading}
                               >{
                                 this.state.sendCodeLoading === false ? <Trans id = "account_settings_add_caller_id"/> : (
                                   <Spinner animation = "border" />
                                 )
                               }</Button>
                         </Box>
                         {
                           this.state.sendCodeResult === true && (
                             <React.Fragment>
                                <Box style = {{
                                    display:"flex",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    padding:"10px 0px"
                                }}>
                                   <TextField
                                      variant = "outlined"
                                      fullWidth
                                      label = ""
                                      placeholder = "Verification Code"
                                      onChange = {(e)=>{
                                        this.setState({
                                          verificationCode: e.target.value
                                        })
                                      }}
                                      value = {this.state.verificationCode}
                                      style = {{flex:1, backgroundColor:"white"}}
                                      size = "small"
                                    />
                                    <Button variant = "contained" color = "default" size = "small" onClick = {()=>{this.sendCode()}} disabled = {this.state.sendCodeLoading}><Trans id = "account_settings_send_again"/></Button>
                                </Box>
                                <Button variant = "contained" color = "primary" size = "small" 
                                    onClick = {()=>{
                                      this.addCallerID();
                                    }}
                                    style = {{display:"flex", justifyContent:"center", alignItems:"center"}}
                                >
                                  {
                                    this.state.addCallerIDLoading === true ? (
                                      <Spinner animation = "border"/>
                                    ) : <Trans id = "button_add"/>
                                  }
                                </Button>
                             </React.Fragment>
                           )
                         }
                         

                     </Box>  
                   )
                 }
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell><Trans id = "change_caller_id_modal_table_caller_id"/></TableCell>
                      <TableCell><Trans id = "name"/></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                       this.props.user.numbers && this.props.user.numbers.length > 0 ? this.props.user.numbers.map((number,index)=>(
                         <TableRow key = {`number-index-${index}`}
                            onClick = {()=>{
                              // this.props.Actions.setCallerId(number.phone_number)
                              this.setState({
                                caller_id: number.phone_number
                              })
                            }}
                            style = {{backgroundColor: this.state.caller_id === number.phone_number ? "#a9dbef" : "white"}}
                         >
                            <TableCell> <img src={"/media/flag1/"+ number.tariff.country.code +".svg"} alt="image"  /></TableCell>
                            <TableCell>{number.phone_number ? number.phone_number : ""}</TableCell>
                            <TableCell>{number.name ? number.name : ""}</TableCell>
                         </TableRow>
                       )):(null)
                    }
                  </TableBody>
                </Table>
            </Box>
           ):(null)
         }
         {
           this.props.compose.messageType === "SMS" || this.props.compose.messageType === "VOICE_WITH_SMS" ? (
            <Box style = {{color:"#3190e6", marginTop:"20px"}}>
                <Box><Trans id = "change_caller_id_sms"/></Box>
                <Box>
                  <TextField
                    variant = "outlined"
                    fullWidth
                    label = ""
                    placeholder = "Callburn"
                    onChange = {(e)=>{
                      this.setState({
                        sender_name: e.target.value
                      })
                    }}
                    value = {this.state.sender_name.length > 13 ? this.state.sender_name.substr(0,13) : this.state.sender_name}
                  />
                </Box>
            </Box>
           ):(null)
         }
       
     </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
    compose:state.compose,
    user: state.user.userData,
  }),
  dispatch => ({
    Actions: bindActionCreators({ setSenderName, getUserData, setCallerId }, dispatch),
    modalActions: bindActionCreators({ hideModal }, dispatch)
  })
)(ChangeCallerIdModal);

