import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import TemplatesOverView from './scenes/overview/templatesOverview';
import TemplateCreatePage from './scenes/create/templateCreate';
export default function CampaignPage(){
    
    return(
        <Switch>
            <Redirect
                exact={true}
                from="/templates"
                to="/templates/overview"
            />
            <Route path="/templates/overview" component = {TemplatesOverView} />
            <Route path="/templates/create" component = {TemplateCreatePage} />
        </Switch>
    )
}
