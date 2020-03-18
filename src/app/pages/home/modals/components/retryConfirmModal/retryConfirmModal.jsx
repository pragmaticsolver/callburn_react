import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button'

// Import actions
import { hideModal } from '../../modalConductorActions';
import {createGroupForUndelivered} from '../../../../../store/app_services/campaign/campaignAction';

import Trans from '../../../utils/Trans';
class RetryConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.createGroupForUndelivered = this.createGroupForUndelivered.bind(this);
  }

  hideModal() {
    this.props.modalActions.hideModal();
  }
  createGroupForUndelivered = (type) => {
      this.props.campaignActions.createGroupForUndelivered({
        condition: type,
        message_id: this.props.retryCampaign._id 
      })
      this.hideModal();
  }
  render() {
    var neverCalled = this.props.retryData.resource.neverCalled;
    var undelivered = this.props.retryData.resource.undelivered;
    var undeliveredAndNeverCalled = this.props.retryData.resource.undeliveredAndNeverCalled;
    return (
      <Modal
        isOpen={true}
        toggle={this.hideModal}
        className="modal-dialog-centered"
        style = {{maxWidth:"600px"}}
      >
        <ModalHeader> <Trans id = "retry_undelivered"/> </ModalHeader>
        <ModalBody>
            <p>
               <Trans id = "campaign_compose_compose_step_2_now_it_is_time"/>
            </p>    
        </ModalBody>
        <ModalFooter>
              <Button color="secondary" variant = "contained" onClick = {()=>this.createGroupForUndelivered("undelivered")}><Trans id = "campaign_overview_undelivered"/> {undelivered}</Button>
              <Button color="secondary" variant = "contained" onClick = {()=>this.createGroupForUndelivered("neverCalled")}><Trans id = "campaign_overview_never_called"/> ( {neverCalled} )</Button>
              <Button color="secondary" variant = "contained" onClick = {()=>this.createGroupForUndelivered("undeliveredAndNeverCalled")}><Trans id = "campaign_overview_undelivered"/> + <Trans id = "campaign_overview_never_called"/> ( {undeliveredAndNeverCalled} )</Button>
        </ModalFooter>
      </Modal>
    );
  }
}


export default connect(
  state => ({
    retryCampaign: state.campaign.retryCampaign,
    retryData: state.campaign.retryData,
    retryDataLoading: state.campaign.retryDataLoading,
    retryDataError: state.campaign.retryDataError,
  }),
  dispatch => ({
    modalActions: bindActionCreators({ hideModal }, dispatch),
    campaignActions: bindActionCreators({createGroupForUndelivered}, dispatch),
  })
)(RetryConfirmModal);
