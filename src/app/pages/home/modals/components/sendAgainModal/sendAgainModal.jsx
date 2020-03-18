import React from 'react';
import {withRouter} from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import {
    Form, Spinner
} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../ModalWrapper';
//import style
//import Actions;
import {initComposeData} from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import {getCampaignById} from '../../../../../store/app_services/campaign/campaignAction';
import {hideModal} from '../../modalConductorActions'
import Trans from '../../../utils/Trans';
class SendAgainModal extends React.Component {
  constructor(props) {
    super(props);
    this.getTotalOfCampaign = this.getTotalOfCampaign.bind(this);
  }
  getTotalOfCampaign = (campaign) => {
    if (campaign.totalRecipientsIfGroups) {
        return campaign.totalRecipientsIfGroups;
    }
    return campaign.total_phonenumbers[0]
        ? campaign.total_phonenumbers[0].count
        : 0;
  };
  componentWillMount(){
        this.props.campaignActions.getCampaignById(this.props.modal.params.campaign._id);
  }
  componentDidUpdate(prevProps){
    if(this.props.editingCampaignError){
        this.props.history.push('/campaign/overview');
    }
    if(prevProps.editingCampaign !== this.props.editingCampaign && this.props.editingCampaign)
    {
        this.props.composeActions.initComposeData(this.props.editingCampaign);
    }
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "modal_send_again_heading"/>)}
        okText = {(<Trans id = "to_same_recipients"/> ) + "(" +this.getTotalOfCampaign(this.props.modal.params.campaign) + ")"}
        cancelText = {(<Trans id = "to_different_recipients"/>)}
        toggle = {false} 
        onOk = {()=>{
            if(this.props.editingCampaign)
            {
                this.props.composeActions.initComposeData(this.props.editingCampaign);
                this.props.history.push("/campaign/create/manulaycreate");
                this.props.modalActions.hideModal();
            }
        }}
        onCancel = {()=>{
            this.props.composeActions.initComposeData({...this.props.editingCampaign, groups:[]});
            this.props.history.push("/campaign/create/manulaycreate");
            this.props.modalActions.hideModal();
        }}
        footerView = {!this.props.editingCampaignLoading}
      >
      <Form>
        <Form.Row>
             <Trans id = "campaign_compose_compose_step_2_now_it_is_time"/>
             {
                 this.props.editingCampaignLoading === true ? (
                    <Spinner animation = "border" size = "lg"/>
                 ):(null)
             }
        </Form.Row>
       
     </Form>
     </ModalWrapper>
    );
  }
}

export default withRouter(connect(
    state => ({
          //editing campaign part--------
       editingCampaign: state.campaign.editingCampaign,
       editingCampaignLoading: state.campaign.editingCampaignLoading,
       editingCampaignError: state.campaign.editingCampaignError,
       //-----------------------------
    }),
    dispatch => ({
      composeActions: bindActionCreators({ initComposeData }, dispatch),
      campaignActions: bindActionCreators({ getCampaignById }, dispatch),
      modalActions: bindActionCreators({ hideModal }, dispatch),
    })
  )(SendAgainModal));
  
