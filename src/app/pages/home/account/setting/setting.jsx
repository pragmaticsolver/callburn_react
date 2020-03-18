import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Table, TableHead,TableBody, TableRow, TableCell} from '@material-ui/core';
import {Form, Button} from 'react-bootstrap'
import TimezonePicker from 'react-timezone';
import {SettingsPhone, Lock, ContactMail, Language} from '@material-ui/icons';
//import style
import './setting.scss';
//import Actions
import {showModal} from '../../modals/modalConductorActions';
//
import Trans from '../../utils/Trans';
class SettingForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedDetailsId: "0"
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick = (id) =>{
        this.setState({
            selectedDetailsId: id
        })
    }
    render(){
        return(
            <React.Fragment>
            <div className = "form-info">
                <h3 className = "title"><Trans id = "account_settings_settings"/></h3>
            </div>
            <div className = "account-area">
                <div className = "details-view">
                    <div className = "details-wrapper">
                        <div id = "0" onClick = {()=>{this.handleClick("0")}} className = {this.state.selectedDetailsId == "0"?"item selected":"item"}>
                            <div className = "label">Contact details</div>
                            <div className = "icon-view"><ContactMail/></div>
                        </div>
                        <div id = "1" onClick = {()=>{this.handleClick("1")}} className = {this.state.selectedDetailsId == "1"?"item selected":"item"}>
                            <div className = "label">Password</div>
                            <div className = "icon-view"><Lock/></div>
                        </div>
                        <div id = "2" onClick = {()=>{this.handleClick("2")}} className = {this.state.selectedDetailsId == "2"?"item selected":"item"}>
                            <div className = "label"><Trans id = "account_settings_active_caller_ids"/></div> 
                            <div className = "icon-view"><SettingsPhone/></div> 
                        </div>
                        <div id = "3" onClick = {()=>{this.handleClick("3")}} className = {this.state.selectedDetailsId == "3"?"item selected":"item"}>
                            <div className = "label"><Trans id = "account_settings_language"/>, &nbsp; <Trans id = "account_settings_time_zone"/></div>
                            <div className = "icon-view"><Language/></div>
                        </div>
                    </div>
                </div>
                <div className = "info-view">
                    <div className = "info-view-wrapper">
                    {
                        this.state.selectedDetailsId == 0 ? (
                            <React.Fragment>
                                <h2>Contact details</h2>
                                <br/>
                                <Form>
                                    <Form.Group controlId="email">
                                        <Form.Label><Trans id = "finish_registration_step4_your_email_address"/></Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" />
                                    </Form.Group>
                                    <Form.Group controlId="phone_number">
                                        <Form.Label><Trans  id = "modals_settings_settings_phone_number"/></Form.Label>
                                        <Form.Control type="email" placeholder="" />
                                    </Form.Group>
                                </Form>
                            </React.Fragment>
                        ):(null)
                    }
                     {
                        this.state.selectedDetailsId == 1 ? (
                            <React.Fragment>
                                <h2>Password</h2>
                                <br/>
                                <Form>
                                    <Form.Group controlId="password">
                                        <Form.Label><Trans id = "modals_settings_edit_profile_modal_current_password"/></Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" />
                                    </Form.Group>
                                    <Form.Group controlId="new_password">
                                        <Form.Label><Trans id = "modals_settings_edit_profile_modal_new_password"/></Form.Label>
                                        <Form.Control type="email" placeholder="" />
                                    </Form.Group>
                                    <Form.Group controlId="confirm_password">
                                        <Form.Label><Trans id = "modals_settings_edit_profile_modal_confirm_new_password"/></Form.Label>
                                        <Form.Control type="email" placeholder="" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Button>Update Password</Button>
                                    </Form.Group>
                                </Form>
                            </React.Fragment>
                        ):(null)
                    }
                    {
                        this.state.selectedDetailsId == 2 ? (
                            <React.Fragment>
                                <h2>Active Caller ID's</h2>
                                <br/>
                                <Form>
                                    <Form.Group controlId="password">
                                       <Button onClick = {
                                           ()=>{
                                               this.props.Actions.showModal("ACTIVE_CALLER_ID")
                                           }
                                       }><Trans id = "account_settings_add_new"/></Button>
                                    </Form.Group>
                                    <Form.Group controlId="new_password">
                                    <Table >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell><Trans  id = "modals_settings_settings_phone_number"/></TableCell>
                                                <TableCell><Trans id = "addressbook_table_name"/></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>1</TableCell>
                                                <TableCell>+390292800925</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>2</TableCell>
                                                <TableCell>+390292800925</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                    </Form.Group>
                                </Form>
                            </React.Fragment>
                        ):(null)
                    }
                    {
                        this.state.selectedDetailsId == 3 ? (
                            <React.Fragment>
                               
                               <TimezonePicker
                                    value="Asia/Yerevan"
                                    onChange={timezone => console.log('New Timezone Selected:', timezone)}
                                    inputProps={{
                                    placeholder: 'Select Timezone...',
                                    name: 'timezone',
                                    }}
                                />
                            </React.Fragment>
                        ):(null)
                    }
                    </div>
                </div>
            </div>
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
   )(SettingForm);