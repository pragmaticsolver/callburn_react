import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Form, Col} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../../ModalWrapper';
//import style
//import actions;
import { addNumberToBlackList, removeNumberFromBlackList } from '../../../../../../store/app_services/phoneBook/phoneBookAction';
import {hideModal} from '../../../modalConductorActions';
import Trans from '../../../../utils/Trans';
class AddToBlocklist extends React.Component {
  constructor(props) {
    super(props);
    this.submitData = {
      phonenumbers: [],
      name:""
    }
  }
  onChangeNumber = (event) => {
     this.submitData.phonenumbers[0] = event.target.value
  }
  onChangeName = (event) => {
    this.submitData.name = event.target.value;
  }
  addBlackList = () => {
    this.props.Actions.addNumberToBlackList(this.submitData);
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "add_blacklist"/>)}
        cancelText={( <Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        okText = {(<Trans id = "addressbook_import_contact_add"/>)}
        toggle = {false} 
        onOk = {()=>{this.addBlackList(); this.props.Actions.hideModal();}}
      >
      <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
                <Form.Label><Trans id = "addressbook_import_contact_phonenumber"/></Form.Label>
                <Form.Control onChange = {this.onChangeNumber}/>
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
                <Form.Label><Trans id = "addressbook_import_contact_name"/></Form.Label>
                <Form.Control />
            </Form.Group>
        </Form.Row>
      </Form>
     </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
  }),
   dispatch => ({
       Actions: bindActionCreators(
           {  addNumberToBlackList, removeNumberFromBlackList, hideModal },
           dispatch
       )
   })
 )(AddToBlocklist);;
