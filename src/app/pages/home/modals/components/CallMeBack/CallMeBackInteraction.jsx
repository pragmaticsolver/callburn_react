import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Table,TableHead, TableRow, TableCell, TableBody, Fab} from '@material-ui/core';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
//import react-bootstrap components;
import {Form, Tabs, Tab, Spinner} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../ModalWrapper';
import Numpad from '../Numpad/Numpad';
import AudioUploader from '../../../components/audioUploader'
//import style
import './style.scss';
//import actions
import { setCallback, callbackVoiceFileUpload, setCallbackFileId } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import {setAudio, playAudio, pauseAudio} from '../../../../../store/app_services/audio/audioAction';
import { hideModal } from '../../modalConductorActions';
import Trans from '../../../utils/Trans';
class CallMeBackInteractionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_confirm: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.callbackFileUploadFun = this.callbackFileUploadFun.bind(this);
  }
  handleChange = (event) =>{
    this.setState({
      check_confirm: event.target.checked
    })
  }
  callbackFileUploadFun = (_file) => {
    var data = new FormData();
    data.append('file', _file);
    this.props.composeActions.callbackVoiceFileUpload(data);
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "modals_camping_batch_activate_callback_activate_call_me"/>)}
        okText={(<Trans id = "modals_camping_batch_activate_callback_activate_call_me"/>)}
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        toggle = {false} 
        onOk={() => {
          if(this.props.callback_digit === null || this.state.check_confirm === false || this.props.callback_voice_file_id === null) return;
          else this.props.modalAction.hideModal();
       }}
       onCancel = {()=>{
         this.props.composeActions.setCallback({flag:false, digit:null});
       }}
        width = "700px"
      >
        <div className = "body-area">
            <div className = "main-section">
              <div className = "intro">
                  <h4><Trans id = "modals_camping_batch_activate_callback_how_it_works"/>?</h4>
                  <p style = {{textAlign:"justify"}}>
                     <Trans id = "modals_camping_batch_activate_callback_a_second"/>
                     <Trans id = "modals_camping_batch_activate_callback_if_you_have_any"/>
                  </p>
                  <Form className = "create-confirm-vm-for-callmeback">
                    <Form.Group controlId="create-confirm-vm-for-callmeback">
                      <Form.Label> <b><Trans id = "active_do_not_call_modal_short_description"/></b></Form.Label>
                         <div className = "left-content">
                            <Tabs
                                defaultActiveKey="audio-content"
                            >
                                <Tab eventKey="text-content" title="From a text" disabled>
                                    <p><Trans id = "coming_soon"/></p>
                                </Tab>
                                <Tab eventKey="audio-content" title="From a audio">
                                    <p>
                                        <Trans id = "modals_templates_templates_upload_an_audio"/>
                                    </p>
                                    <AudioUploader
                                        onLoad = {this.callbackFileUploadFun}
                                        loading = {this.props.callbackFileUploadLoading}
                                        audio = {this.props.callbackAudio}
                                    />
                                </Tab>
                                <Tab eventKey="template-for-callback" title="From a templates">
                                  <p>
                                          <Trans id = "campaign_compose_compose_step_1_voice_message"/>
                                  </p>
                                  <div style = {{height:"300px", overflow:"auto", border:"1px solid #e6e5e5", borderRadius:"2px"}}>
                                    <Table stickyHeader aria-label="sticky table" className = "template-table">
                                      <TableHead></TableHead>
                                      <TableBody>
                                          {
                                             this.props.template_files.length > 0 ? (
                                              this.props.template_files.map((file, index) => (
                                                <TableRow 
                                                      key = {file._id} 
                                                      className = {this.props.callback_voice_file_id === file._id?"template_selected":""}
                                                      onClick = {()=>{
                                                        this.props.composeActions.setCallbackFileId(file._id);
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
                                                                  if(this.props.audio.audio_id === file._id)
                                                                  {
                                                                    if(this.props.audio.loading === true) return;
                                                                    else{
                                                                      if(this.props.audio.isPlaying === true) this.props.audioActions.pauseAudio();
                                                                      else this.props.audioActions.playAudio();
                                                                    }
                                                                  } else {
                                                                      this.props.audioActions.pauseAudio();
                                                                      this.props.audioActions.setAudio(file._id);
                                                                  }
                                                                  }}
                                                              >
                                                                {
                                                                    this.props.audio.audio_id === file._id ? (
                                                                      this.props.audio.loading === true?<Spinner animation="border" variant="primary" />:(
                                                                        this.props.audio.isPlaying === true?<PauseIcon/>:<PlayIcon/>
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
                                  </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </Form.Group>
                  </Form>
              </div>
              <div className = "digit-selector-section">
                   <Numpad title = {(<Trans id = "modals_camping_batch_dijit_choosen_select_a_digit"/>)} interactionDigitName = "callMeBackInteractionDigit"/>
              </div>
            </div>
            <div className = {this.state.check_confirm?"comfirm-section checked":"comfirm-section"}>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.check_confirm}
                          onChange={this.handleChange}
                          value="checkedB"
                          color="primary"
                        />
                      }
                      label={(<Trans id = "check_container_text1"/>)}
                  />
            </div>
     
        </div>
          </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
    callback_digit: state.compose.callback_digit,
    callbackFileUploadLoading: state.compose.callbackFileUploadLoading,
    callbackAudio: state.compose.callbackAudio,
    callback_voice_file_id: state.compose.callback_voice_file_id,
    template_files: state.compose.template_files,
    audio: state.audio
  }),
  dispatch => ({
    composeActions: bindActionCreators({ setCallback, callbackVoiceFileUpload , setCallbackFileId}, dispatch),
    modalAction: bindActionCreators({ hideModal }, dispatch),
    audioActions: bindActionCreators({ setAudio, pauseAudio, playAudio }, dispatch)
  })
)(CallMeBackInteractionModal);


