import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment-timezone';
import humanizeDuration from 'humanize-duration';
import Highcharts from "highcharts";
//import react-bootstrap components
import {ProgressBar, Row, Col} from 'react-bootstrap';
//import material ui components----------------------------
import { Table,TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, List,ListItem, ListItemText, ListItemAvatar, Avatar  } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
//---------------------------------------------------------------
//import custom components
import PieChart from './components/pieChart/pieChart';
import FeaturedItem from './components/featuredItem/featuredItem';
import ShowMoreButton from './components/showMoreBtn/showMoreBtn';
import CampaignPNumberTable from './components/campaignPNumberTable/campaignPNumberTable';
import blue_audio_spinner_big from "assets/callburn/images/images/blue-audio-spinner-big.svg";
//--------------
//import styles
import './messageTable.scss';
//import translation component
import Trans from '../../../../../utils/Trans';
//import actions;
import {setOrderField,  setOrder, clearCampaigns} from '../../../../../../../store/app_services/campaign/campaignAction';
import { initComposeData } from '../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: 'black',
      color: 'white',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
class CampaginRow extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
        expanded: false,
        //filter phone number
        except: null,
        only: null
        //
      }
      this.rootScope = {};
      this.scope = {};
      this.stateParams = {};
      this.rootScope.currentActiveUrl = "campaign.overview";
      this.rootScope.tutorialSidePopup = true;
      this.rootScope.showTutorial = this.stateParams.showTutorial ? true : false;
      this.scope.goToNotification = this.rootScope.goToNotification;
      this.rootScope.currentPage = "dashboard";
      this.rootScope.currentActiveRoute = "campaign";
      this.scope.currentOrder = "DESC";
      this.scope.showArrowByField = "updated_at";
      this.scope.filterData = {
        checkbox: {},
        order: "DESC",
        order_field: "updated_at"
      };
      this.scope.selectedCampaign = null;
      this.scope.orderField = null;
      // this.scope.tableSpinnerLoading = true;
      this.scope.retryUndeliverSpinner = false;
      // this.scope.serverTimezone = campaigns.resource.server_timezone;
      this.scope.exportCampaignLoader = false;
      this.scope.campaigns = [];
      this.scope.campaignsData = [];
      this.scope.prevPage = 1;
      this.scope.campaignsToShow = [];
      //
      this.chart_instance = null;
  }
  toggleExpander = (e) => {
    if (e.target.type === 'checkbox') return;

    if (!this.state.expanded) {
      this.setState(
        { expanded: true },
      );
    } else {
      this.setState({ expanded: false });
    }
  }
  handleCheckboxClick = (id, type) => {
    if(type === "more")
    {
    } else if( type === "edit" )
    {
    }
  }
  getCostOfCampaign = (campaign) => {
    return campaign.amount_spent;
  }
  getSuccessOfCampaign = (campaign) => {
    return campaign.success_phonenumbers[0]
    ? campaign.success_phonenumbers[0].count
    : 0;
  }
  getSuccessSmsVoiceOfCampaign = (campaign) => {
    return (
        campaign.success_phonenumbers[0].count -
        ((campaign.sms_count[0] && campaign.sms_count[0].count) || 0) +
        " " +
        "Callmessages" +   //multiLang  -- dashboard_welcome_voice_messages
        " & " +
        ((campaign.sms_count[0] && campaign.sms_count[0].count) || 0) +
        " SMS"
    );
  }
  getTotalOfCampaign = (campaign) => {
    if (campaign.totalRecipientsIfGroups) {
        return campaign.totalRecipientsIfGroups;
    }
    return campaign.total_phonenumbers[0]
        ? campaign.total_phonenumbers[0].count
        : 0;
  };
  calculateInteractionCost = (
    count,
    interactionsCost,
    campaignCost
    ) => {
    if (count && (interactionsCost || campaignCost)) {
        interactionsCost = interactionsCost ? interactionsCost : 0;
        campaignCost = campaignCost ? campaignCost : 0;
        return (
        Math.round(((interactionsCost + campaignCost) / count) * 100) / 100
        );
    }
    return "";
  };
  uiSrefToSchedule = (campaign, action) => {
    // $state.go("campaign.edit", {
    //   campaign_id: campaign._id,
    //   action: action,
    //   openModal: true
    // });
  };
  uiSref = (campaign) => {
    if (campaign.is_first_run && campaign.status !== "saved") return;
    if (campaign.status === "saved") {
        // $state.go("campaign.edit", { campaign_id: campaign._id });
    } else {
        // $state.go("campaign.statistics", { campaign_id: campaign._id });
    }
  };
    getCampaignStatus = (campaign) => {
    if (
        campaign.is_first_run == 1 &&
        campaign.status !== "saved" &&
        campaign.status !== "scheduled" &&
        campaign.status !== "stop" &&
        campaign.status !== "schedulation_idle"
    ) {
        return "Sending in progress...";
        // return $rootScope.trans("in_process");
    }
    switch (campaign.status) {
        case "stopped_low_balance":
              return(
                <Trans id = "stopped_low_balance" name = ""/>
              );
        case "dialing_completed":
            return(
              <Trans id = "campaign_overview_chackbox_dialing_completed" name = ""/>
            );
        case "start":
        if (campaign.schedulation_original_data) {
            if (this.props.userData.balance > 0) {
              return(
                <Trans id = "campaign_overview_chackbox_dialing_scheduled" name = ""/>
              );
            } else {
              return(
                <Trans id = "low_balance_disabled" name = ""/>
              );
            // this.scope.hideOnDisabled = true;
            }
        } else {
            if (this.props.userData.balance > 0) {
              return(
                <Trans id = "campaign_sending_in_progress" name = ""/>
              );
            } else {
              return(
                <Trans id = "low_balance_disabled" name = ""/>
              );
            // this.scope.hideOnDisabled = true;
            }
        }
        case "saved":
            return(
              <Trans id = "campaign_overview_chackbox_dialing_saved" name = ""/>
            );
        case "scheduled":
            return(
              <Trans id = "campaign_overview_chackbox_dialing_scheduled" name = ""/>
            );
        case "schedulation_idle":
        if (this.props.userData.balance > 0) {
          return(
            <Trans id = "campaign_overview_chackbox_schedulation_idle" name = ""/>
          );
           
        } else {
          return(
            <Trans id = "low_balance_disabled" name = ""/>
          );
        }
        case "stop":
        if (this.props.userData.balance > 0) {
          return(
            <Trans id = "campaign_overview_chackbox_dialing_stopped" name = ""/>
          );
        } else {
          return(
            <Trans id = "low_balance_disabled" name = ""/>
          );
        }
        case "schedulation_in_progress":
        if (this.props.userData.balance > 0) {
          return(
            <Trans id = "campaign_sending_in_progress" name = ""/>
          );
        } else { 
          return(
            <Trans id = "low_balance_disabled" name = ""/>
          );
        }
        default:
        return "";
    }
    };
    getStatusClass = (campaign) => {
    if (this.props.userData.balance <= 0) {
      if (
        campaign.status !== "dialing_completed" &&
        campaign.status !== "saved"
      ) {
        return "dark_orange snippet_blinking";
      }
    }
    if (campaign.status === "stop") {
        return "dark_orange";
    } else if (campaign.status === "stopped_low_balance") {
        return "dark_orange";
    } else if (campaign.status === "saved") {
        return "saved_status schedulation-in-progress-status";
    } else if (campaign.status === "dialing_completed") {
        return "sent-statistics-status";
    } else if (campaign.status === "schedulation_idle") {
        return "schedulation-idle-status";
    } else if (campaign.status === "scheduled") {
        return "schedulate-status";
    } else if (campaign.status === "start") {
        return "save-as-draft-status snippet_blinking";
    } else if (campaign.status === "schedulation_in_progress") {
        return "save-as-draft-status snippet_blinking";
    }
    };
    getCampaignRecipientsText = (campaign)=> {
    if (campaign.status === "scheduled" && campaign.first_scheduled_date) {
        for (var i = 0; i < campaign.schedulations.length; i++) {
        if (!campaign.schedulations[i].is_finished) {
            var recipients = campaign.schedulations[i].recipients;
            var recipientsText = recipients
            ? " "+recipients 
            : "";

            return (
              <div style = {{display:"block", color:"blue"}}>
                {recipientsText + " "}
                <Trans id = "modals_campaign_schedulation_recipient"/>
              </div>
              
            );
        }
        }
    }
    };
    getCampaignStatusText = (campaign, lang) => {
    if (
        (campaign.status === "scheduled" &&
        campaign.first_scheduled_date &&
        campaign.calls_count.length &&
        campaign.total_phonenumbers[0].count >
            campaign.calls_count[0].count) ||
        !campaign.calls_count.length
    ) {
        for (var i = 0; i < campaign.schedulations.length; i++) {
        if (!campaign.schedulations[i].is_finished) {
            var nextSchedule = moment
            .tz(
                campaign.schedulations[i].scheduled_date,
                "YYYY-MM-DD HH:mm:ss",
                this.props.userData.timezone
            )
            .add(1, "minute");
            var duration = moment().diff(nextSchedule);
            var humanize = humanizeDuration(duration, {
            units: ["d", "h", "m"],
            round: true,
            largest: 4,
            language: lang
            });
            return (
              <div>
                <Trans id = "next_run_in"/>
                {" " + humanize}
              </div>
            )
        }
        }
    }
    var updatedAt = null;
    var createdAt = null;
    if(this.props.userData && this.props.userData.timezone){
      updatedAt = moment(campaign.updated_at, "YYYY-MM-DD HH:mm:ss")
      .tz(this.props.userData.timezone)
      .format("MM/DD/YYYY HH:mm:ss");
      createdAt = moment(campaign.created_at, "YYYY-MM-DD HH:mm:ss")
      .tz(this.props.userData.timezone)
      .format("MM/DD/YYYY HH:mm:ss");
    }

    //SENT
    if (campaign.status === "dialing_completed") {
      return(
        <div>
          <Trans id = "completed_on"/>
          {
            " "+updatedAt
          }
        </div>
      )
    }

    //IN PROGRESS
    if (campaign.status === "start" && !campaign.schedulation_original_data) {
      return(
        <div>
          <Trans id = "started_on"/>
          {
           " "+ updatedAt
          }
        </div>
      )
    }
    // IN PROGRESS NEW
    if (campaign.status === "schedulation_in_progress") {
      return(
        <div>
          <Trans id = "started_on"/>
          {
          " "+  updatedAt
          }
        </div>
      )
    }

    //SAVED AS DRAFT
    if (campaign.status === "saved") {
      return(
        <div>
          <Trans id = "saved_on"/>
          {
            " "+createdAt
          }
        </div>
      )
    }

    //MANUALLY STOPPED
    if (campaign.status === "stop") {
      return(
        <div>
          <Trans id = "manually_stopped_on"/>
          {
            " "+updatedAt
          }
        </div>
      )
    }

    return null;
    };
  isWaitingNextBatch = (campaign) => {
    return false;
  };
  render_campagin_row = (data) => {
       return(
        <React.Fragment 
      >
        <TableCell align="left" className="features_td">
          {
            this.state.expanded?(
              <DoubleArrowIcon className = "expanded-for-statistics"/>
            ):(
              null
            )
          }
          <FeaturedItem campaign = {data}/>
        </TableCell>
        <TableCell align="left" onClick = {()=>{if(data.status !== "dialing_completed" && data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();}}
            style = {{width:"250px"}}><div className = "name-text">{data.campaign_name}</div></TableCell>
        <TableCell align="left" onClick = {()=>{
               if(data.status !== "dialing_completed" && data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();
            }}>
          <HtmlTooltip
              title={
              <React.Fragment>
                <Typography component = "div" color="inherit" >
                     {
                       data.status != 'scheduled' && data.status != 'schedulation_idle' ?(
                            <div><Trans id = "click_to_show_statistics"/></div>
                       ):(null)
                     }
                </Typography>
              </React.Fragment>
            }
            placement = "top"
          >
            <div>
              <span className = "date-text">{ this.props.userData && this.props.userData.timezone ? moment(data.created_at, "YYYY-MM-DD HH:mm:ss").tz(this.props.userData.timezone).format("MM/DD/YYYY HH:mm:ss").substr(0,10) : ""}</span>
              <br/>
              <span className = "time-text">{ this.props.userData && this.props.userData.timezone ? moment(data.created_at, "YYYY-MM-DD HH:mm:ss").tz(this.props.userData.timezone).format("MM/DD/YYYY HH:mm:ss").substr(10): ""}</span>
            </div>
          </HtmlTooltip>
         
        </TableCell>
        <TableCell align="left" onClick = {()=>{
            if(data.status !== "dialing_completed" &&  data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();
            }}>
          <span className = "date-text">{moment.tz(
                data.updated_at,
                "YYYY-MM-DD HH:mm:ss",
                this.props.userData.timezone,
              ).lang(this.props.lang).fromNow()}</span>
        </TableCell>
        <TableCell align="left"
           style = {{width:"200px"}}
           onClick = {(e)=>{
            // if(data.status === 'scheduled' || data.status === 'schedulation_idle') this.uiSrefToSchedule(data);
            // else  this.uiSref(data);
            if(data.status !== "dialing_completed"){ 
              if(data.status === "scheduled" || data.status === "schedulation_idle"){
                e.preventDefault();
                e.stopPropagation();
                this.props.editViewFun();
              } else {this.props.editViewFun();}
            }
           }}
        >
          {
            data.showStatusLoader || !this.getCampaignStatus(data)?(
              <img style={{width: "25px"}} src={blue_audio_spinner_big}></img>
            ):(
              null
            )
          }
          {
            data.showStatusLoader || !this.getCampaignStatus(data)?(
              null
            ):(
              <React.Fragment>
                  <div className={ this.getStatusClass(data)}>
                  {
                    data.status === 'schedulation_idle'?(
                          <a className = "idle_status_link" onClick = {()=>{
                            this.uiSrefToSchedule(data, 'idle');
                          }}>{this.getCampaignStatus(data)}</a>
                    ):(
                      null
                    )
                  }
                  {
                    data.status !== 'schedulation_idle'?(
                          <span>{this.getCampaignStatus(data) }</span>
                    ):(
                      null
                    )
                  }
                  </div>
                  {
                    (data.status === 'stop' || (this.hideOnDisabled && (data.status === 'start' || data.status === 'scheduled')))?(
                      null
                    ):(
                      this.getCampaignRecipientsText(data)
                    )
                  }
                  {
                    data.status === 'stop' || (this.hideOnDisabled && (data.status === 'start' || data.status === 'scheduled' || data.status === 'schedulation_idle' || data.status === 'schedulation_in_progress'))?(
                      null
                    ):(
                      this.getCampaignStatusText(data, this.props.lang)
                    )
                  }
                  {
                    this.isWaitingNextBatch(data)?(
                      <span  className="batch-send-status"> <Trans id = "campaign_overview_index_waiting_for_next" name = ""/> </span>
                    ):(
                      null
                    )
                  }
              </React.Fragment>
            )
          }
        </TableCell>
        <TableCell align="left" onClick = {()=>{
               if(data.status !== "dialing_completed" &&  data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();
            }}>
          {
            data.interactions.count?(
              
              <span>{data.interactions.count + " Interactions","campaign_statistics_batch"}
              <small> { this.calculateInteractionCost( data.interactions.count, data.interactions.cost, data.amount_spent) + "x"  /*"interaction"*/ } </small>
              </span>
            ):(
              <span>--</span>
            )
          }
        </TableCell>
        <TableCell align="left" style = {{minWidth:"120px"}} onClick = {()=>{
              if(data.status !== "dialing_completed" &&  data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();
            }}>
          <ProgressBar variant="success" now = {(this.getSuccessOfCampaign(data) / this.getTotalOfCampaign(data)) * 100} label = {this.getTotalOfCampaign(data)!=0?((this.getSuccessOfCampaign(data) / this.getTotalOfCampaign(data)) * 100).toFixed(2) + "%":""}/>
          <HtmlTooltip
              title={
              <React.Fragment>
                <Typography color="inherit">
                    <Trans id = "vm_overview_before_of"/>
                </Typography>
              </React.Fragment>
            }
            placement = "left"
          >
              <span>{this.getSuccessOfCampaign(data) }</span>
          </HtmlTooltip>
          <span> <Trans id = "pagination_of"/> </span>
          <HtmlTooltip
              title={
              <React.Fragment>
                <Typography color="inherit">
                     <Trans id = "vm_overview_after_of"/>
                </Typography> 
              </React.Fragment>
            }
            placement = "right"
          >
          <span>{this.getTotalOfCampaign(data) }</span>
          </HtmlTooltip>
          <br></br>
          {
            data.type === 'VOICE_WITH_SMS' && data.status !== 'saved' && data.success_phonenumbers[0]?(
              <span>{ this.getSuccessSmsVoiceOfCampaign(data) }</span>
            ):(
              null
            )
          }
          {
             data.calls_count.length >= 1?(
                <HtmlTooltip
                    title={
                    <React.Fragment>
                      <Typography color="inherit">
                           <Trans id = "vm_overview_before_call_made"/>
                      </Typography> 
                    </React.Fragment>
                  }
                  placement = "bottom"
                >
                <div>{ "( " + data.calls_count[0].count + " calls made )" }</div>
                </HtmlTooltip>
              ):(
                null
              )
          }
        </TableCell>
        <TableCell align="left" className = "cost-text" onClick = {()=>{
                if(data.status !== "dialing_completed" &&  data.status !== "scheduled" && data.status !== "schedulation_idle") this.props.editViewFun();
            }}>{ "€" + Number(this.getCostOfCampaign(data)).toFixed(2) }
        </TableCell>
        <TableCell align="left">
           <ShowMoreButton campaign = {data}  />
        </TableCell>
      </React.Fragment>
  
       )
  }
  componentDidUpdate(){
    if(this.state.expanded)
    {
      let options = {
        chart: {
          type: "column"
        },
        title: {
          text: "Interactions"
        },
        xAxis: {
          categories: [
              'Replay',
              'Transfer',
              'Callback',
              'BlockList',
          ],
          crosshair: true
      },
        series: [
          {
            name:"interactions",
            data: [0, 0, 0, 0]
          }
        ]
      };
      this.chart_instance = Highcharts.chart("chartDiv"+this.props.campaign_id, options);
    }
     
  }
  componentWillUnmount() {
    
  }
  render() {
    const { campagin } = this.props;

    if(campagin.status === "dialing_completed" || campagin.status === "scheduled" || campagin.status === "schedulation_idle")
    {
        var deliveredMessageCnt = 0;
        var unDeliveredMessageCnt = 0;
        var totalMessageCnt = campagin.total_phonenumbers[0]?campagin.total_phonenumbers[0].count:0;
        var successMessageCnt = campagin.success_phonenumbers[0]?campagin.success_phonenumbers[0].count:0;
        deliveredMessageCnt = successMessageCnt;
        unDeliveredMessageCnt = totalMessageCnt - deliveredMessageCnt;
        const ChartData = [
            {
                "date": 0,
                "value": parseInt(deliveredMessageCnt)
            },
            {
                "date": 1,
                "value": parseInt(unDeliveredMessageCnt)
            }
        ];

        return [

            <TableRow key="main" onClick={(event)=>this.toggleExpander(event)} className = "table-row">
            {
                this.render_campagin_row(campagin)
            }
            </TableRow>,
            this.state.expanded && (
              <TableRow className="expandable" key="tr-expander">
                <TableCell className="uk-background-muted" colSpan={12}>
                  <div  className = "inner"  >
                    <div className = "expanded-view">
                        <div className="uk-width-1-4 uk-text-center statistics-view" >
                          <div className = "campaign-info">
                          <Row>
                            <Col>
                                <List >
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar>
                                        <HomeIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Name" secondary={campagin.campaign_name} />
                                  </ListItem>
                                  <Divider variant="inset" component="li" />
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar>
                                        <CalendarIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Created on" secondary={campagin.created_at.substr(0,10)}/>
                                  </ListItem>
                                  <Divider variant="inset" component="li" />
                                  <ListItem>
                                    <ListItemAvatar>
                                      <Avatar>
                                        <CalendarIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Updated on" secondary={campagin.updated_at.substr(0,10)} />
                                  </ListItem>
                                </List>
                            </Col>
                          </Row>
                          </div>
                          <div className = "centered-chat-view">
                            <div className = "chat-view-wrapper"> 
                                <div className = "delivered-statistics-view"> 
                                  <HtmlTooltip
                                      title={
                                      <React.Fragment>
                                        <Typography component = "div" color="inherit" >
                                            Filter
                                        </Typography>
                                      </React.Fragment>
                                    }
                                    placement = "top"
                                  >
                                    <div 
                                        className = {this.state.only == "status"?"filter-view filter-selected":"filter-view"}
                                        onClick = {()=>{
                                          this.setState({
                                            only: this.state.only == null?"status":null,
                                            except: null
                                          })
                                        }}
                                      >
                                          <div className = "delviered-statistics">Delivered( {this.getSuccessOfCampaign(campagin)} )</div>
                                          <div className = "delivered-percent">{(this.getSuccessOfCampaign(campagin)*100 /this.getTotalOfCampaign(campagin)).toFixed(2) + "%" }</div>
                                      </div>   
                                  </HtmlTooltip>   
                                  <HtmlTooltip
                                      title={
                                      <React.Fragment>
                                        <Typography component = "div" color="inherit" >
                                            Filter
                                        </Typography>
                                      </React.Fragment>
                                    }
                                    placement = "top"
                                  >
                                     <div
                                        className = { this.state.except == "status"?"filter-view filter-selected":"filter-view"}
                                        onClick = {()=>{
                                          this.setState({
                                            except: this.state.except == null?"status":null,
                                            only: null
                                          })
                                        }}
                                      >
                                          <div className = "undelviered-statistics">Not delivered( {this.getTotalOfCampaign(campagin) - this.getSuccessOfCampaign(campagin)} )</div>
                                          <div className = "undelivered-percent">{((this.getTotalOfCampaign(campagin) - this.getSuccessOfCampaign(campagin) )*100 /this.getTotalOfCampaign(campagin)).toFixed(2) + "%" }</div>
                                      </div>
                                  </HtmlTooltip>      
                                    
                               </div>
                               <div>
                                      <PieChart 
                                          data={ChartData}
                                          width={160}
                                          height={160}
                                          innerRadius={40}
                                          outerRadius={80}
                                      />
                                  </div>
                              </div>
                          </div>

                          <div style = {{width:"33%", height:"260px"}} id = {"chartDiv"+this.props.campaign_id}>

                          </div>
                        </div>
                        <div className = "phone-numbers-view">
                            <CampaignPNumberTable campaign_id = {campagin._id} only = {this.state.only} except = {this.state.except} />
                        </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )
          ];
    } else {
        return (

            <TableRow key="main" className = "table-row" >
                {
                    this.render_campagin_row(campagin)
                }
              </TableRow>
            )
    }
   
  }
}



class campaignTable extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      campaigns: [],
       loading: true,
    }
    this.table_wrapper    = null;
    this.currentPageIndex = 0;
    this.totalCampaignCount = 0;
    this.editViewFun = this.editViewFun.bind(this);
    this.setOrderAndField = this.setOrderAndField.bind(this);
  }

  setOrderAndField = (orderName) => {
    if(this.props.orderField == orderName){
      if(this.props.order == "DESC"){
        this.props.campaignActions.setOrder("ASC");
      } else {
        this.props.campaignActions.setOrder("DESC");
      }
    } else {
        this.props.campaignActions.setOrderField(orderName);
        this.props.campaignActions.setOrder("DESC");
    }
  }
  editViewFun = (campaign) => {
    this.props.history.push(`/campaign/edit/${campaign._id}`);
  }
  render() {
    return (
      <main>
            <div className="message-table">
             <div className="table-wrapper">
                <Table  stickyHeader aria-label="sticky table" >
                  <TableHead className = "table-header">
                    <TableRow>
                      <TableCell align="center" ><Trans id = "campaign_overview_index_features"/></TableCell>
                      <TableCell align="left"  onClick = {()=>{this.setOrderAndField("campaign_name")}}>
                            <Trans id = "campaign_overview_index_name"/>
                            {
                              this.props.orderField === "name" ? (
                                this.props.order === "DESC" ? (
                                  <ArrowUpIcon/>
                                ):(
                                  <ArrowDownIcon/>
                                )
                              ):null
                            }
                      </TableCell>
                      <TableCell align="left"  onClick = {()=>{this.setOrderAndField("created_at")}}>
                           <Trans id = "created_on"/>
                           {
                              this.props.orderField === "created_at"?(
                                this.props.order === "DESC"?(
                                  <ArrowUpIcon/>
                                ):(
                                  <ArrowDownIcon/>
                                )
                              ):null
                            }
                      </TableCell>
                      <TableCell align="left"  onClick = {()=>{this.setOrderAndField("updated_at")}}>
                           <Trans id = "updated_on"/>
                           {
                              this.props.orderField === "updated_at"?(
                                this.props.order === "DESC"?(
                                  <ArrowUpIcon/>
                                ):(
                                  <ArrowDownIcon/>
                                )
                              ):null
                            }
                      </TableCell>
                      <TableCell align="left" ><Trans id = "campaign_overview_index_status"/></TableCell>
                      <TableCell align="left" ><Trans id = "campaign_statistics_interactions"/></TableCell>
                      <TableCell align="left" ><Trans id = "campaign_overview_index_delivered"/></TableCell>
                      <TableCell align="left" ><Trans id = "campaign_overview_index_cost"/></TableCell>
                      <TableCell align="left" ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      this.props.campaigns.length > 0 ? this.props.campaigns.map((data, index) =>(
                            <CampaginRow key={index} index={index + 1} lang = {this.props.lang} campagin={data} campaign_id = {index} userData = {this.props.userData} editViewFun = {()=>this.editViewFun(data)}/>
                          )                     
                        ):(null)
                    }
                  </TableBody>
                </Table>
            </div>
          </div>
      </main>
    );
  }
}
export default withRouter(connect(
  state => ({
    order: state.campaign.order,
    orderField: state.campaign.orderField,
    lang: state.i18n.lang,
  }),
  dispatch => ({
    campaignActions: bindActionCreators({ setOrderField, setOrder , clearCampaigns}, dispatch),
    composeActions: bindActionCreators({ initComposeData}, dispatch),
  })
)(campaignTable));
