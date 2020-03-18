import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import react-bootstrap components;
import {Form, Table} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../ModalWrapper';
import Numpad from '../Numpad/Numpad';
//import style
import './style.scss';
//import actions;
import { setTransfer } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import { hideModal } from '../../modalConductorActions';
import Trans from '../../../utils/Trans';
class CallLiveTransferInteraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_confirm: false
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event) =>{
    this.setState({
      check_confirm: event.target.checked
    })
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "modals_camping_batch_activate_transfer_activate_call"/>)}
        okText={(<Trans id = "modals_camping_batch_activate_transfer_activate_call"/>)}
        toggle = {false} 
        onOk={() => {
          if(this.props.transfer_digit == null || this.state.check_confirm == false || this.props.transfer_options.length === 0) return;
          else this.props.modalAction.hideModal();
       }}
       onCancel = {()=>{
         this.props.composeActions.setTransfer({flag:false, digit:null});
       }}
        width = "700px"
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
      >
        <div className = "body-area">
            <div className = "main-section">
              <div className = "intro">
                  <h4><Trans id = "modals_camping_batch_activate_callback_how_it_works"/>?</h4>
                  <p style = {{textAlign:"justify"}}>
                     <Trans id = "blacklist_me_interaction_modal_text_when_your_recipient1"/>
                  </p>
                  <Form>
                    <Form.Group controlId="transfer-limiter-selector">
                      <Form.Label> <b><Trans id = "live_transfer_modal_text_concurrent_transfer_limiter"/></b></Form.Label>
                      <Form.Control as="select" onChange = {(event)=>{ this.props.composeActions.setTransfer({flag:true, live_transfer_limit:event.target.value}) }}>
                        <option value = "unlimited">Unlimited</option>
                        <option value = "1">1</option>
                        <option value = "2">2</option>
                        <option value = "3">3</option>
                      </Form.Control>
                    </Form.Group>
                  </Form>
                  <Form>
                    <Form.Group controlId="transfer-limiter-selector">
                      <Form.Label> <b><Trans id = "modals_camping_batch_activate_transfer_choose_one_or_more_phone"/></b></Form.Label>
                      <Table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td><Trans id = "transfer_destination"/></td>
                                <td><Trans id = "account_settings_name"/></td>
                              </tr>
                              {
                                this.props.userData.numbers && this.props.userData.numbers.length > 0 ? this.props.userData.numbers.map((number, index)=>(
                                  <tr key = {index}>
                                     <td>
                                          <Form.Check
                                            custom
                                            inline
                                            label=""
                                            type="checkbox"
                                            id = {number.phone_number}
                                            value = {number.phone_number}
                                            checked = {this.props.transfer_options && this.props.transfer_options.includes(number.phone_number) === true ? true : false}
                                            onChange = {
                                              (e)=>{
                                                var _transfer_options = [...this.props.transfer_options];
                                                var index = _transfer_options.indexOf(e.target.value);
                                                if (index > -1) {
                                                  _transfer_options.splice(index, 1);
                                                } else {
                                                  _transfer_options.push(e.target.value);
                                                }
                                                console.log(_transfer_options)
                                                this.props.composeActions.setTransfer({
                                                  flag:true,
                                                  transfer_options:_transfer_options === null ? [] : _transfer_options
                                                } )
                                              }
                                            }
                                          />
                                      </td>
                                      <td> <img src={"/media/flag1/"+ number.tariff.country.code +".svg"} alt="image"  />+{number.phone_number}</td>
                                      <td></td>
                                  </tr>
                                )) : (null)
                              }
                        </tbody>
                      </Table>
                    </Form.Group>
                  </Form>
              </div>
              <div className = "digit-selector-section">
                   <Numpad title = {(<Trans id = "modals_camping_batch_dijit_choosen_select_a_digit"/>)}  interactionDigitName = "liveTransferInteractionDigit"/>
              </div>
            </div>
            <div className = {this.state.check_confirm?"comfirm-section checked":"comfirm-section"}>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.check_confirm}
                          onChange={this.handleChange}
                          value="checkedB"
                          color="primary"
                        />
                      }
                      label={(<Trans id = "check_container_text1"/>)}
                  />
            </div>
     
        </div>
          </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
     transfer_digit: state.compose.transfer_digit,
     transfer_options: state.compose.transfer_options,
     userData: state.user.userData
    //  callerId: state.user
  }),
  dispatch => ({
    composeActions: bindActionCreators({ setTransfer }, dispatch),
    modalAction: bindActionCreators({ hideModal }, dispatch)
  })
)(CallLiveTransferInteraction);


