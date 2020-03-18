import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import react bootstrap components;
import {DropdownButton, Dropdown} from 'react-bootstrap';
//import material ui components
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import CheckIcon from '@material-ui/icons/Check'
//import styles
import './filter.scss';
//import translation component
import Trans from '../../../../../utils/Trans';
//import actions
import { setFilterByStatus, setFilterByCreationDate, setFilterByMessageType } from '../../../../../../../store/app_services/campaign/campaignAction';
const useStyles = makeStyles(theme => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    // marginTop: theme.spacing(2),
  },
}));

function CampaignFiler(props) {
  const classes = useStyles();
  const setFilterByStatus = (name) => {
    var tempStatus = new Set();
    if(name === "select-all")
      {
        tempStatus.add("dialing_completed");
        tempStatus.add("start");
        tempStatus.add("saved");
        tempStatus.add("scheduled");
        tempStatus.add("schedulation_idle");
        tempStatus.add("stop");
        props.campaignActions.setFilterByStatus(tempStatus);
      } else if( name === "uncheck-all" )
      {
        props.campaignActions.setFilterByStatus(tempStatus);
      } else {
        tempStatus = new Set(props.filterByStatus);
        if(tempStatus.has(name)){
            tempStatus.delete(name)
        } else {
            tempStatus.add(name)
        }
        props.campaignActions.setFilterByStatus(tempStatus);
      }

  }
  const setFilterByCreationDate = (date) => {
      props.campaignActions.setFilterByCreationDate(date);
  }
  const setFilterByMessageType = (type) => {
      props.campaignActions.setFilterByMessageType(type);
  }
  const filterByCreationDateLabel = {
      range1:"Last day",
      range7:"Last week",
      range30:"Last month",
      range90:"Last 90 days"
  };
  const filterByMessageTypeLabel = {
      "VOICE_MESSAGE" : "Callmessages",
      "SMS":"SMS",
      "VOICE_WITH_SMS":"Hybrid Message",
      "all": "All messages"
  }
  return (
    <div className = "filter-area">
            <FormControl variant="outlined" className={classes.formControl + " filter-item"}>
              
                <DropdownButton
                    alignRight
                    title= {
                        props.filterByStatus.size === 0 ? <Trans id = "filter_status"/> : props.filterByStatus.size + " checked"
                    }
                    id="dropdown-more-action-button"
                    variant="success"
                >
                    <Dropdown.Item  onClick = {()=>setFilterByStatus("select-all")} value="select-all"><Trans id = "filter_status_select_all"/></Dropdown.Item>
                    <Dropdown.Item  onClick = {()=>setFilterByStatus("uncheck-all")} value="uncheck-all">
                        <em><Trans id = "filter_status_uncheck_all"/></em>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("dialing_completed")} value="dialing_completed">
                        {
                            props.filterByStatus.has("dialing_completed") && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "filter_status_sent"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("start")} value="start">
                        {
                            props.filterByStatus.has("start") && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "filter_status_calling_in_progress"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("saved")} value="saved">
                        {
                            props.filterByStatus.has("saved") && (
                                <CheckIcon/>
                            )
                        }
                         <Trans id = "filter_status_save_as_draft"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("scheduled")} value="scheduled">
                        {
                            props.filterByStatus.has("scheduled") && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "filter_status_scheduled"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("schedulation_idle")} value="schedulation_idle">
                        {
                            props.filterByStatus.has("schedulation_idle") && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "filter_status_waiting_for_actions"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>setFilterByStatus("stop")} value="stop">
                        {
                            props.filterByStatus.has("stop") && (
                                <CheckIcon/>
                            )
                        }
                         <Trans id = "filter_status_manually_stopped"/>
                    </Dropdown.Item>
                </DropdownButton>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl + " filter-item"}>
                <DropdownButton
                    alignRight
                    title= {
                        props.filterByCreationDate !== null &&  props.filterByCreationDate !== 0 ? filterByCreationDateLabel["range"+props.filterByCreationDate]:
                        <Trans id = "filter_by_date" name = ""/>
                    }
                    id="dropdown-more-action-button"
                    variant="success"
                >
                    <Dropdown.Item onClick = {()=>{setFilterByCreationDate(0)}} value="">
                        <em>---------</em>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByCreationDate(1)}} value="last-day">
                        {
                            props.filterByCreationDate === 1 && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "campaign_overview_last_day"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByCreationDate(7)}} value="last-week">
                        {
                            props.filterByCreationDate === 7 && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "campaign_overview_last_week"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByCreationDate(30)}} value="last-month">
                        {
                            props.filterByCreationDate === 30 && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "campaign_overview_last_month"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByCreationDate(90)}} value="last-90-days">
                        {
                            props.filterByCreationDate === 90 && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "campaign_overview_last_90_days"/>
                    </Dropdown.Item>
                </DropdownButton>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl + " filter-item" }>
                <DropdownButton
                    alignRight
                    title= {
                       props.filterByMessageType !== null && props.filterByMessageType !== "" ? filterByMessageTypeLabel[props.filterByMessageType] : <Trans id = "filter_by_type" name = ""/>
                    }
                    id="dropdown-more-action-button"
                    variant="success"
                >
                    <Dropdown.Item onClick = {()=>{setFilterByMessageType("VOICE_MESSAGE")}} value="callmessages">
                        {
                            props.filterByMessageType === "VOICE_MESSAGE" && (
                                <CheckIcon/>
                            )
                        }
                       <Trans id = "dashboard_welcome_voice_messages"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByMessageType("SMS")}} value="sms">
                        {
                            props.filterByMessageType === "SMS" && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "only_sms_title"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByMessageType("VOICE_WITH_SMS")}} value="hybrid-message">
                        {
                            props.filterByMessageType === "VOICE_WITH_SMS" && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "voice_with_sms"/>
                    </Dropdown.Item>
                    <Dropdown.Item onClick = {()=>{setFilterByMessageType("all")}} value="all-messages">
                        {
                            props.filterByMessageType === "all" && (
                                <CheckIcon/>
                            )
                        }
                        <Trans id = "all"/>
                    </Dropdown.Item>
                </DropdownButton>
            </FormControl>
      </div>
  );
}
const mapStateToProps = state => ({
      ...state.campaign
  })
const mapDispatchToProps = dispatch => {
    return {
        campaignActions: bindActionCreators({ setFilterByStatus, setFilterByCreationDate, setFilterByMessageType }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CampaignFiler);