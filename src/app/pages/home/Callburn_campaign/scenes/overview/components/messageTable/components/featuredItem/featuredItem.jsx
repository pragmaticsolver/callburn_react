import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import overview_vm from 'assets/images/overview/overview_vm.svg';
import overview_sms from "assets/images/overview/overview_sms.svg";
import timezone_icon from "assets/callburn/images/images/TimeZoneIcon.svg";
import calendar_icon from "assets/images/compose/calendar.svg";
import phonebook_icon from "assets/callburn/images/images/phonebook-icon-blue@2x.svg";
import caller_i_d_icon from "assets/callburn/images/images/caller-i-d-icon@3x.svg";
import message_icon from "assets/callburn/images/images/message-icon@3x.svg";
import fill_icon from "assets/callburn/images/images/fill-112@3x.svg";
import interaction_icon from "assets/callburn/images/images/Interaction_icon.svg";
import playback_icon from "assets/callburn/images/images/playback_icon.svg";
//import translation component
import Trans from "../../../../../../../utils/Trans";
//import Actions;
import { setAudio, playAudio, pauseAudio} from '../../../../../../../../../store/app_services/audio/audioAction'
import './featuredItem.scss';
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: 'black',
      color: 'white',
      maxWidth: 320,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
class FeaturedItem extends React.Component{
    constructor(props)
    {
        super(props);
        this.getAudioTooltipHtml = this.getAudioTooltipHtml.bind(this);
        this.renderPlayStopButton = this.renderPlayStopButton.bind(this);
    }
    renderPlayStopButton = (campaign) => {
      if(campaign.voice_file === null) return "/media/play.svg";
      else {
        if(this.props.audio_id === campaign.voice_file._id)
        {
           if(this.props.loading === true)
           {
              return "/media/spinner.svg";
           } else {
              if(this.props.isPlaying == false) return "/media/play.svg";
              else return "/media/stop.svg";
           }
        } else {
          return "/media/play.svg";
        }
      }
    }
    getAudioTooltipHtml = (campaign) => {
        if (campaign.voice_file && campaign.voice_file.type === "TTS") {
          var name = campaign.voice_file.tts_text;
        } else if (campaign.voice_file&& campaign.voice_file.type === "UPLOADED") {
          var name = campaign.voice_file.orig_filename;
        }
        var duration = "0'" + ' 0"';
        if(campaign.voice_file)
        {
          duration = Math.floor(campaign.voice_file.length / 60) + "' " + (campaign.voice_file.length % 60) + '"';
        }
        return(
          <React.Fragment>
            <p><span className="blue-sp">Name</span>:{name}</p>
            <p className = "blue-sp">
               { campaign.voice_file!= null ? campaign.voice_file.type+ "-" + duration:"null - "  + duration }
            </p>
            <div className = "stop-play left">
                <img src = {this.renderPlayStopButton(campaign)} style = {{width:"20px", cursor:"pointer"}} className = "compose_method3_icons"
                  onClick = {(event)=>{
                    if(this.props.loading === true) return;
                    if(campaign.voice_file !== null){
                      if(this.props.audio_id === campaign.voice_file._id && this.props.audio !== null)
                      {
                          if(this.props.isPlaying === false) this.props.audioActions.playAudio();
                          else this.props.audioActions.pauseAudio();
                      } else {
                        if(this.props.isPlaying === true) {
                          this.props.audioActions.pauseAudio();
                        }
                        this.props.audioActions.setAudio(campaign.voice_file._id);
                      }
                    } 
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                />
                <span >&nbsp;&nbsp;Play</span>
            </div>
          </React.Fragment>
        )
      };
     
      calcSmsTextSmsCount = (sms_text) => {
        if (sms_text) {
          var txt = sms_text.length;
          if (txt >= 0 && txt <= 160) {
            return "X1";
          } else {
          return "X" + Math.ceil(txt / 153);
            
          }
        } else return ""
      };
      calcSmsText = (sms_text) => {
        if (sms_text) {
          var txt = sms_text.length;
          var num = 0;
          if (txt >= 0 && txt <= 160) {
            num = 1;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else if (txt >= 161 && txt <= 320) {
            num = 2;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else if (txt >= 321 && txt <= 480) {
            num = 3;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else if (txt >= 481 && txt <= 640) {
            num = 4;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else if (txt >= 641 && txt <= 800) {
            num = 5;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else if (txt >= 801 && txt <= 960) {
            num = 6;
            return (
              " " +
              "Characters count" +
            //   $rootScope.trans("compose_step_1_method_1_characters_count") +
              ": " +
              txt +
              " - " +
              num +
              " SMS"
            );
          } else {
            return;
          }
        }
      };
      clockHover = (data, pastDate) => {
        var dateData = [];
        var dataToShow = "";
        var userTimezone = this.props.timezome;

        data.forEach(function(item) {
          if(item && item.scheduled_date && userTimezone)
          {
            var date = moment(item.scheduled_date).tz(userTimezone).format("MMMM Do YYYY, HH:mm");
            var past = false;
            if (!moment().tz(userTimezone).isBefore(date)) {
              past = true;
            }
            dateData.push({ date: date, recipients: item.recipients, past: past });
          }
        });
        dateData.forEach((data) =>{
          if ((pastDate && data.past) || (!pastDate && !data.past)) {
            dataToShow +=
              data.date +
              " - " +
              data.recipients +
              " " +
              "Recipients" +
            //   $rootScope.trans("compose_step_3_text_recipients") +
              ";" +
              "<br>";
          }
        });
        return dataToShow;
      };
      showGroupNames = (groups) => {
        var dataToShow = "";
        groups.forEach((item) => {
          dataToShow += item.name + "<br>";
        });
        return dataToShow;
      };
      getInteractionsTooltipHtml = (campaign) => {
        var replay_digit = campaign.replay_digit
          ? "Replay callmessage"
             +
            " " +
            "(" +
            campaign.replay_digit +
            ")"
          : "";
        var transfer_digit = campaign.transfer_digit
          ? "<div></div>" +
            // (<Trans id = "campaign_compose_compose_step_3_call_live"/>) +
           "Call Live Transfer" + 
            " " +
            "(" +
            campaign.transfer_digit +
            ")"
          : "";
        var callback_digit = campaign.callback_digit
          ? "<div></div>" +
            // (<Trans id = "campaign_compose_compose_step_3_call_me_back"/>) +
            "Call me back" +
            " " +
            "(" +
            campaign.callback_digit +
            ")"
          : "";
        var do_not_call_digit = campaign.do_not_call_digit
          ? "<div></div>" +
            // (<Trans id = "campaign_compose_compose_step_3_blacklist_me"/>) +
            "Blacklist me" +
            " " +
            "(" +
            campaign.do_not_call_digit +
            ")"
          : "";
        return replay_digit + transfer_digit + callback_digit + do_not_call_digit;
      };
    render(){
        return(
            <div className="overview-hover" >
                <div className="voice_icon item">
                    {
                        this.props.campaign.grouping_type !== 'BATCH' && this.props.campaign.type !== 'SMS'?(
                            <HtmlTooltip interactive
                                title={
                                <React.Fragment>
                                    <Typography color="inherit" component = "div">
                                        <div >
                                          {
                                            this.getAudioTooltipHtml(this.props.campaign)
                                          }
                                        </div>
                                    </Typography>
                                </React.Fragment>
                                }
                                placement = "right"
                            >
                                <img src = {overview_vm} alt = "play button" className="img-responsive" style={{cursor:"pointer", width:"24px", height:"24px"}}/>
                            </HtmlTooltip>
                        ):(
                            null
                        )
                    }
                </div>
                {
                    this.props.campaign.type === 'SMS' || this.props.campaign.type === 'VOICE_WITH_SMS'?(
                        <div className = "item">
                        <div className="sms_holder">
                            <HtmlTooltip
                                title={
                                <React.Fragment>
                                    <div>
                                    { this.props.campaign.sms_text + this.calcSmsText(this.props.campaign.sms_text)}
                                    </div>
                                </React.Fragment>
                                }
                                placement = "right"
                            >
                                <img src = {overview_sms} alt = ""  style={{cursor:"pointer" , width:"24px", height:"24px"}}/>
                            </HtmlTooltip>
                        </div>    
                        {
                            this.props.campaign.sms_text && (this.props.campaign.type === 'SMS' || this.props.campaign.type === 'VOICE_WITH_SMS')?(
                                    <div className="smsCount">
                                        {this.calcSmsTextSmsCount(this.props.campaign.sms_text)}
                                    </div>
                            ):(
                                null
                            )
                        }
                        </div>
                    ):(
                        null
                    )
                }
                {
                    (this.props.campaign.status === 'scheduled' && this.props.campaign.schedulations.length) || (this.props.campaign.status === 'schedulation_in_progress' && this.props.campaign.schedulations.length)?(
                        <HtmlTooltip
                            title={
                            <React.Fragment>
                                <Typography component = "div" color="inherit">
                                    <div dangerouslySetInnerHTML={{__html: this.clockHover(this.props.campaign.schedulations)}}>
                                    </div>
                                </Typography>
                            </React.Fragment>
                            }
                            placement = "right"
                            className = "item"
                        >
                            <img src = {timezone_icon} alt = ""  style={{cursor:"pointer" , width:"24px", height:"24px"}}/>
                        </HtmlTooltip>
                    ):( null )
                }
                {
                    this.props.campaign.schedulations.length?(
                        <HtmlTooltip
                            className = "item"
                            title={
                            <React.Fragment>
                                <Typography color="inherit" component = "div">
                                    <div dangerouslySetInnerHTML={{__html: this.clockHover(this.props.campaign.schedulations, true)}}>
                                    </div>
                                </Typography>
                            </React.Fragment>
                            }
                            placement = "right"
                        >
                            <img src = {calendar_icon} alt = ""  style={{cursor:"pointer" , width:"24px", height:"24px"}}/>
                        </HtmlTooltip>
                    ):( null )
                }
                {
                    this.props.campaign.groups && this.props.campaign.groups.length ? (
                        <HtmlTooltip
                            className = "item"
                            title={
                            <React.Fragment>
                                <Typography color="inherit" component = "div">
                                    <div dangerouslySetInnerHTML={{__html: this.showGroupNames(this.props.campaign.groups)}}>
                                    </div>
                                </Typography>
                            </React.Fragment>
                            }
                            placement = "right"
                        >
                            <img src = {phonebook_icon} alt = ""  style={{cursor:"pointer" , width:"24px", height:"24px"}}/>
                        </HtmlTooltip>
                    ):(null)
                }
                <div className = "item">
                        <HtmlTooltip
                            title={
                            <React.Fragment>
                                <Typography color="inherit">
                                {/* campaign.type == 'VOICE_MESSAGE' ? trans('select_the_voice') + ' ' + '+' + campaign.caller_id : campaign.type == 'SMS' ? 'SMS: ' + campaign.sender_name : campaign.type == 'VOICE_WITH_SMS' ? trans('select_the_voice') + ' ' + '+' + campaign.caller_id + ' SMS: ' + campaign.sender_name : '' */}
                                {
                                    this.props.campaign.type === 'VOICE_MESSAGE' ? 'Voice' + ' ' + '+' + this.props.campaign.caller_id : this.props.campaign.type === 'SMS' ? 'SMS: ' + this.props.campaign.sender_name : this.props.campaign.type === 'VOICE_WITH_SMS' ? 'Voice' + ' ' + '+' + this.props.campaign.caller_id + ' SMS: ' + this.props.campaign.sender_name : ''
                                }
                                </Typography>
                            </React.Fragment>
                            }
                            placement = "right"
                        >
                            <img src = {caller_i_d_icon} alt="play button" className="img-responsive"  style={{cursor:"pointer", width:"24px", height:"24px"}}/>
                        </HtmlTooltip>
                </div>
                {
                   this.props.campaign.grouping_type == "BATCH" && (
                  <div className = "item">
                      <HtmlTooltip
                          title={
                          <React.Fragment>
                              <Typography color="inherit">
                                  Batch message
                              </Typography>
                          </React.Fragment>
                          }
                          placement = "right"
                      >
                          <img src = {message_icon} alt="play button" className="img-responsive"  style={{opacity:0.4, width:"24px", height:"24px"}}/>
                      </HtmlTooltip>
                  </div>
                   )
                }
                {
                   this.props.campaign.grouping_type == "REPEAT" && (
                  <div className = "item">
                      <HtmlTooltip
                          title={
                          <React.Fragment>
                              <Typography color="inherit">
                                   Deliver: {this.props.campaign.remaining_repeats} times
                              </Typography>
                          </React.Fragment>
                          }
                          placement = "right"
                      >
                          <img src = {fill_icon} alt="play button" className="img-responsive"  style={{cursor:"pointer", width:"24px", height:"24px"}}/>
                      </HtmlTooltip>
                  </div>
                   )
                }
                 {
                   (this.props.campaign.callback_digit || this.props.campaign.do_not_call_digit || this.props.campaign.replay_digit || this.props.campaign.transfer_digit) && (
                  <div className = "item">
                      <HtmlTooltip
                          title={
                          <React.Fragment>
                              <Typography color="inherit" component = "div">
                                   <div dangerouslySetInnerHTML={{__html: this.getInteractionsTooltipHtml(this.props.campaign)}}></div>
                              </Typography>
                          </React.Fragment>
                          }
                          placement = "right"
                      >
                          <img src = {interaction_icon} alt="play button" className="img-responsive"  style={{cursor:"pointer", width:"24px", height:"24px"}}/>
                      </HtmlTooltip>
                  </div>
                   )
                }
                {
                   (this.props.campaign.playback_count > 1) && (
                  <div className = "item">
                      <HtmlTooltip
                          title={
                          <React.Fragment>
                              <Typography color="inherit">
                                  <Trans id = "campaign_compose_compose_step_3_playback"/>
                                  <Trans id = "campaign_compose_compose_step_3_count"/>
                                  {
                                    this.props.campaign.playback_count + "x"
                                  }
                              </Typography>
                          </React.Fragment>
                          }
                          placement = "right"
                      >
                          <img src = {playback_icon} alt="play button" className="img-responsive"  style={{cursor:"pointer", width:"24px", height:"24px"}}/>
                      </HtmlTooltip>
                  </div>
                   )
                }
            </div>
        )
    }
}

export default connect(
  state => ({
    timezome: state.user.userData.timezone,
    audio: state.audio.audio,
    audio_id: state.audio.audio_id,
    url: state.audio.url,
    error: state.audio.error,
    isPlaying: state.audio.isPlaying,
    loading: state.audio.loading
  }),
  dispatch => ({
    audioActions: bindActionCreators({ setAudio, playAudio, pauseAudio }, dispatch)
  })
)(FeaturedItem);
