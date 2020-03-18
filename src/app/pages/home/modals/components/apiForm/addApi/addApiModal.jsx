import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import {
    Form, Col
} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../../ModalWrapper';
//import style
//import actions
import { createKey } from '../../../../../../store/app_services/campaignApi/campaignApiActions';
import { hideModal } from '../../../modalConductorActions';
import Trans from '../../../../utils/Trans';
class AddAPiModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       type : "",
       description: "",
    }
  }
  onChangeFun = (e) => {
     this.setState({
       [e.target.name]: e.target.value
     })
  }
  createFun = () => {
     this.props.apiActions.createKey({
       type: this.state.type,
       description: this.state.description,
       services: [1,2]
     });
    this.props.modalActions.hideModal();
  }
  render() {
    return (
      <ModalWrapper
        title=  {(<Trans id = "engaines_api_generate_new_key"/>)}
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        okText = {(<Trans id = "modals_api_api_modal_generate_access_Key"/>)}
        toggle = {false} 
        onOk = {this.createFun}
      >
      <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
                <Form.Label><Trans id = "api_modal_enter_key_description"/></Form.Label>
                <Form.Control onChange = {this.onChangeFun} name = "description"/>
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label><Trans id = "engaines_api_type"/></Form.Label>
                <Form.Control as="select" onChange = {this.onChangeFun} name = "type">
                    <option value = "live"><Trans id = "modals_api_api_modal_production_key"/></option>
                    <option value = "test"><Trans id = "modals_api_api_modal_test_key"/></option>
                </Form.Control>
            </Form.Group>
        </Form.Row>
     </Form>
     </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
      userData:state.user.userData
  }),
  dispatch => ({
    apiActions: bindActionCreators({ createKey }, dispatch),
    modalActions: bindActionCreators({ hideModal }, dispatch)
  })
)(AddAPiModal);

