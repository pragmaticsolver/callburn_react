import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment-timezone';
import {Spinner, Pagination} from 'react-bootstrap';
//import material ui components;
import {Table, TableHead, TableBody, TableRow, TableCell, Fab} from '@material-ui/core';
import AddIcon from '@material-ui/icons/NoteAdd';
//import image icons;
import BIcon from 'assets/images/compose/blacklist.svg';
import VSIcon from 'assets/images/overview/overview_vm.svg';
import SIcon from  'assets/images/overview/overview_sms.svg';
//import actions;
import {getCampaignPhonenumbers} from '../../../../../../../../../store/app_services/campaign/campaignApi';
import {showModal} from '../../../../../../../modals/modalConductorActions';
import Trans from '../../../../../../../utils/Trans';
class ContactsTable extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            contactsData: [],
            loading: false
        }
        this.makePagenationItems = this.makePagenationItems.bind(this);
    }
    async getContactsF(params)
    {
        var  campaignPhonenumbers = getCampaignPhonenumbers(params);
        await campaignPhonenumbers.then((res) => {
            this.setState({
                contactsData: res.resource,
                loading: false
            })
        })
    }
    componentDidMount(){
        var params = {
            campaign_id:  this.props.campaign_id,
            statuses: "['success','failed','sent','IN_PROGRESS']",
            only: this.props.only,
            except: this.props.except
        }
        this.getContactsF(params);
        this.setState({
            loading: true
        })
    }
    componentDidUpdate(prevProps){
      var params = {};
      if( prevProps.addCommentLoading === true && this.props.addCommentLoading === false && this.props.addCommentSuccess === true)
      {
        params = {
          campaign_id:  this.state.contactsData.campaign._id,
          statuses: "['success','failed','sent','IN_PROGRESS']",
          page: this.state.contactsData.page > 1 ? this.state.contactsData.page -1: 0,
          only: this.props.only,
          except: this.props.except
        }
        this.getContactsF(params);
        this.setState({
            loading: true
        })
      } else if (  prevProps.only !== this.props.only || prevProps.except !== this.props.except)
      {
         params = {
          campaign_id:  this.state.contactsData.campaign._id,
          statuses: "['success','failed','sent','IN_PROGRESS']",
          page: 0,
          only: this.props.only,
          except: this.props.except
        }
        this.getContactsF(params);
        this.setState({
            loading: true
        })
      }

    }
    getPhonenumberSchedulationDate = (phonenumber) => {
        // if (!$scope.schedulations) {
        //   return null;
        // }
  
        // for (var i = 0; i < $scope.schedulations.length; i++) {
        //   if ($scope.schedulations[i]._id === phonenumber.schedulation_id) {
        //     return $scope.schedulations[i].scheduled_date;
        //   }
        // }
  
        // return null;
      };
    getStatus = (phonenumber, campaign) => {
        if (phonenumber.status === "IN_PROGRESS") {
        //   if (!phonenumber.schedulation_id) {
        //     phonenumber.statusClass = "save-as-draft-status snippet_blinking";
        //     return <Trans id ="campaign_sending_in_progress" />;
        //   }
        //   var scheduleDate = getPhonenumberSchedulationDate(phonenumber);
        //   if (scheduleDate) {
        //     scheduleDate = moment(scheduleDate, "YYYY-MM-DD h:mm:ss");
        //     if (
        //       moment()
        //         .tz(window.SERVER_TIMEZONE)
        //         .diff(scheduleDate) >= 0
        //     ) {
        //       phonenumber.statusClass = "save-as-draft-status snippet_blinking";
        //       return <Trans id ="campaign_sending_in_progress"/>;
        //     } else {
        //       phonenumber.statusClass = "schedulation-in-progress-status";
        //       return <Trans id ="waiting_for_schedulation"/>;
        //     }
        //   }
        //   phonenumber.statusClass = "schedulate-status";
          return <Trans id="waiting_for_schedulation"/>;
        }
  
        if (campaign.type === "VOICE_MESSAGE") {
          if (phonenumber.status === "SUCCEED") {
            // phonenumber.statusClass = "sent-statistics-status";
            return <Trans id ="campaign_statistics_delivered"/>;
          }
        } else if (campaign.type === "VOICE_WITH_SMS") {
          if (
            phonenumber.status === "SUCCEED" ||
            phonenumber.status === "CALL_FAILED_SMS_SUCCEED"
          ) {
            // phonenumber.statusClass = "sent-statistics-status";
            return <Trans id = "campaign_statistics_delivered"/>;
          }
        } else if (campaign.type === "SMS") {
          if (phonenumber.status === "SUCCEED") {
            // phonenumber.statusClass = "sent-statistics-status";
            return <Trans id ="campaign_statistics_delivered"/>;
          }
        }
  
        if (phonenumber.status === "IDLE") {
        //   phonenumber.statusClass = "schedulate-status";
          return <Trans id ="campaign_statistics_idle"/>;
        }
  
        if (phonenumber.status === "SUCCEED") {
        //   phonenumber.statusClass = "save-as-draft-status";
          if (phonenumber.calls.length) {
            // return $filter("localDate")(
            //   phonenumber.calls[phonenumber.calls.length - 1].dialled_datetime
            // );
          }
        }
  
        if (phonenumber.status === "CANT_CALL_DUE_TO_EU") {
        //   phonenumber.statusClass = "dark_orange";
          return <Trans id ="cant_call_due_eu"/>;
        }
  
        // phonenumber.statusClass = "dark_orange";
  
        return <Trans id ="campaign_statistics_not_delivere"/>;
      };
    getDeliveredHour = (data) => {
        if (data) {
          var hour = moment(data).format("HH:mm:ss");
          return hour;
        }
      };
    getDeliveredDate = (data) => {
        if (data) {
          var date = moment(data).format("YYYY-MM-DD");
          return date;
        }
      };
    makePagenationItems = (totalCount) => {
      var list = [];
      var startPage =  10 * Math.floor(this.state.contactsData.page / 10);
      var itemNumber;
      if(startPage === 0) itemNumber = 1;
      else itemNumber = startPage;
      if(itemNumber > 1) list.push(itemNumber -1)
      for(var i = startPage * 30; i <=  Math.min((startPage + 10) * 30, totalCount); i+=30)
      {
        list.push(itemNumber);
        itemNumber++;
      }
      return(
        <React.Fragment>
          <Pagination.First />
          {
            this.state.contactsData.page > 1 ? (
              <Pagination.Prev />
            ):(null)
          }
          {
            this.state.contactsData.page > 9 ? (
              <React.Fragment>
                 <Pagination.Item>{1}</Pagination.Item>
                 <Pagination.Ellipsis />
              </React.Fragment>
            ):(null)
          }
         
          {
            list.map((item,index)=>(
              <Pagination.Item key = {index} active={item===this.state.contactsData.page}
                onClick = {()=>{
                  var params = {
                    campaign_id:  this.state.contactsData.campaign._id,
                    statuses: "['success','failed','sent','IN_PROGRESS']",
                    page: item - 1,
                    only: this.props.only,
                    except: this.props.except
                  }
                  this.getContactsF(params);
                  this.setState({
                      loading: true
                  })
                }}
              >
                 {item}
              </Pagination.Item>
            ))
          }
          {
            (startPage + 10) * 30 < totalCount ? (
              <React.Fragment>
                 <Pagination.Ellipsis />
                 <Pagination.Item>{Math.floor(totalCount / 30)}</Pagination.Item>
              </React.Fragment>
            ):(null)
          }
          {
            this.state.contactsData.page < Math.floor(totalCount/30) ? (
              <React.Fragment>
                 <Pagination.Next />
                 <Pagination.Last />
              </React.Fragment>  
            ):(null)
          }
        
        </React.Fragment>
      )
    }
    blockListIs = (phonenumber) => {
      var result = false;
      phonenumber.black_list.map((list) => {
        if(list.archived_phonenumber_id === phonenumber._id) result = true;
      })
      return result;
    }
    render(){
        return(
            <div>
               <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align = "left"><Trans id = "campaign_statistics_recipient"/></TableCell>
                            <TableCell align = "center"><Trans id = "name"/></TableCell>
                            <TableCell align = "center"><Trans id = "campaign_statistics_delivered_on"/></TableCell>
                            <TableCell align = "center"><Trans id = "campaign_statistics_interactions"/></TableCell>
                            <TableCell align = "center"><Trans id = "campaign_statistics_total_time"/></TableCell>
                            <TableCell align = "center"><Trans id = "campaign_statistics_cost"/></TableCell>
                            <TableCell align = "center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {
                           !this.state.loading && this.state.contactsData && this.state.contactsData.phonenumbers && this.state.contactsData.phonenumbers.length ? 
                               this.state.contactsData.phonenumbers.map((phonenumber, index) => (
                                   <TableRow key = {index}>
                                       <TableCell  align = "left">
                                            <img src={"/media/flag1/"+ phonenumber.tariff.country.code +".svg"} alt="image"  />
                                            {
                                            "+" + phonenumber.phone_no
                                            }
                                       </TableCell>
                                       <TableCell  align = "center">
                                       {
                                          phonenumber.contacts.name?phonenumber.contacts.name:"--"
                                       }
                                       </TableCell>
                                       <TableCell  align = "center" style = {{color:phonenumber.status === "SUCCEED" || phonenumber.status == "CALL_FAILED_SMS_SUCCEED"?"#5ccc5e":"red"}}>
                                           {
                                               this.getStatus(phonenumber, this.state.contactsData.campaign)
                                           }
                                           <br/>
                                           <span>
                                               {
                                                   phonenumber.status === 'BLACKLISTED' ? (
                                                       <img src = {BIcon} alt = "" style = {{width:"20px"}}/>
                                                   ):(null)
                                               }
                                               {
                                                    phonenumber.status === 'SUCCEED' && phonenumber.total_duration > 0 ? (
                                                        <img src = {VSIcon} alt = "" style = {{width:"20px"}}/>
                                                    ):(null)
                                               }
                                               {
                                                   phonenumber.status === 'CALL_FAILED_SMS_SUCCEED' || (phonenumber.status === 'SUCCEED' && phonenumber.total_duration === 0) ? (
                                                        <img src = {SIcon} alt = "" style = {{width:"20px"}}/>
                                                   ):(null)
                                               }
                                           </span>
                                           <span>
                                               {
                                                   phonenumber.calls[0] ? this. getDeliveredHour(phonenumber.calls[0].dialled_datetime):null
                                               }
                                           </span>
                                           <p>
                                              {
                                                  phonenumber.calls[0] ? this.getDeliveredDate(phonenumber.calls[0].dialled_datetime):null
                                              }  
                                           </p>
                                       </TableCell>
                                       <TableCell  align = "center">--</TableCell>
                                       <TableCell  align = "center">
                                        {
                                            phonenumber.total_duration
                                        }
                                       </TableCell>
                                       <TableCell  align = "center">
                                        {
                                           "€" + phonenumber.total_cost.toFixed(2) 
                                        }
                                       </TableCell>
                                       <TableCell  align = "center">
                                         <span title = "Make and add commite"
                                          onClick = {()=>{
                                            var params = {
                                               comment: phonenumber.comment,
                                               phonenumberId: phonenumber._id
                                            }
                                            this.props.Actions.showModal("MAKE_AND_ADD_COMMENT", params)
                                          }}
                                         > <Fab size="small" color="default" aria-label="AddCommit"><AddIcon/></Fab></span>
                                         {/* <span title = {this.blockListIs(phonenumber) == true?"Remove number from blocklist":"Add number to block list"}> <Fab size="small" color={this.blockListIs(phonenumber) == true?"primary":"default"} aria-label="Block"><LockIcon/></Fab></span> */}
                                         {/* <span title = "Send again"> <Fab size="small" color="default" aria-label="Send"><SendIcon/></Fab></span> */}
                                       </TableCell>
                                   </TableRow>
                               )):(
                                  null
                               )
                       }
                    </TableBody>
                </Table>
                <div style = {{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5px"}}>
                   {
                       this.state.loading === true  ?(
                            <Spinner animation="border" variant="primary" size = "lg"/>
                       ):(null)
                   }
                </div>      
                <div style = {{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5px"}}>
                   <Pagination>
                       {
                         this.state.contactsData && this.state.contactsData.phonenumbers ? this.makePagenationItems(this.state.contactsData.phonenumbers_count):null
                       }
                   </Pagination>
                </div>
                 
            </div>
        )
    }
}
export default connect(
  state => ({
    addCommentLoading: state.campaign.addCommentLoading,
    addCommentSuccess: state.campaign.addCommentSuccess
  }),
  dispatch => ({
     Actions: bindActionCreators({ showModal }, dispatch)
  })
)(ContactsTable);
