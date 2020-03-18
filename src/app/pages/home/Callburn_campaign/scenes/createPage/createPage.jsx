import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import CreateInfoPage from './scenes/createInfo/createInfoPage';
import ManualCreatePage from './scenes/manualCreate/manualCreatePage';
class CampaignCreatePage extends React.Component{
    render()
    {
        const { path } = this.props.match;
        return(
            <Switch>
                <Route path="/campaign/create"      component = {CreateInfoPage} />
                <Route path="/campaign/create/manulaycreate"      component = {ManualCreatePage} />
            </Switch>
        )
    }
}
export default CampaignCreatePage;