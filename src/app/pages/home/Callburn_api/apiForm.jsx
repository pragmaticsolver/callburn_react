import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';  
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/SettingsApplications';
//import components
import ApiTable from './components/ApiTable/ApiTable';
//import styles
import './apiList.scss';
//import actions
import {showModal} from '../modals/modalConductorActions';
//
import Trans from '../utils/Trans';
const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: 'black',
    color: 'white',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);
class BlockListView extends React.Component{
  
  render(){
    return(
      <React.Fragment>
        <div className = "form-info">
            <h3 className = "title"> <Trans id = "engaines_api_access_keys"/> </h3>
            <h5 className = "des"><Trans id = "engaines_api_table_of_keys"/></h5>
        </div>
       
       <br/>
       <Fab
            variant="extended"
            size="small"
            color="default"
            aria-label="add"
            style = {{padding:"0px 50px", backgroundColor:"white",margin:"10px"}}
            onClick = {
              ()=>{
                this.props.Actions.showModal("ADD_API")
              }
            }
          >
            <AddIcon />
             <Trans id = "account_settings_add_new"/>
       </Fab>
       <br/>
       <ApiTable/>
       <br/>
       <HtmlTooltip
              title={
              <React.Fragment>
                <Typography component = "div" color="inherit" >
                    <Trans id = "coming_soon"/>
                </Typography>
              </React.Fragment>
            }
            placement = "top"
          >
         <div style = {{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", opacity:0.5}}> 
            <h3><Trans id = "engaines_api_url_and_logs"/></h3>
            <h5><Trans id = "engaines_api_delivery"/><HelpIcon/></h5>
            <input placeholder = "http://sendreplyhere.com/mycustomapp" readOnly disabled style = {{width:"300px"}}/>
            <div style = {{margin:"10px 0px"}}>
              <span style = {{margin:"0px 5px"}}>
                <Button disabled variant = "contained"><SettingsIcon/><Trans id = "engaines_api_export_api_log"/></Button>
              </span>
              <span style = {{margin:"0px 5px"}}>
                <Button disabled variant = "contained"><SettingsIcon/><Trans id = "engaines_api_export_http"/></Button>
              </span>
            </div>
       </div>
       </HtmlTooltip>
     
      </React.Fragment>
    )
  }
}
export default connect(
  null,
   dispatch => ({
       Actions: bindActionCreators(
           { showModal },
           dispatch
       )
   })
 )(BlockListView);