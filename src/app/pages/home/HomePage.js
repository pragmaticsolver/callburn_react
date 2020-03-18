import React, { Suspense } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
// import LoginForm from '../auth/Login';
import ApiForm from '../home/Callburn_api/apiForm';
import SupportForm from '../home/Callburn_support/supportForm';
import SettingForm from './account/setting/setting';
import FinancialsForm from './account/financials/financials';
import ModalConductor from './modals/ModalConductor';
//CampaignForms
import CampaignOverViewForm from './Callburn_campaign/scenes/overview/overView';
import CampaignCreateForm from './Callburn_campaign/scenes/createPage/scenes/createInfo/createInfoPage';
import CampaignCreatePage from './Callburn_campaign/scenes/createPage/scenes/manualCreate/manualCreatePage';
import CampaignEditPage from './Callburn_campaign/scenes/editPage/editCampaign';
//phoneBookForms
import PhoneGroupView from './Callburn_phonebook/scenes/overview/phoneGroupView';
import PhoneAddressImport from './Callburn_phonebook/scenes/import/importView';
import PhoneAddressBlockList from './Callburn_phonebook/scenes/blockList/blockList';
import Fun from './utils/Fun';
import AudioPlayer from './utils/audioPlayer';
import './home.scss';
//import actions;
import {getUserData} from '../../store/app_services/user/userAction';
class HomePage extends React.Component {
  componentWillMount(){
     this.props.Actions.getUserData();
  }
  render(){
    return (
      <Suspense fallback={<LayoutSplashScreen />}>
        <div style = {{padding:"0px 0px"}}>
          <Switch>
            {
              <Redirect exact from="/" to="/campaign" />
            }
            {
              <Redirect exact from="/phonebook" to="/phonebook/group" />
            }
            <Route path="/campaign"                       exact  component = {CampaignOverViewForm} />
            <Route path="/campaign/create"                exact  component = {CampaignCreateForm} />
            <Route path="/campaign/create/manulaycreate"  exact  component = {CampaignCreatePage} />
            <Route path="/campaign/edit/:id"              exact  component = {CampaignEditPage} />
            <Route path="/phonebook/group"                exact  component = {PhoneGroupView} />
            <Route path="/phonebook/import"               exact  component = {PhoneAddressImport} />
            <Route path="/phonebook/blocklist"            exact  component = {PhoneAddressBlockList} />
            <Route path="/apiform"                        exact render = {props => <ApiForm {...props} />} />
            <Route path="/support"                        exact render = {props => <SupportForm  {...props} />} />
            <Route path="/settings"             exact render = {props => <SettingForm {...props} />} />
            <Route path="/financials"  exact render = {props => <FinancialsForm {...props} />} />
          </Switch>
        </div>
        <ModalConductor />
        <Fun/>
        <AudioPlayer/>
      </Suspense>
    );
  }
}
export default connect(
  state => ({
      userData:state.user.userData
  }),
  dispatch => ({
    Actions: bindActionCreators({ getUserData }, dispatch)
  })
)(HomePage);
