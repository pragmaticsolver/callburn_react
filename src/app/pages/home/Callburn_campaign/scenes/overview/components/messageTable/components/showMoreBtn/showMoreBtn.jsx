import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import {DropdownButton, Dropdown} from 'react-bootstrap';
import Swal from 'sweetalert2';
//import translation component
import Trans from "../../../../../../../utils/Trans";
//import actions;
import {deleteCampaign, updateCampaignStatus, getRetry} from '../../../../../../../../../store/app_services/campaign/campaignAction';
import {initComposeData} from '../../../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
import { retryUndelivered , createGroupForUndelivered} from '../../../../../../../../../store/app_services/campaign/campaignApi';
import { showModal } from '../../../../../../../modals/modalConductorActions';
class ShowMoreButton extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            anchorEl: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
  handleClick = (event) => {
    this.setState({
        anchorEl:event.currentTarget
    })
  };
  handleClose = () => {
    this.setState({
        anchorEl:null
    })
  };
  changeMessageStatus = (status, campaign) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action is irreversible.!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.props.campaignActions.updateCampaignStatus({
          status: status,
          campaign_id: campaign._id
        });
      }
    })
  };
  getSuccessOfCampaign = (campaign) => {
    // if (campaign.status === 'schedulation_in_progress') {
    //     return 0;
    // }
    return campaign.success_phonenumbers[0]
      ? campaign.success_phonenumbers[0].count
      : 0;
  };
  accessForMarkAsCompleted = (campaign) => {
    if (
      campaign.status === "stop" ||
      (campaign.status === "schedulation_idle" &&
        campaign.calls_count.length) ||
      (campaign.status === "scheduled" && campaign.calls_count.length)
    ) {
      return true;
    }
    return false;
  };
  async retryUndelivered(campaign){
    // $scope.retryUndeliverSpinner = true;
    // var voice_file_id = campaign.voice_file ? campaign.voice_file._id : null;
    var retryUndeliveredData = retryUndelivered(campaign._id);
    await retryUndeliveredData.then((data)=>{
      var neverCalled = data.resource.neverCalled;
      var undelivered = data.resource.undelivered;
      // var undeliveredAndNeverCalled =   data.resource.undeliveredAndNeverCalled;
      if (!neverCalled && undelivered) {
        // var createGroupResult = createGroupForUndelivered({message_id:campaign.id});
        // await createGroupResult.then((data)=>{
          // var groupObject = {};
          // var groupObject[data.resource.group_id] = true;
          // var retryUndeliverSpinner = false;
          // var params = {
          //   reusing_source: "both",
          //   campaign_id: campaign._id,
          //   file_id: voice_file_id,
          //   group_ids: groupObject,
          //   hide_all_arrows: true
          // };

        // })
      }
    })
    // Restangular.one("campaigns/retry-undelivered/" + campaign._id)
    //   .get()
    //   .then(function(data) {
    //     var neverCalled = data.resource.neverCalled;
    //     var undelivered = data.resource.undelivered;
    //     var undeliveredAndNeverCalled =
    //       data.resource.undeliveredAndNeverCalled;
    //     if (!neverCalled && undelivered) {
    //       Restangular.all("campaigns/create-group-for-undelivered")
    //         .post({ condition: "undelivered", message_id: campaign._id })
    //         .then(function(data) {
    //           var groupObject = {};
    //           groupObject[data.resource.group_id] = true;
    //           $scope.retryUndeliverSpinner = false;
    //           $state.go("campaign.compose", {
    //             reusing_source: "both",
    //             campaign_id: campaign._id,
    //             file_id: voice_file_id,
    //             group_ids: groupObject,
    //             hide_all_arrows: true
    //           });
    //         });
    //     } else if (!undelivered && neverCalled) {
    //       Restangular.all("campaigns/create-group-for-undelivered")
    //         .post({ condition: "neverCalled", message_id: campaign._id })
    //         .then(function(data) {
    //           var groupObject = {};
    //           groupObject[data.resource.group_id] = true;
    //           $scope.retryUndeliverSpinner = false;
    //           $state.go("campaign.compose", {
    //             reusing_source: "both",
    //             campaign_id: campaign._id,
    //             file_id: voice_file_id,
    //             group_ids: groupObject,
    //             hide_all_arrows: true
    //           });
    //         });
    //     } else if (
    //       (neverCalled && undelivered) ||
    //       (!neverCalled && !undelivered)
    //     ) {
    //       $scope.retryUndeliverSpinner = false;
    //       CallBournModal.open(
    //         {
    //           scope: {
    //             neverCalled: data.resource.neverCalled,
    //             undelivered: data.resource.undelivered,
    //             undeliveredAndNeverCalled:
    //               data.resource.undeliveredAndNeverCalled
    //           },
    //           templateUrl: "app/modals/camping-batch/retry-undelivered.html"
    //         },
    //         function(scope) {
    //           scope.makeRetryDisable = false;
    //           scope.send = function(part) {
    //             scope.makeRetryDisable = true;
    //             scope.undeliverSpinner = false;
    //             scope.neverCalledSpinner = false;
    //             switch (part) {
    //               case "undelivered":
    //                 scope.undeliverSpinner = true;
    //                 break;
    //               case "neverCalled":
    //                 scope.neverCalledSpinner = true;
    //                 break;
    //               case "undeliveredAndNeverCalled":
    //                 scope.undeliveredAndNeverCalledSpinner = true;
    //                 break;
    //               default:
    //                 break;
    //             }
    //             Restangular.all("campaigns/create-group-for-undelivered")
    //               .post({ condition: part, message_id: campaign._id })
    //               .then(function(data) {
    //                 CallBournModal.close();
    //                 var groupObject = {};
    //                 groupObject[data.resource.group_id] = true;
    //                 $state.go("campaign.compose", {
    //                   reusing_source: "both",
    //                   campaign_id: campaign._id,
    //                   file_id: voice_file_id,
    //                   group_ids: groupObject,
    //                   hide_all_arrows: true
    //                 });
    //               });
    //           };
    //           scope.close = function() {
    //             CallBournModal.close();
    //           };
    //         }
    //       );
    //     } else {
    //       $scope.retryUndeliverSpinner = false;
    //     }
    //   });
  };
  allowDeleteIfNotInProgress = (campaign) => {
    if (
      campaign.status === "start" ||
      campaign.status === "schedulation_in_progress"
    ) {
      return false;
    }
    return true;
  };
  removeCampaign = (id) => {
    // ConfirmDeleteModal().then(function() {
    //   $scope.tableSpinnerLoading = true;
    //   Restangular.one("campaigns/remove-campaign", id)
    //     .remove()
    //     .then(function(data) {
    //       $scope.tableSpinnerLoading = false;
    //       getNewCampaigns($scope.filterData, null, true);
    //       var elemPos = $scope.campaignsToShow
    //         .map(function(item) {
    //           return item.id;
    //         })
    //         .indexOf(id);
    //       $scope.campaignsToShow.splice(elemPos, 1);
    //     });
    // });
  };
  render(){
    return (
        <div>
          <DropdownButton
              alignRight
              title= {<Trans id = "campaign_overview_index_more"/>}
              id="dropdown-more-action-button"
              variant="success"
              onClick = {(event) => {
                event.preventDefault();event.stopPropagation();
              }}
          >
              {
                  this.props.campaign.status === 'start' || this.props.campaign.status === 'schedulation_in_progress'?(
                    <Dropdown.Item eventKey = "0" onClick={(event)=>{
                        event.preventDefault();event.stopPropagation();
                        this.changeMessageStatus('stop', this.props.campaign)
                        }
                    }>
                       <Trans id = "campaign_overview_index_stop" name = ""/>
                    </Dropdown.Item>
                  ):
                  (
                    null
                  )
              }
              {
                  this.getSuccessOfCampaign(this.props.campaign) > 0?(
                    <Dropdown.Item onClick={(event)=>{
                      event.preventDefault();event.stopPropagation();
                      
                      }}> 
                        {/* <a href="">  */}
                        <Trans id = "campaign_statistics_export_statistics" name = ""/>
                        {/* {{ trans("campaign_statistics_export_statistics") }}  */}
                               {/* <img ng-show="exportCampaignLoader" src="assets/callburn/images/images/gray-audio-spinner.svg" class="balance_spinner width_20" alt=""> */}
                        {/* </a> */}
                    </Dropdown.Item>
                  ):(
                    null
                  )
              }
              {
                  ( this.props.campaign.status === 'scheduled' || this.props.campaign.status === 'saved' || this.props.campaign.status === 'schedulation_idle') && this.props.campaign.grouping_type === 'NONE'?(
                    <Dropdown.Item onClick={(event)=>{
                      event.preventDefault();event.stopPropagation();
                      this.props.history.push(`/campaign/edit/${this.props.campaign._id}`)
                      }}>
                        <Trans id = "campaign_overview_index_edit" name = ""/>
                        {/* <a href="#" ui-sref="campaign.edit({campaign_id: campaign._id})">{{ trans("campaign_overview_index_edit") }} </a> */}
                    </Dropdown.Item>
                  ):(
                     null
                  )
              }
              {
                  this.props.campaign.status !== 'scheduled' && this.props.campaign.status !== 'schedulation_idle' && this.props.campaign.status !== 'saved' && this.props.campaign.prototype?(
                        <Dropdown.Item onClick={(event)=>{
                          event.preventDefault();event.stopPropagation();
                          
                          }}>
                            <Trans id = "campaign_overview_index_edit_next" name = ""/>
                            {/* <a href="#" ui-sref="campaign.edit({campaign_id: campaign.prototype._id})">{{ trans("campaign_overview_index_edit_next") }} </a> */}
                        </Dropdown.Item>
                  ):(
                        null
                  )
              }
              {
                  this.props.campaign.status === 'stop' || this.props.campaign.status === 'stopped_low_balance'?(
                        <Dropdown.Item onClick={(event) => {
                          event.preventDefault();event.stopPropagation();
                            this.changeMessageStatus('start', this.props.campaign);
                            
                        }}>
                            <Trans id = "campaign_overview_index_restart" name = ""/>
                        </Dropdown.Item>
                  ):(
                        null
                  )
              }
              {
                  this.accessForMarkAsCompleted(this.props.campaign)?(
                    <Dropdown.Item onClick={(event)=>{
                           event.preventDefault();event.stopPropagation();
                           this.changeMessageStatus('dialing_completed', this.props.campaign);
                           
                    }}>
                         <Trans id = "mark_as_completed" name = ""/>
                    </Dropdown.Item>
                  ):(
                    null
                  )
              }
               {
                  this.props.campaign.status === 'dialing_completed' || this.props.campaign.status === 'scheduled' || this.props.campaign.status === 'schedulation_idle' ? (
                        // <a href="" ng-click="retryUndelivered(campaign)" class=""> {{ trans("retry_undelivered") }} </a>
                        <Dropdown.Item onClick={(event)=>{
                            event.preventDefault();
                            event.stopPropagation();
                            // this.reuseCampaign(this.props.campaign);
                            // console.log("RRR")
                            this.props.modalAction.showModal("SEND_AGAIN", {campaign:this.props.campaign});
                        }}>
                           <Trans id = "campaign_overview_index_send_again" name = ""/>
                        </Dropdown.Item>
                  ):(
                     null
                  )
              }
              {
                  this.props.campaign.status === 'stop' || this.props.campaign.status === 'dialing_completed' || this.props.campaign.status === 'scheduled' || this.props.campaign.status === 'schedulation_idle'?(
                        // <a href="" ng-click="retryUndelivered(campaign)" class=""> {{ trans("retry_undelivered") }} </a>
                        <Dropdown.Item onClick={(event)=>{
                            event.preventDefault();event.stopPropagation();
                            this.props.campaignActions.getRetry(this.props.campaign)
                            
                        }}>
                           <Trans id = "retry_undelivered" name = ""/>
                        </Dropdown.Item>
                  ):(
                     null
                  )
              }
              { 
                  this.allowDeleteIfNotInProgress(this.props.campaign)?(
                    // <a href="" ng-click="removeCampaign(campaign._id)" class="warrning">{{ trans("campaign_overview_index_delete") }} </a>
                    <Dropdown.Item onClick={(event) => {
                        event.preventDefault();event.stopPropagation();
                        this.removeCampaign(this.props.campaign._id);
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "This action is irreversible.!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                          if (result.value) {
                            this.props.campaignActions.deleteCampaign(this.props.campaign._id);
                            // Swal.fire(
                            //   'Deleted!',
                            //   'Your file has been deleted.',
                            //   'success'
                            // )
                          }
                        })
                        
                    }}
                        style = {{color:"red"}}
                    >
                        <Trans id = "campaign_overview_index_delete" name = ""/>
                    </Dropdown.Item>
                  ):(
                    null
                  )
              }
          </DropdownButton>

        </div>
      );
  }

}
export default withRouter(connect(
  null,
  dispatch => ({
    campaignActions: bindActionCreators({ deleteCampaign, updateCampaignStatus, getRetry }, dispatch),
    modalAction: bindActionCreators({ showModal }, dispatch),
    composeActions: bindActionCreators({ initComposeData }, dispatch),
  })
)(ShowMoreButton));
