import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {withRouter} from 'react-router-dom';
import {Spinner} from 'react-bootstrap';
import CreateAndEditPage from '../createPage/scenes/manualCreate/manualCreatePage';
import { getCampaignById, clearCampaigns } from '../../../../../store/app_services/campaign/campaignAction';
import {initComposeData} from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
class EditForm extends React.Component{
    componentWillMount(){
        const { match: { params } } = this.props;
        this.props.campaignActions.getCampaignById(params.id);
    }
    componentWillUnmount(){
        this.props.campaignActions.clearCampaigns();
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
    render(){
        return(
            <React.Fragment>
                {
                    this.props.editingCampaignLoading === true || this.props.editingCampaign === null ? (
                        <div style = {{
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                        }}>
                            <Spinner animation="border" variant="primary" size = "lg"/>
                        </div>
                    ):(
                        <CreateAndEditPage/>
                    )
                }
            </React.Fragment>
        )
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
      campaignActions: bindActionCreators({ getCampaignById, clearCampaigns }, dispatch),
      composeActions: bindActionCreators({ initComposeData}, dispatch),
    })
  )(EditForm));
  