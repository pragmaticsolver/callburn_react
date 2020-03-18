import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSelector } from "react-redux";
import { render} from 'react-dom'
import {toastr} from 'react-redux-toastr';
import { Col, Row } from "reactstrap";
import Swal from 'sweetalert2';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { SliderComponent } from '@syncfusion/ej2-react-inputs';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-react-inputs/styles/material.css";
import {Card, Form, Button} from 'react-bootstrap';
//import icons
import TimeIcon from 'assets/callburn/images/images/TimeZoneIcon.svg';
import SpeedIcon from 'assets/callburn/images/images/speed@3x.svg';
import groupIcon from 'assets/images/phone/group.jpg';
import DeleteIcon from '@material-ui/icons/Delete';
import DragImg from 'assets/images/compose/drag.png';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";
import EventItem from './components/eventItem/eventItem';
//import actions;
import {showModal, hideModal} from '../../modalConductorActions';
import {saveCampaign} from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import Trans from '../../../utils/Trans';
class ScheduleForm extends Component {
  constructor(props)
  {
    super(props);
    if(this.props.compose.isEdit == true){
      var speed = [0,0,0,0];
      var schedules = [
        new Set(),
        new Set(),
        new Set(),
        new Set()
      ];
      var recipients_count = [0,0,0,0];
      var startTimes = [
        this.props.currentTime,
        this.props.currentTime,
        this.props.currentTime,
        this.props.currentTime,
      ];
      var origin_schedule_data = this.props.compose.schedulations;
      var events = [];
      if(origin_schedule_data && origin_schedule_data.length > 0)
      {
        for(var i = 0 ;i < origin_schedule_data.length; i++)
        {
           var start_time = new Date(origin_schedule_data[i].start).getHours() + ":" + new Date(origin_schedule_data[i].start).getMinutes();
           if(origin_schedule_data[i].color == "rgb(98, 178, 247)")
           {
              speed[0] = origin_schedule_data[i].delivery_speed;
              recipients_count[0] = origin_schedule_data[i].recipients_count_to_call;
              schedules[0].add(origin_schedule_data[i].start);
              startTimes[0] = start_time;
              events.push({id:0, start:origin_schedule_data[i].start.split(" ")[0]})
           } else if(origin_schedule_data[i].color == "rgb(243, 86, 83)")
           {
             speed[1] = origin_schedule_data[i].delivery_speed;
             recipients_count[1] = origin_schedule_data[i].recipients_count_to_call;
             schedules[1].add(origin_schedule_data[i].start);
             startTimes[1] = start_time;
             events.push({id:1, start:origin_schedule_data[i].start.split(" ")[0]})
           } else if(origin_schedule_data[i].color == "rgb(255, 152, 0)")
           {
             speed[2] = origin_schedule_data[i].delivery_speed;
             recipients_count[2] = origin_schedule_data[i].recipients_count_to_call;
             schedules[2].add(origin_schedule_data[i].start);
             startTimes[2] = start_time;
             events.push({id:2, start:origin_schedule_data[i].start.split(" ")[0]})
           } else {
             speed[3] = origin_schedule_data[i].delivery_speed;
             recipients_count[3] = origin_schedule_data[i].recipients_count_to_call;
             schedules[3].add(origin_schedule_data[i].start);
             startTimes[3] = start_time;
             events.push({id:3, start:origin_schedule_data[i].start.split(" ")[0]})
           }
        }
      }
       this.schedules = schedules;
       this.state = {
         schedules: schedules,
         speed: speed,
         recipientsCount: recipients_count,
         startTimes: startTimes,
         events: events
       }
    } else {
      this.state = {
        startTimes:[
          this.props.currentTime,
          this.props.currentTime,
          this.props.currentTime,
          this.props.currentTime,
        ],
        speed:[
          0,0,0,0
        ],
        schedules:[
          new Set(),
          new Set(),
          new Set(),
          new Set()
        ],
        recipientsCount:[
          0,0,0,0
        ],
        events: []
      };
      this.schedules = [
        new Set(),
        new Set(),
        new Set(),
        new Set()
     ]
    }
    this.schdulationDiv = null;
    this.scheduleEvents = [];
    this.createSchedule = this.createSchedule.bind(this);
    this.removeSchedule = this.removeSchedule.bind(this);
    this.removeEvents = this.removeEvents.bind(this);
    this.onChanged = this.onChanged.bind(this);
    this.changeRecipientsCount = this.changeRecipientsCount.bind(this);
    this.updateRecipientsCount = this.updateRecipientsCount.bind(this);
  }
 
  /**
   * adding dragable properties to external events through javascript
   */
  updateRecipientsCount=()=>
  {
     var totalCurrentEventsCount = this.state.schedules[0].size + this.state.schedules[1].size + this.state.schedules[2].size + this.state.schedules[3].size;
     if(totalCurrentEventsCount!= 0)
     {
        var countTemp = 0;
        if(totalCurrentEventsCount == 0) countTemp = 0;
        else{
         countTemp = Math.floor(this.props.compose.recipients_count/totalCurrentEventsCount);
        }
        if(this.state.recipientsCount.toString() != [countTemp,countTemp,countTemp,countTemp].toString())
        {
          var _temp = this.state.recipientsCount;
          _temp[0] = countTemp;
          _temp[1] = countTemp;
          _temp[2] = countTemp;
          _temp[3] = countTemp;
          this.setState({
            recipientsCount: _temp
          })

        }
     }
  }
  componentDidMount() {
    new Draggable(this.schdulationDiv, {
      itemSelector: ".fc-event",
      eventData: function(eventEl) {
        let title = eventEl.getAttribute("title");
        let id = eventEl.getAttribute("data");
        return {
          title: title,
          id: id
        };
      }
    });
    
  }

  /**
   * when we click on event we are displaying event details
   */
  changeRecipientsCount = (id, count) => {
    var _temp = [];
    for(var i = 0; i < 4; i++)
    {
      if(i == id) _temp.push(count);
      else _temp.push(this.state.recipientsCount[i])
    }
    this.setState({
      recipientsCount: _temp
    })
  }
  changeTime = (event, id, isH) =>{
    var tempStartTimes = [];
    var tempTime = this.state.startTimes[id];
    var H = tempTime.split(":")[0];
    var S = tempTime.split(":")[1];
   
    if(isH == true) H = event.target.value;
    else S = event.target.value;
    if(H.length == 1) H = "0" + H;
    if(S.length == 1) S = "0" + S;
    tempTime = H + ":" + S;
    for(var i = 0; i < this.state.startTimes.length; i++)
    {
      if(i == id) tempStartTimes.push(tempTime);
      else tempStartTimes.push(this.state.startTimes[i]);
    }
    tempStartTimes[id] = tempTime;
    this.setState({
      startTimes: tempStartTimes
    })
  }
  makeScheduleData = (schedules, times, speeds, recipientsCount) => {
    var Data = [];
    var colors = ["rgb(98, 178, 247)", "rgb(243, 86, 83)","rgb(255, 152, 0)","rgb(98, 243, 229)"];
    for(var j = 0; j < 4; j++)
    {
      var setIter = schedules[j].values();
      for(var i = 0; i < schedules[j].size; i++)
      {
        var _date = setIter.next().value;
        _date = _date + " " + times[j] + ":00";
        var _temp = {
          	className: ["openSesame"],
          	color: colors[j],
          	delivery_speed: speeds[j],
          	is_finished: 0,
          	recipients_count_to_call: recipientsCount[j],
          	start: _date,
          	week_days: {Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false,Sunday:false},
          	week_number: 0

        }
        Data.push(_temp);
      }
    }
    var caller_id = this.props.compose.caller_id;
    if(caller_id == "" || caller_id == undefined || caller_id == null) caller_id = this.props.userData.numbers[this.props.userData.numbers.length-1].phone_number;
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
        schedulations: Data,
        schedulations_count: Data.length,
        selected_groups: this.props.compose.recipients_data,
        should_shuffle: this.props.compose.should_shuffle,
        sms_text: this.props.compose.message_content,
        status: "scheduled",
        type: this.props.compose.messageType,
      }
      if(this.props.compose.messageType != "SMS") params.campaign_voice_file_id = this.props.compose.file_id;
      if(this.props.compose.is_callback_active == true)
      {
        params.callback_digit =  this.props.compose.callback_digit;
        params.callback_voice_file_id = this.props.compose.callback_voice_file_id;
      }
      if(this.props.compose.is_donotcall_active == true)
      {
        params.do_not_call_digit = this.props.compose.do_not_call_digit;
        params.do_not_call_voice_file_id =this.props.compose.do_not_call_voice_file_id;
      }
      if(this.props.compose.is_replay_active == true)
      {
        params.replay_digit = this.props.compose.replay_digit;
      }
      if(this.props.compose.is_transfer_active == true)
      {
        params.transfer_digit = this.props.compose.transfer_digit;
        params.live_transfer_limit = this.props.compose.live_transfer_limit;
        params.transfer_options = this.props.compose.transfer_options;
      }
      if(this.props.compose.messageType === "SMS" || this.props.compose.messageType === "VOICE_WITH_SMS")
      {
        params.sender_name = this.props.compose.senderName;
      }
      var confirmText = "";
      for(var i = 0 ;i < Data.length; i++)
      {
        confirmText += "<div>"+Data[i].start + " - " + Data[i].recipients_count_to_call + " recipients - delivery in less than " + (Data[i].delivery_speed == 0?"3":Data[i].delivery_speed) + " minutes" + "</div>"
      }
      Swal.fire({
        title: 'Message Schedulation',
        html: '<b>Your callmessage is now scheduled for delivery on following days and hours:</b>' +
              '<br/>' +
              confirmText
              ,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm!',
        customClass: 'swal-wide'
      }).then((result) => {
        if (result.value) {
            this.props.composeActions.saveCampaign(params);
        } 
      })
      
  }
  createSchedule = (e,date, id) => {
    if(!this.schedules[id].has(date)){
      this.schedules[id].add(date)
      this.scheduleEvents.push(e);
      this.setState({
        schedules: this.schedules
        }
      )
    }
    this.updateRecipientsCount();
  }
  removeSchedule = (date, id) => {
    if(this.schedules[id].has(date)){
      this.schedules[id].delete(date)
    }
  }
  removeEvents = () => {
    this.scheduleEvents.forEach(event => {
        event.event.remove();
    });
    delete this.schedules;
    delete this.scheduleEvents;
    this.scheduleEvents = [];
    this.schedules = [
      new Set(),
      new Set(),
      new Set(),
      new Set()
    ];
    delete this.state.startTimes;
    delete this.state.speed;
    delete this.state.schedules;
    this.setState({
      startTimes:[
        this.props.currentTime,
        this.props.currentTime,
        this.props.currentTime,
        this.props.currentTime,
      ],
      speed:[0,0,0,0],
      schedules:[
        new Set(),
        new Set(),
        new Set(),
        new Set()
      ],
      events:[]
    })
  }
  onChanged = (e, id) => {
    var temp = this.state.speed;
    temp[id] = e.value;
    this.setState({
      speed: temp
    })
  }
  changeRecipientsCount = (e, id) => {
    var _temp = this.state.recipientsCount;
    _temp[id] = Number(e.target.value);
    this.setState({
      recipientsCount: _temp
    })
  }
  render() {
    return (
          <div>
            <Row style = {{justifyContent:"center", padding:"20px", fontSize:"1.2rem"}}>
                  <b >  <Trans id = "modals_camping_batch_schedulation_modal_your_message_should"/> {this.props.compose.recipients_count} <Trans id = "modals_campaign_schedulation_recipient"/>.</b>
                  <p><Trans id = "modals_camping_batch_schedulation_modal_choose_when_you"/></p>
            </Row>
            <Row>
              <Col lg={5} sm={5} md={5}>
                <div className="schedle-calendar" id="mycalendartest">
                  <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                      left: "prev,next today",
                      center: "title",
                      right: "listWeek"
                    }}
                    locale = {this.props.lang}
                    events = {this.state.events}
                    dragRevertDuration = {0}
                    rerenderDelay={10}
                    eventStartEditable = {true}
                    eventDurationEditable={false}
                    editable={true}
                    droppable={true}
                    eventClick={this.eventClick}
                    eventDrop = {(e)=>{
                      const dd = new Date(e.event.start)
                      this.createSchedule(e, dd.getFullYear() + "-" + (dd.getMonth() + 1) + "-" + dd.getDate(), e.event.id)
                    }}
                    eventDragStart = {(e)=>{
                      const dd = new Date(e.event.start)
                      this.removeSchedule(dd.getFullYear() + "-" + (dd.getMonth() + 1) + "-" + dd.getDate(), e.event.id)
                    }}
                    eventReceive = {(e) => {
                      const dd = new Date(e.event.start)
                      this.createSchedule(e, dd.getFullYear() + "-" + (dd.getMonth() + 1) + "-" + dd.getDate(), e.event.id)
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    ref={(input) => (this.calendarComponentRef = input)}
                    // validRange= {     {             
                    //   start: new Date(),
                    //   end: '2100-12-01'}
                    // }
                    eventOverlap ={(stillEvent, movingEvent) => {
                      if(stillEvent.id == movingEvent.id) return false;
                      else return true;
                    }}
                    eventRender={(info) => {
                      render(
                          <EventItem startTimes ={this.state.startTimes} id = {info.event.id}/>,
                          info.el,
                      );
                      return info.el;
                  }}
                    selectable={true}
                  />
                </div>
                <div>
                  <Row style = {{marginTop:"20px"}}>
                    <Col md = {6} style = {{display:"flex", flexDirection:"column"}}>
                        <div style = {{flex:1}}></div>
                        <Form.Label><Trans id = "completed_recipients"/></Form.Label>
                        <Form.Control value = {0} type = "text" readOnly = {true}/>
                    </Col>
                    <Col md = {6}>
                        <Form.Label><Trans id = "completed_past_schedules"/></Form.Label>
                        <Form.Control value = {0} type = "text" readOnly/>
                    </Col>
                  </Row>
                  <Row>
                    <Col md = {6}>
                        <Form.Label><Trans id = "modals_camping_batch_schedulation_modal_total_scheduled"/></Form.Label>
                        <Form.Control value = {this.state.schedules[0].size + this.state.schedules[1].size + this.state.schedules[2].size + this.state.schedules[3].size} type = "text" readOnly/>
                    </Col>
                    <Col md = {6}>
                        <Form.Label><Trans id = "modals_camping_batch_schedulation_modal_deliveries_will"/></Form.Label>
                        <Form.Control type = "text" value = {(this.props.compose.recipients_count - this.state.recipientsCount[0]*this.state.schedules[0].size - this.state.recipientsCount[1]*this.state.schedules[1].size -this.state.recipientsCount[2]*this.state.schedules[2].size -this.state.recipientsCount[3]*this.state.schedules[3].size) + " recipient(s)"} readOnly/>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col lg={7} sm={7} md={7}>
                <div style = {{display:"flex", alignItems:"center"}}>
                    <div
                      ref={(input) => (this.schdulationDiv = input)}
                      id="external-events"
                      style={{
                        padding: "10px",
                        height: "auto",
                        display:"flex",
                        flex:1,
                        justifyContent:"center",
                        alignItems:"center"
                      }}
                    >
                      {[{id:0},{id:1},{id:2},{id:3}].map((event, key) => (
                        <div
                          className={`fc-event event${key}`}
                          data={event.id}
                          key={event.id}
                        >
                        </div>
                      ))}
                    </div>
                    <div>
                      {
                        this.state.schedules[0].size + this.state.schedules[1].size +this.state.schedules[2].size + this.state.schedules[3].size > 0 ? (
                            <Button variant = "danger"
                                onClick = {()=>{
                                    this.removeEvents();
                                }}
                            > <DeleteIcon/><Trans id = "delete"/></Button>
                        ):(null)
                      }
                    </div>
                </div>
                <div style = {{height:"500px", overflow:"auto", padding:"20px"}}>
                  {
                      this.state.schedules[0].size + this.state.schedules[1].size + this.state.schedules[2].size +this.state.schedules[3].size == 0?(
                        <img alt = "" src = {DragImg} className = "drag-guide-image"/>
                      ):(null)
                  }
                  {
                    this.state.schedules.map((event, index) => (
                    <React.Fragment key = {index}>
                      {
                        event.size > 0 ? (
                          <Card className = {`event-card event${index}`} >
                            <Card.Header><Trans id = "timeslot"/> {index + 1}</Card.Header>
                              <Card.Body>
                                  <div style = {{display: "flex", alignItems:"center"}}>
                                      <img src = {TimeIcon} alt = ""/>
                                      <b style = {{margin:0}}> &nbsp;<Trans id = "modals_camping_batch_schedulation_modal_hour"/>? &nbsp;</b>
                                      <Form.Control as="select" style = {{width:"70px", borderRadius:"15px"}} size = "sm"
                                          onChange = {(event)=>this.changeTime(event,index, true)}
                                          defaultValue = {Number(this.state.startTimes[index].split(":")[0])}
                                      >
                                        {
                                          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(item=>(
                                            <option key = {item} value = {item}>
                                                {item}
                                            </option>
                                          ))
                                        }
                                      </Form.Control>
                                      <Form.Control as="select" style = {{width:"70px", borderRadius:"15px"}} size = "sm"
                                        onChange = {(event) => this.changeTime(event, index, false)}
                                        defaultValue = {Number(this.state.startTimes[index].split(":")[1])}
                                      >
                                        {
                                          [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59].map(item=>(
                                            <option key = {item} value = {item}>
                                                {item}
                                            </option>
                                          ))
                                        }
                                      </Form.Control>
                                  </div>
                                  <div style = {{display: "flex", alignItems:"center"}}>
                                      <img src = {groupIcon} style = {{width:"24px"}} alt = ""/>
                                      <b style = {{margin:0}}> &nbsp;<Trans id = "campaign_compose_compose_step_2_recipients"/> &nbsp;</b>
                                      <Form.Control  type="number" size="sm" style = {{width:"100px", textAlign:"center",borderRadius:"20px"}} value = {this.state.recipientsCount[index]} onChange = {(e)=>{this.changeRecipientsCount(e, index)}}/>
                                      {
                                        event.size > 1 ? (
                                          <div style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                          &nbsp; x{event.size}
                                          </div>
                                        ): (null)
                                      }
                                  </div>
                                  <div style = {{display: "flex", alignItems:"center"}}>
                                      <img src = {SpeedIcon} style = {{width:"24px"}} alt = ""/>
                                      <b style = {{margin:0}}> &nbsp;<Trans id = "modals_camping_batch_schedulation_modal_speed"/> &nbsp;</b>
                                      <div  style = {{width:"200px", marginLeft:"10px"}}>
                                        <SliderComponent changed={(e)=>this.onChanged(e,index)} change={(e)=>this.onChanged(e,index)} step = {15} min = {0} max = {120} value = {this.state.speed[index]}/>
                                        <div style = {{textAlign:"Center", marginTop:"-20px"}}>
                                          {this.state.speed[index] == 0?"Less time as possible":this.state.speed[index] + " minutes"}
                                        </div>
                                      </div>
                                  </div>
                              </Card.Body>
                            </Card>
                        ) : (null)
                      }
                      </React.Fragment>
                    ))
                  }
                  </div>
                  <div style = {{float:"right", marginTop:"20px"}}>
                      <Button variant = "success"
                        onClick = {()=>{
                            this.props.modalActions.hideModal();
                            this.makeScheduleData(this.state.schedules, this.state.startTimes, this.state.speed, this.state.recipientsCount);
                            
                        }}
                      > <Trans id = "button_save_and_send"/> </Button>
                      <Button variant = "default"
                        onClick = {()=>{this.props.modalActions.hideModal();}}
                      ><Trans id = "modals_camping_batch_schedulation_modal_discard"/></Button>
                  </div>
              </Col>
            </Row>
          </div>
        );
  }
}
export default connect(
  state => ({
      lang: state.i18n.lang,
      compose:state.compose,
      currentTime:state.user.currentTime,
      userData: state.user.userData
  }),
  dispatch => ({
    modalActions: bindActionCreators({ showModal, hideModal }, dispatch),
    composeActions: bindActionCreators({ saveCampaign }, dispatch)
  })

)(ScheduleForm);
