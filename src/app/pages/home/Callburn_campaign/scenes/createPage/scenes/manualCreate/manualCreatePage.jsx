import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import {toastr} from 'react-redux-toastr';
//import react material ui components;
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Checkbox} from '@material-ui/core';
import {Table, TableHead, TableRow, TableCell, TableBody, Fab,  Grid } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import PhoneIcon from '@material-ui/icons/PhoneAndroid';
import SmsIcon from '@material-ui/icons/Sms';
//import react-boootstrap components;
import {Tabs, Tab,Row, Col, Spinner, Card } from 'react-bootstrap';
//import custom components;
import SelecButtonWithImg from './components/imageSelectorButton/imageSelectorButton';
import SelectItem from './components/SelectItem/SelectItem';
import AudioUploader from './../../../../../components/audioUploader';
import PhoneGroupTable from './components/groupTable/phoneGroupTable';
import ManualInputNumber from './components/phoneNumberMuanlInput';
import PreventTransitionPrompt from '../../../../../components/PreventTransitionPrompt';
//import images;
import VOICE_MESSAGEImage from 'assets/images/compose/vm.svg';
import SmsImage from 'assets/images/compose/sms.svg';
import CallSmsImage from 'assets/images/compose/vm_sms.svg';
import PhoneImage from 'assets/images/compose/sms_phone.png';
import SaveImage from 'assets/images/compose/save.svg';
import PreviewIcon from 'assets/images/compose/preview.svg';
import CalendarIcon from 'assets/images/compose/calendar.svg';
import SendIcon from 'assets/images/compose/magnet.svg';
//import styles
import './manualCreatePage.scss';
//import actions;
import {showModal} from '../../../../../modals/modalConductorActions';
import {
  clearComposeData, 
  setMessageType,
  setMessageContent, 
  setFileId,
  setShuffle,
  setPlaybackCount,
  setEmailNotify,
  setCampaignName, 
  audioFileUpload,
  getTemplateFiles,
  saveCampaign,
  setReplay,
  setCallback,
  setBlock,
  setTransfer,
  calculateCost,
  setSenderName
} from '../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
import { playAudio, pauseAudio, setAudio } from '../../../../../../../store/app_services/audio/audioAction';
//import Translation component
import Trans from '../../../../../utils/Trans';


function calcSmsTextSmsCount(sms_text){
  if (sms_text) {
    var txt = sms_text.length;
    if (txt >= 0 && txt <= 160) {
      return 1
    } else {
    return Math.ceil(txt / 153);
      
    }
  }
};
function getSteps() {
    return ['<b>Choose which type of messages you want to send</b>',
            '<b>Message content</b>',
            '<b>Message recipients</b>',
            '<b>Review and send</b>',
        ];
}
function getStepContent(step, _that) {
  switch (step) {
    case 0:
      return(
        <Typography className = "step-area" component={'div'}>
            <Typography className = "step-title" component={'div'}>
            </Typography>
            <br/>
            <Typography className = "step-body" component={'div'}>
              <div className = "choose-message-type-area">
                 <div className = "item"
                      onClick = {()=>{
                        // _that.setState({
                        //    messageType:"VOICE_MESSAGE"
                        // })
                        _that.props.Actions.setMessageType("VOICE_MESSAGE");
                      }}
                 >
                        <SelecButtonWithImg imageUrl = {VOICE_MESSAGEImage} 
                                                        title = {(<Trans id = "left_vm_title"/>)} 
                                                        selected =  {_that.props.compose.messageType == "VOICE_MESSAGE"?true:false}
                                                        description = {(<Trans id = "only_vm_text"/>)}
                        />
                </div>
                <div className = "item"
                      onClick = {()=>{
                        // _that.setState({
                        //   messageType:"VOICE_WITH_SMS"
                        // })
                        _that.props.Actions.setMessageType("VOICE_WITH_SMS");
                      }}
                >
                        <SelecButtonWithImg imageUrl = {CallSmsImage} 
                                                        title = {(<Trans id = "vm_and_sms_title"/>)} 
                                                        selected =  {_that.props.compose.messageType == "VOICE_WITH_SMS"?true:false}
                                                        description = {(<Trans id = "vm_and_sms_text"/>)}
                        />
                </div>
                <div className = "item"
                       onClick = {()=>{
                        // _that.setState({
                        //   messageType:"SMS"
                        // })
                        _that.props.Actions.setMessageType("SMS");
                      }}
                >
                        <SelecButtonWithImg imageUrl = {SmsImage} 
                                                        title = {(<Trans id = "only_sms_title"/>)}
                                                        selected =  {_that.props.compose.messageType == "SMS"?true:false}
                                                        description = {(<Trans id = "only_sms_text"/>)}
                        />
                </div>
                </div>
            </Typography>
        </Typography>
      );
    case 1:
            return(
              <Typography className = "step-area" component={'div'}>
                  <Typography className = "step-title" component={'div'}>
                  </Typography>
                  <br/>
                  <Typography className = "step-body " component={'div'}>
                       {
                          ( _that.props.compose.messageType == "VOICE_MESSAGE" || _that.props.compose.messageType == "VOICE_WITH_SMS" ) && (
                            <div className = "message-content">
                              <h3 className = "title"><Trans id = "create_message_content"/></h3>
                              <Row className = "call-message-content-area">
                                    <Col className = "left-side">
                                      <div className = "left-content" style = {{border: _that.state.audioFileEmpty === true ? "1px solid red":"none"}}>
                                          <Tabs
                                          defaultActiveKey = "audio-content"
                                          >
                                              <Tab eventKey="text-content" 
                                                    title={(<div className = "coming-soon-text" title="Coming Soon" onClick = {(event)=>{
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                    }}><Trans id = "campaign_compose_compose_step_1_tts_technology"/></div>)}
                                              >
                                                  <p><Trans id = "coming_soon"/></p>
                                              </Tab>
                                              <Tab eventKey="audio-content" title = {(<Trans id = "campaign_compose_compose_step_1_upload_ffile"/>)}>
                                                <p>
                                                      <Trans id = "campaign_compose_compose_step_1_upload_an_audio"/>
                                                </p>
                                                <AudioUploader
                                                    onLoad = {_that.audioFileUploadFun}
                                                    loading = {_that.props.compose.audioFileUploadLoading}
                                                    audio = {_that.props.compose.audio}
                                                />
                                              </Tab>
                                              <Tab eventKey="template-content" title="From a templates">
                                                <p>
                                                       <Trans id = "campaign_compose_compose_step_1_voice_message"/>
                                                </p>
                                                <div style = {{height:"300px", overflow:"auto", border:"1px solid #e6e5e5", borderRadius:"2px"}}>
                                                  <Table stickyHeader aria-label="sticky table">
                                                    <TableHead></TableHead>
                                                    <TableBody>
                                                        {
                                                          _that.props.compose.template_files.length > 0 ? (
                                                            _that.props.compose.template_files.map((file) => (
                                                              <TableRow 
                                                                   key = {file._id} 
                                                                   className = {_that.props.compose.file_id == file._id?"template_selected":""}
                                                                   onClick = {()=>{
                                                                    //  _that.state.file_id!=file._id && _that.setState({
                                                                    //    file_id: file._id
                                                                    //  })
                                                                     _that.props.Actions.setFileId(file._id, file.orig_filename ? file.orig_filename : "");
                                                                     _that.setState({
                                                                       audioFileEmpty: false
                                                                     })
                                                                   }}
                                                              >
                                                                  <TableCell align = "center">
                                                                      <div>{file.orig_filename}</div>
                                                                      <div>00:32"</div>
                                                                  </TableCell>
                                                                  <TableCell align = "right">
                                                                          {/* <span style = {{margin:"0px 5px"}}
                                                                              onClick = {(e)=>{
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                              }}
                                                                          >
                                                                            <Fab size="small" color="default" aria-label="Edit">
                                                                              <EditIcon />
                                                                            </Fab>
                                                                          </span> */}
                                                                          <span style = {{margin:"0px 5px"}}
                                                                              onClick = {(e)=>{
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                              }}
                                                                          >
                                                                            <Fab size="small" color="default" aria-label="Play"
                                                                               onClick = {() => {
                                                                                if(_that.props.audio.audio_id === file._id)
                                                                                {
                                                                                  if(_that.props.audio.loading === true) return;
                                                                                  else{
                                                                                    if(_that.props.audio.isPlaying === true) _that.props.audioActions.pauseAudio();
                                                                                    else _that.props.audioActions.playAudio();
                                                                                  }
                                                                                } else {
                                                                                   _that.props.audioActions.pauseAudio();
                                                                                   _that.props.audioActions.setAudio(file._id);
                                                                                }
                                                                               }}
                                                                            >
                                                                              {
                                                                                  _that.props.audio.audio_id === file._id ? (
                                                                                    _that.props.audio.loading === true ? <Spinner animation="border" variant="primary" />:(
                                                                                      _that.props.audio.isPlaying === true ? <PauseIcon/>:<PlayIcon/>
                                                                                    )
                                                                                  ):(
                                                                                      <PlayIcon/>
                                                                                  )
                                                                              }
                                                                            </Fab>
                                                                          </span>
                                                                  </TableCell>
                                                              </TableRow>
                                                            ))
                                                          ):(null)
                                                        }
                                                    </TableBody>
                                                  </Table>
                                                  <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                                                      {
                                                          _that.props.compose.getTemplateLoading === true ? (
                                                              <Spinner animation = "border" size = "lg"/>
                                                          ):(null)
                                                      }
                                                  </div>
                                                </div>
                                              </Tab>
                                          </Tabs>
                                        </div>
                                    </Col>
                                    <Col >
                                      <div className = "right-side">
                                      
                                        <div className = "check-area">
                                            <p className = "check-title">
                                                 <Trans id = "campaign_compose_compose_step_3_functionalities"/>
                                            </p>
                                            <div className = "check-item" onClick = {()=> {_that.setSelectItem("replyInteractionDigit")}}><SelectItem primary = {(<Trans id = "campaign_compose_compose_step_3_replay_voice_message"/>)} secondary = {(<Trans id = "replay_text"/>)} interactionDigitName = "replyInteractionDigit"/></div>
                                            <div className = "check-item" onClick = {()=> {_that.setSelectItem("liveTransferInteractionDigit")}}><SelectItem primary = {(<Trans id = "blacklist_me_interaction_modal_text_call_live_transfer"/>)} secondary = {(<Trans id = "callback_text"/>)} interactionDigitName = "liveTransferInteractionDigit"/></div>
                                            <div className = "check-item" onClick = {()=> {_that.setSelectItem("callMeBackInteractionDigit")}}><SelectItem primary = {(<Trans id = "campaign_compose_compose_step_3_call_me_back"/>)}       secondary = {(<Trans id = "callback_text"/>)} interactionDigitName = "callMeBackInteractionDigit"/></div>
                                            <div className = "check-item" onClick = {()=> {_that.setSelectItem("blockListMeInteractionDigit")}}><SelectItem primary = {(<Trans id = "campaign_compose_compose_step_3_blacklist_me"/>)}       secondary = {(<Trans id = "blacklist_text"/>)} interactionDigitName = "blockListMeInteractionDigit"/></div>
                                        </div>
                                        <div className = "playback-count">
                                          <div className = "label-area">
                                          <List >
                                            <ListItem>
                                              <ListItemAvatar>
                                                  <Avatar>
                                                        <AccessTimeIcon/>
                                                  </Avatar>
                                              </ListItemAvatar>
                                               <ListItemText primary={(<Trans id = "playback_count"/>)} secondary = {(<Trans id = "playback_text"/>)} />
                                            </ListItem>
                                        </List>
                                          </div>
                                          <div className = "buttons-area">
                                                <div onClick = {()=>{ _that.props.Actions.setPlaybackCount(1) }} className = {_that.props.compose.playback_count === 1?"count-button-item selected":"count-button-item"}>1</div>
                                                <div onClick = {()=>{ _that.props.Actions.setPlaybackCount(2) }} className = {_that.props.compose.playback_count === 2?"count-button-item selected":"count-button-item"}>2</div>
                                                <div onClick = {()=>{ _that.props.Actions.setPlaybackCount(3) }} className = {_that.props.compose.playback_count === 3?"count-button-item selected":"count-button-item"}>3</div>
                                                <div onClick = {()=>{ _that.props.Actions.setPlaybackCount(4) }} className = {_that.props.compose.playback_count === 4?"count-button-item selected":"count-button-item"}>4</div>
                                                <div onClick = {()=>{ _that.props.Actions.setPlaybackCount(5) }} className = {_that.props.compose.playback_count === 5?"count-button-item selected":"count-button-item"}>5</div>
                                          </div>
                                        </div> 
                                        </div>
                                    </Col>
                              </Row>
                             </div>
                           )
                       }
                       {
                         (_that.props.compose.messageType === "SMS" || _that.props.compose.messageType === "VOICE_WITH_SMS") && (
                           <div className = "message-content">
                              <h3 className = "title"><Trans id = "sms"/></h3>
                              <Row className = "sms-message-content-area">
                                  <Col className = "sms-left-side">
                                      <div className = "sms-left-content">
                                          <textarea 
                                              placeholder = "Write message text here, including optional interactions instructions (ej: press 1 to contact with us)"
                                              value = {_that.props.compose.message_content ? _that.props.compose.message_content:""}
                                              onChange = {_that.changeSmsMessageContent} 
                                              className = "sms-message-contents-text"
                                          />
                                          <div className = "sms-contents-length">
                                                {"Characters count : " + (_that.props.compose.message_content?_that.props.compose.message_content.length:"")}
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                {
                                                  _that.props.compose.message_content ? calcSmsTextSmsCount(_that.props.compose.message_content) + " SMS" : ""
                                                }
                                          </div>
                                      </div>
                                  </Col>
                                  <Col className = "sms-right-side">
                                      <div className = "sms-right-content">
                                        <div className = "preview-area">
                                            <img src = {PhoneImage} alt = ""/>
                                            <div  className = "preview-text-area"  >{_that.props.compose.message_content}</div>                                          
                                        </div>
                                      </div>
                                  </Col>
                              </Row>
                           </div>
                         )
                       }
                      </Typography>
              </Typography>
            );
    case 2: 
          return(
            <Typography className = "step-area" component={'div'}>
                <Typography className = "step-title" component={'div'}>
                </Typography>
                <br/>
                <Typography className = "step-body " component={'div'}>
                    <div className = "message-content">
                        <h3 className = "title"><Trans id = "campaign_compose_compose_step_2_choose_your_recipients"/>
                        {
                          _that.props.compose.calculateCostLoading == true? (
                              <Spinner animation="border" variant="primary" size = "lg"/>
                          ):(null)
                        }
                        </h3>
                        <div className = "recipients-area">
                            <Row className = "recipients-area-wrapper">
                              <Col>
                                      <Tabs
                                      >
                                          <Tab eventKey="from-phonebook" title="Phonebook" >
                                              <PhoneGroupTable/>
                                          </Tab>
                                          <Tab eventKey="manual-input" title="Manual input">
                                              <ManualInputNumber/>
                                          </Tab>
                                      </Tabs>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Typography>
            </Typography>
          );
    case 3:
      var caller_id = _that.props.compose.callerId;
      if((caller_id === "" || caller_id === undefined || caller_id === null) && _that.props.userData && _that.props.userData.numbers) caller_id = _that.props.userData.numbers[_that.props.userData.numbers.length-1].phone_number;
            return(
                <div className = "step-area">
                  <div className = "step-body">
                    <div className = "review-and-sent">
                         <Grid container spacing={3}>
                          <Grid item xs={12} md = {6} lg = {3}>
                              <Card>
                                <Card.Header  ><Trans id = "campaign_compose_compose_step_3_sending_from_calle"/></Card.Header>
                                <Card.Body style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                    <List >
                                      {
                                        _that.props.compose.messageType === "VOICE_MESSAGE" || _that.props.compose.messageType === "VOICE_WITH_SMS" ? (
                                          <ListItem>
                                              <ListItemAvatar >
                                                <Avatar style = {{backgroundColor:"#4caf50"}}>
                                                  <PhoneIcon />
                                                </Avatar>
                                              </ListItemAvatar>
                                              <ListItemText primary="callmessages" secondary={(
                                                <span>
                                                  {/* <img src = {flagimg} alt = ""/>  ikram */}
                                                  +{caller_id}(null)</span>
                                              )}  style = {{color:"#23bdff"}}/>
                                          </ListItem>
                                        ) : (null)
                                      }
                                      {
                                        _that.props.compose.messageType === "SMS" || _that.props.compose.messageType === "VOICE_WITH_SMS" ? (
                                          <ListItem>
                                            <ListItemAvatar >
                                              <Avatar style = {{backgroundColor:"#4caf50"}}>
                                                <SmsIcon />
                                              </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary="SMS" secondary={_that.props.compose.senderName} style = {{color:"#23bdff"}}/>
                                          </ListItem>
                                        ) : (null)
                                      }
                                      <ListItem style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                         <Button onClick = {()=>{
                                           _that.props.Actions.showModal("CHANGE_CALLER_ID");
                                         }}>Change</Button>
                                      </ListItem>
                                    </List>
                                   
                                </Card.Body>
                              </Card>
                          </Grid>
                          <Grid item xs={12} md = {6} lg = {3}>
                              <Card className = "recipients">
                                <Card.Header ><Trans id = "compose_step_3_text_recipients"/></Card.Header>
                                <Card.Body className = "recipients-info">
                                    <span> <span className = "recipients-count">{_that.props.compose.recipients_count} </span> <Trans id = "compose_step_3_text_recipients"/></span>
                                </Card.Body>
                              </Card>
                          </Grid>
                          <Grid item xs={12} md = {6} lg = {3}>
                              <Card className = "price-area">
                                <Card.Header><Trans id = "campaign_compose_compose_step_3_maximum_price_is"/></Card.Header>
                                <Card.Body className = "price-info">
                                  {
                                    _that.props.compose.calculateCostLoading === true ? (
                                         <Spinner animation="border" variant="primary" />
                                    ):(
                                      <div>
                                          <div>
                                            <span className = "title"><Trans id = "dashboard_welcome_voice_messages"/>:</span>
                                              <span className = "info"><span className = "euro-sign">€</span> {_that.props.compose.max_cost ? _that.props.compose.max_cost.toFixed(2):""}</span>
                                        </div>
                                        <div>
                                              <span className = "title">SMS:</span>
                                              <span className = "info"><span className = "euro-sign">€</span> {_that.props.compose.max_cost_with_sms ? _that.props.compose.max_cost_with_sms.toFixed(2):""}</span>
                                        </div>
                                      </div>
                                    )
                                  }
                                </Card.Body>
                              </Card>
                          </Grid>
                          <Grid item xs={12} md = {6} lg = {3}>
                              <Card className = "select-area">
                                <Card.Header>Options</Card.Header>
                                <Card.Body className = "select-info">
                                  <div>
                                    <div>
                                       <Checkbox onChange = {_that.changeShuffle} checked = {_that.props.compose.should_shuffle}/><span><Trans id = "should_shuffle"/></span>
                                    </div>
                                    <div>
                                       <Checkbox onChange = {_that.changeEmailNotify} checked = {_that.props.compose.get_email_notifications}/><span><Trans id = "campaign_compose_compose_step_3_email_notifications"/></span>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                          </Grid>
                          <Grid item xs={12} md = {12} lg = {12}>
                              <Card className = "tag-insert-area"  > 
                                <Card.Body className = "tag-insert-input" style = {{width:"100%", border:_that.state.campaignNameEmpty == true ? "1px solid red" : "none"}}>
                                  <input placeholder = "Tag this message with name" value = {_that.props.compose.campaign_name ? _that.props.compose.campaign_name:""} onChange = {_that.changeCampaignName}
                                   
                                  />
                                </Card.Body>
                              </Card>
                          </Grid>
                          <Grid item xs={12} md = {12} lg = {12}>
                             <Card className = "action-button-area"> 
                                <Card.Body>
                                   <Grid container spacing={3}>
                                       <Grid item xs={12} md = {6} lg = {6}>
                                           <Card className = "action-button"
                                                onClick = {()=>_that.save("saved")}
                                           >
                                             <Card.Body >
                                               <div className = "item">
                                                 <img src = {SaveImage}/>
                                                 <span className = "title"><Trans id = "campaign_compose_compose_step_3_save_as_draft"/></span>
                                               </div>
                                               <div className = "item">

                                               </div>
                                             </Card.Body>
                                           </Card>
                                       </Grid>
                                       <Grid item xs={12} md = {6} lg = {6}>
                                           <Card  className = "action-button">
                                             <Card.Body>
                                               <div className = "item">
                                                 <img src = {PreviewIcon}/>
                                                 <span className = "title"><Trans id = "campaign_compose_compose_step_3_preview_message"/></span>
                                               </div>
                                             </Card.Body>
                                           </Card>
                                       </Grid>
                                       <Grid item xs={12} md = {6} lg = {6}>
                                           <Card className = "action-button"
                                              onClick = {()=>{
                                                if(_that.props.compose.campaign_name === "" || _that.props.compose.campaign_name === null)
                                                {
                                                   toastr.warning("Warning", "Please enter campaign name!");
                                                   return;
                                                } else {
                                                  _that.props.Actions.showModal("SCHEDULE_SETTING");
                                                }
                                              }}
                                           >
                                             <Card.Body >
                                               <div className = "item">
                                                 <img src = {CalendarIcon}/>
                                                 <span className = "title"><Trans id = "campaign_compose_compose_step_3_schedule"/></span>
                                               </div>
                                               <div className = "item"><Trans id = "schedule_button_text"/></div>
                                             </Card.Body>
                                           </Card>
                                       </Grid>
                                       <Grid item xs={12} md = {6} lg = {6}>
                                           <Card className = "action-button"
                                               onClick = {()=>_that.save("start")}
                                           >
                                             <Card.Body >
                                               <div className = "item">
                                                 <img src = {SendIcon}/>
                                                 <span className = "title"><Trans id = "campaign_compose_compose_step_3_send_now"/></span>
                                               </div>
                                               <div className = "item">
                                                    <Trans id = "send_now_button_text"/>
                                               </div>
                                             </Card.Body>
                                           </Card>
                                       </Grid>
                                   </Grid>
                                </Card.Body>
                              </Card>
                          </Grid>
                      </Grid>
                    </div>
                  </div>
                </div>
            );
    default:
      return 'Unknown step';
  }
}

class MessageCreateStepper extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
          activeStep:0,
          messageType:"",
          VOICE_MESSAGEPlaybackCount: 1,
          smsMessageContent:"",
          sender_name: "Callburn",
          caller_id: "",
          //-----------------------------------;
          file_id: null,
          //interaction Digits-----------------;
          replyInteractionDigit       : null,
          liveTransferInteractionDigit: null,
          callMeBackInteractionDigit  : null,
          blockListMeInteractionDigit : null,
          //-----------------------------------;
          isBlocking: false,
          audioFileEmpty: false,
          smsEmpty: false,
          campaignNameEmpty: false
      }
      this.handleNext = this.handleNext.bind(this);
      this.handleBack = this.handleBack.bind(this);
      this.changeSmsMessageContent = this.changeSmsMessageContent.bind(this);
      this.setInteractionDigit = this.setInteractionDigit.bind(this);
      this.audioFileUploadFun = this.audioFileUploadFun.bind(this);
      
  }
  setInteractionDigit = (interactionName, digit) => {
    this.setState({
      [interactionName]: digit,
    })
  }
  changeSmsMessageContent = (event) => {
       this.props.Actions.setMessageContent(event.target.value);
       this.setState({
        isBlocking: true
       })
  }
  changeCampaignName = (event) => {
    this.props.Actions.setCampaignName(event.target.value)
    this.setState({
      isBlocking: true,
      campaignNameEmpty: false
     })
  }
  changeShuffle = (event) => {
    this.props.Actions.setShuffle(event.target.checked);
    this.setState({
      isBlocking: true
     })
  }
  changeEmailNotify = (event) => {
    this.props.Actions.setEmailNotify(event.target.checked);
    this.setState({
      isBlocking: true
     })
  }
  setSelectItem = (interactionDigitName) => {
    if(interactionDigitName === "replyInteractionDigit"){
        if(this.props.compose.is_replay_active) this.props.Actions.setReplay({flag:false,digit:null});
        else this.props.Actions.showModal("ACTIVATE_REPLAY_INTERACTION");
    } else if(interactionDigitName === "callMeBackInteractionDigit"){
        if(this.props.compose.is_callback_active) this.props.Actions.setCallback({flag:false,digit:null});
        else this.props.Actions.showModal("CALL_ME_BACK");
    } else if(interactionDigitName === "blockListMeInteractionDigit"){
        if(this.props.compose.is_donotcall_active) this.props.Actions.setBlock({flag:false,digit:null});
        else this.props.Actions.showModal("BLOCK_LIST_ME");
    } else { //transfer
        if(this.props.compose.is_transfer_active) this.props.Actions.setTransfer({flag:false,digit:null});
        else this.props.Actions.showModal("CALL_LIVE_TRANSFER_INTERACTION");
    }    
}
  handleNext = () => {
    this.setState({
      isBlocking: true
     })
    if(this.state.activeStep === 0 && this.props.compose.messageType === "")
    {
       toastr.warning("warning","Please choose message type");
       return;
    }
    if(this.state.activeStep === 1 )
    {
      if(this.props.compose.messageType === "VOICE_MESSAGE" || this.props.compose.messageType === "VOICE_WITH_SMS")
      {
        if(this.props.compose.file_id === "" || this.props.compose.file_id === null )
        {
          toastr.warning("warning","Please select callmessage audio file");
          this.setState({
            audioFileEmpty: true
          },()=>{
             window.scrollTo(0,0)
          })
          return;
        }
      } else  {
        if(this.props.compose.message_content === "" || this.props.compose.message_content === null )
        {
          toastr.warning("warning","Please select SMSmsessage content file");
         
          return;
        }
      }
    } else if(this.state.activeStep === 2)
    {
      var params = {};
      var allContacts = this.props.compose.allContacts;
      params.all_contacts = allContacts;
      params.data = this.props.compose.recipients_data;
      if(this.props.compose.file_id && this.props.compose.file_id !== "") params.file_id = this.props.compose.file_id;
      if(this.props.compose.message_content && this.props.compose.message_content !== "") params.sms_text = this.props.compose.message_content;
      params.type = this.props.compose.messageType;
      this.props.Actions.calculateCost(params);
    }
    
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  
  audioFileUploadFun = (_file) => {
    
    var params = {};
    var data = new FormData();
    data.append('file', _file);
    this.props.Actions.audioFileUpload(data);
    this.setState({
      isBlocking: true,
      audioFileEmpty: false
     })
  }
  save = (status) => {
    if(this.props.compose.campaign_name === "" || this.props.compose.campaign_name === null)
    {
      toastr.warning("warning","Please type a campaign name");
      this.setState({
        campaignNameEmpty: true
      })
      return;
    }
    var caller_id = this.props.compose.callerId;
    if(caller_id === "" || caller_id === undefined || caller_id === null) caller_id = this.props.userData.numbers[this.props.userData.numbers.length-1].phone_number;
    var params = {
      all_contacts: this.props.compose.all_contacts,
      caller_id: caller_id,
      campaign_name: this.props.compose.campaign_name,
      currentTab: "groups",
      get_email_notifications: this.props.compose.get_email_notifications,
      // group_name: "Undelivered contacts of sdasd",
      is_callback_active: this.props.compose.is_callback_active,
      is_donotcall_active: this.props.compose.is_donotcall_active,
      is_replay_active: this.props.compose.is_replay_active,
      is_transfer_active: this.props.compose.is_transfer_active,
      max_cost: this.props.compose.max_cost,
      max_gift_cost: this.props.compose.max_gift_cost,
      phonenumbers: [],
      playback_count: this.props.compose.playback_count,
      remaining_repeats: 0,
      repeat_days_interval: 0,
      repeats_count: 0,
      same_sms_text: false,
      // schedulations: null,
      selected_groups: this.props.compose.recipients_data,
      should_shuffle: this.props.compose.should_shuffle,
      sms_text: this.props.compose.message_content,
      status: status,
      type: this.props.compose.messageType,
    }
    if(this.props.compose.messageType !== "SMS") params.campaign_voice_file_id = this.props.compose.file_id;
    if(this.props.compose.is_callback_active === true)
    {
      params.callback_digit =  this.props.compose.callback_digit;
      params.callback_voice_file_id = this.props.compose.callback_voice_file_id;
    }
    if(this.props.compose.is_donotcall_active === true)
    {
      params.do_not_call_digit = this.props.compose.do_not_call_digit;
      params.do_not_call_voice_file_id =this.props.compose.do_not_call_voice_file_id;
    }
    if(this.props.compose.is_replay_active === true)
    {
      params.replay_digit = this.props.compose.replay_digit;
    }
    if(this.props.compose.is_transfer_active === true)
    {
      params.transfer_digit = this.props.compose.transfer_digit;
      params.live_transfer_limit = this.props.compose.live_transfer_limit;
      params.transfer_options = this.props.compose.transfer_options.join();
    }
    if(this.props.compose.messageType === "SMS" || this.props.compose.messageType === "VOICE_WITH_SMS")
    {
      params.sender_name = this.props.compose.senderName;
    }
    this.props.Actions.saveCampaign(params);
  }
  componentDidMount(){
    this.props.Actions.getTemplateFiles();
  }
  componentDidUpdate(prevProps){
    if(prevProps.compose.error !== this.props.compose.error && this.props.compose.error !== "" && this.props.compose.error !==  null)
    {
      toastr.error(
        // <Trans id = {this.props.compose.error}/>
        "File format not supported "
      );
    }
    if(this.props.compose.saveLoading === true)
    {
      Swal.fire({
        title: 'Creating campaign...',
        text: "",
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
        Swal.close();
        if(prevProps.compose.succeed !== this.props.compose.succeed && this.props.compose.succeed === true)
        {
            this.setState({
              isBlocking: false
            }, ()=>{
              toastr.success("Success","Campaign created successfully!");
              this.props.history.push('/');
            })
        }
    }
  }
  render() {
    let steps =  getSteps();
    const { activeStep } = this.state;
    const messageTypeLabel = {
      "SMS":"Sms",
      "VOICE_WITH_SMS": "Voice and Sms",
      "VOICE_MESSAGE" : "Voice message"
    }
    return (
      <React.Fragment>
           <PreventTransitionPrompt
            when={this.state.isBlocking}
            title="Please Save"
            message={<strong>Please save your changes.</strong>}
            stopBlockingFun={(nextLocation) => {
              this.setState({
                isBlocking: false
              },()=>{
                this.props.history.push(nextLocation)
              });
            }}
          />
         <div className="root">
        <h3>Create Message</h3>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel style = {{position:"relative"}}>
                  <span className = "step-label">
                      {
                        index === 0 ? <Trans id = "campaign_compose_compose_step_1_compose_new"/> : 
                           index === 1 ? "Compose your message content" :
                              index === 2 ? <Trans id = "campaign_compose_compose_step_2_choose_your_recipients"/> :
                                               <Trans id = "campaign_compose_compose_step_3_review_and_send"/>
                      }
                      {
                        activeStep > 0 && index === 0?  (
                            <h4 style ={{marginLeft:"20px", color:"#2c59d6", position:"absolute"}}>{messageTypeLabel[`${this.props.compose.messageType}`]}</h4>
                        ):(null)
                      }
                      {
                        activeStep > 1 && index === 1?  (
                          <h4 style ={{marginLeft:"20px", color:"#2c59d6", position:"absolute"}}>
                              <span style = {{color:"#23bdff"}}>Voice:</span>{this.props.compose.audioFileName + ", "}
                              <span style = {{color:"#23bdff"}}> Sms:</span> 
                              {this.props.compose.message_content.length > 70 ? this.props.compose.message_content.substr(0,70) + "..." : this.props.compose.message_content}
                          </h4>
                        ):(null)
                      }
                       {
                        activeStep > 2 && index === 2 ? (
                          <h4 style ={{marginLeft:"20px", color:"#2c59d6", position:"absolute"}}>
                             {this.props.compose.recipients_count + " Contacts (" +  this.props.compose.recipients_text + " )"}
                          </h4>
                        ):(null)
                      }
                  </span>
                  
              </StepLabel>
              <StepContent>
                <Typography  component={'div'}                
                >{getStepContent(index, this)}
                </Typography>
                <div >
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                    >
                      <Trans id = "dashboard_tutorial_back"/>
                    </Button>
                    {
                        activeStep < 3 ? (
                          <Button
                              variant="contained"
                              color="primary"
                              onClick={this.handleNext}
                              >
                              {activeStep === steps.length - 1 ? <Trans id = "support_tickets_submit"/> : <Trans id = "dashboard_tutorial_next"/>}
                          </Button>
                        ):(null)
                    }
                    
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} >
            {/* <Typography component={'div'}>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button> */}
          </Paper>
        )}
      </div>
      </React.Fragment>
    );
  }
}



export default withRouter(connect(
  state => ({
    compose:state.compose,
    audio: state.audio,
    userData: state.user.userData
  }),
   dispatch => ({
       Actions: bindActionCreators(
           { showModal, clearComposeData, calculateCost,setMessageType, setFileId, setSenderName, setMessageContent,setCampaignName,setShuffle,setEmailNotify,setPlaybackCount,setReplay,setCallback,setBlock,setTransfer, audioFileUpload, getTemplateFiles , saveCampaign},
           dispatch
       ),
       audioActions: bindActionCreators(
        { setAudio, playAudio, pauseAudio },
        dispatch
    ),
   })
 )(MessageCreateStepper));