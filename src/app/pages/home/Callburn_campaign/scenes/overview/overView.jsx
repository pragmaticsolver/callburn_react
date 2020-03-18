import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link , withRouter} from "react-router-dom";
import Swal from 'sweetalert2';
import {toastr} from 'react-redux-toastr'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/AddCircle';
//import Custom Components
import Filter from './components/filter/filter';
import MessageTable from './components/messageTable/messageTable1';
//import styles
import './overView.scss';
import 'assets/callburn/style/scss/modules/_overview.scss';
//import functions in utils;
import Trans from '../../../utils/Trans';
//import actions;
import { getCampaigns,setCampaigns,  clearCampaigns, createGroupForUndelivered } from '../../../../../store/app_services/campaign/campaignAction';
import { initComposeData } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import {showModal} from '../../../modals/modalConductorActions';

import { getCampaigns as getCampaignApi } from '../../../../../store/app_services/campaign/campaignApi';
//import socket;
import socketIOClient from "socket.io-client";
class OverViewForm extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      timeCount: 0
    }
    this.socket = null;
    this.timer = null;
    this.page = 1;
    this.loading = false;
    this.getCampaign_handle = this.getCampaign_handle.bind(this);
    this.makeFilterParmas = this.makeFilterParmas.bind(this);
    this.pageScrollEvent = this.pageScrollEvent.bind(this);
  }
  makeFilterParmas = (_params) => {
    var params = {};
    if(_params.checkbox.size > 0)
    {
        var filterByStatusParams = "[";
        var iterator1 = _params.checkbox.values();
        for(var i = 0; i < _params.checkbox.size; i++){
          filterByStatusParams += '"' + iterator1.next().value + '"';
          if( i < _params.checkbox.size - 1){
              filterByStatusParams += ",";
          }
        }
        filterByStatusParams += "]";
        params.checkbox = filterByStatusParams;
    }
    if(_params.date_range)  params.date_range = _params.date_range;
    if(_params.type)        params.type = _params.type;
    if(_params.order)       params.order = _params.order;
    if(_params.order_field) params.order_field = _params.order_field;
    if(_params.page)        params.page = _params.page;
    // if(_params.per_page)    params.per_page = _params.per_page;
    return params;
  }
  getCampaign_handle =(initPage)=>{
    const params = {
      checkbox: this.props.filterByStatus,
      date_range:this.props.filterByCreationDate,
      type: this.props.filterByMessageType,
      order: this.props.order,
      order_field: this.props.orderField,
      page: initPage ? 0: this.page,
      // per_page: initPage?20:7
    }
    this.props.campaignActions.getCampaigns(this.makeFilterParmas(params));
  }
  pageScrollEvent = () => {
    if( document.body.scrollHeight - window.scrollY - document.body.clientHeight < 20 && this.loading === false && this.props.totalCampaignCount > this.props.campaigns.length)
    {
      this.getCampaign_handle();
      this.page = this.page + 1;
    }
  }
  timeUp = () => {
    var timeCount = this.state.timeCount;
    timeCount ++;
    if(timeCount > 100) timeCount = 0;
    this.setState({
      timeCount: timeCount
    })
  }
  componentWillUnmount(){
     window.removeEventListener('scroll', this.pageScrollEvent);
     this.props.campaignActions.clearCampaigns();
     this.page = 1;
     this.socket.disconnect();
     clearInterval(this.timer);
  }
  componentDidMount(){
     window.addEventListener('scroll', this.pageScrollEvent);
     this.timer = setInterval(this.timeUp, 60000)
     if(this.props.firstGetting === false)
     {
        this.getCampaign_handle(true);
        this.page = 1; 
     }
     this.socket = socketIOClient("https://beta.callburn.com/");
     var self = this;
     this.socket.on(`update-message-${this.props.userData._id}`, async (res) => {
         for(var i = 0 ;i < self.props.campaigns.length; i++)
         {
           if(self.props.campaigns[i]._id === res.data.campaign_id)
           {
              var _campaigns = [];
              for(var j = 0 ;j < self.page; j++)
              {
                const params = {
                  checkbox: self.props.filterByStatus,
                  date_range:self.props.filterByCreationDate,
                  type: self.props.filterByMessageType,
                  order: self.props.order,
                  order_field: self.props.orderField,
                  page: j,
                }
                var compaginData = await getCampaignApi(params);
                _campaigns = _campaigns.concat(compaginData.resource.campaigns);
              }
              this.props.campaignActions.setCampaigns(_campaigns);
           }
         }
     });
  }
  filterStatusCompare = (prev, next) => {
      if(prev === null || next === null) return false;
      else if(prev.size !== next.size) return true;
      else return false;
  }
  componentDidUpdate(prevProps, prevState){
    this.loading = this.props.loading;
    if(prevProps.order !== this.props.order || prevProps.orderField !== this.props.orderField || this.filterStatusCompare(prevProps.filterByStatus, this.props.filterByStatus) === true || prevProps.filterByCreationDate !== this.props.filterByCreationDate || prevProps.filterByMessageType !== this.props.filterByMessageType)
    {
        this.getCampaign_handle(true);
        this.page = 1;
    }
    if(this.props.campaigns.length > 0 && this.page === 1 && document.body.scrollHeight - document.body.clientHeight < 20 && this.loading === false && this.props.totalCampaignCount > this.props.campaigns.length)
    {
      //  this.getCampaign_handle();
      //  this.page = this.page + 1;
    }
    if(this.props.deleteCampaignLoading === true)
    {
      Swal.fire({
        title: 'Deleting campaign...',
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
      if(prevProps.deleteCampaignSuccess !== this.props.deleteCampaignSuccess && this.props.deleteCampaignSuccess === true)
      {
         toastr.success("Success!", this.props.message);
         this.props.history.push('/');
      }
    }
    if(this.props.updatingCampaignStatusLoading === true)
    {
      Swal.fire({
        title: 'Updating campaign...',
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
      if(prevProps.deleteCampaignSuccess !== this.props.deleteCampaignSuccess && this.props.deleteCampaignSuccess === true)
      {
        //  toastr.success("Success!", this.props.message);
         this.props.history.push('/');
      }
    }
    if(this.props.retryDataLoading === true)
    {
      Swal.fire({
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
      if(prevProps.retryData !== this.props.retryData && this.props.retryDataError === null && this.props.retryCampaign !== null)
      {
        var neverCalled = this.props.retryData.resource.neverCalled;
        var undelivered = this.props.retryData.resource.undelivered;
        // var undeliveredAndNeverCalled = this.props.retryData.resource.undeliveredAndNeverCalled;
        if (!neverCalled && undelivered) {
          this.props.campaignActions.createGroupForUndelivered({
            condition: "undelivered",
            message_id: this.props.retryCampaign._id 
          })
        } else if (!undelivered && neverCalled) {
          this.props.campaignActions.createGroupForUndelivered({
            condition: "neverCalled",
            message_id: this.props.retryCampaign._id 
          })
        } else if (
          (neverCalled && undelivered) ||
          (!neverCalled && !undelivered)
        ) {
            this.props.modalActions.showModal("RETRY_CONFIRM");
        }
      }
    }
    if(this.props.creatingGroupForUndeliveredLoading === true)
    {
      Swal.fire({
        text: "",
        onOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      });
    } else {
      if(!this.props.retryDataLoading)Swal.close();
      if(prevProps.creatingGroupForUndeliveredLoading === true && this.props.groupIdOfUndelivered !== null && this.props.retryCampaign !== null)
      {
        this.props.composeActions.initComposeData({...this.props.retryCampaign, groups:[{_id: this.props.groupIdOfUndelivered}]});
        this.props.history.push("/campaign/create/manulaycreate");
      }
    }
  }
  
  render(){
    return(
      <React.Fragment >
        <div className = "campaignView">
            <div className = "form-info">
                <h3 className = "title">
                  <Trans id = "campaign_compose_overview" name = ""/>
                </h3>
                <h5 className = "des"><Trans id = "campaign_overview_index_find_here_all" name = ""/></h5>
            </div>
            <div className = "filter-area">
                <Filter />
            </div>
            <div className = "create-campaign-btn">
                <Link
                to = "/campaign/create" 
                >
                  <Fab
                    variant="extended"
                    size="medium"
                    color="secondary"
                    aria-label="add"
                    style = {{padding:"0px 50px"}}
                  >
                    <AddIcon style = {{marginRight:"10px"}}/>
                    <Trans id = "account_settings_add_new" />
                  </Fab>
                </Link>
            </div>
            <div  className = "messageTable-area">
              <MessageTable campaigns = {this.props.campaigns.length > 7 && this.page === 1 ? []: this.props.campaigns } userData = {this.props.userData}/>
            </div>
        </div>
       
      </React.Fragment>
    )
  }
}

export default withRouter(connect(
  state => ({
    loading: state.campaign.loading,
    firstGetting: state.campaign.firstGetting,
    filterByStatus:state.campaign.filterByStatus,
    filterByCreationDate: state.campaign.filterByCreationDate,
    filterByMessageType: state.campaign.filterByMessageType,
    order: state.campaign.order,
    orderField: state.campaign.orderField,
    campaigns: state.campaign.campaigns,
    totalCampaignCount: state.campaign.totalCampaignCount,
    deleteCampaignLoading: state.campaign.deleteCampaignLoading,
    deleteCampaignSuccess: state.campaign.success,
    message: state.campaign.message,
    updatingCampaignStatusLoading: state.campaign.updatingCampaignStatusLoading,
    //Retry part;
    retryCampaign: state.campaign.retryCampaign,
    retryData: state.campaign.retryData,
    retryDataLoading: state.campaign.retryDataLoading,
    retryDataError: state.campaign.retryDataError,
    //--------
    userData:state.user.userData,
    //---Create Group for Undelivered  part;
    creatingGroupForUndeliveredLoading: state.campaign.creatingGroupForUndeliveredLoading,
    creatingGroupForUndeliveredSucceed: state.campaign.creatingGroupForUndeliveredSucceed,
    creatingGroupForUndeliveredError: state.campaign.creatingGroupForUndeliveredError,
    groupIdOfUndelivered: state.campaign.groupIdOfUndelivered,
    //-----
  }),
  dispatch => ({
    campaignActions: bindActionCreators({ getCampaigns, setCampaigns,  clearCampaigns, createGroupForUndelivered }, dispatch),
    composeActions: bindActionCreators({ initComposeData }, dispatch),
    modalActions: bindActionCreators({showModal}, dispatch),
  })
)(OverViewForm));
