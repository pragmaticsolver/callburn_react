import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import {
    Form, Col
} from 'react-bootstrap';
//import custom components;
import ModalWrapper from '../ModalWrapper';
//import actions
import {hideModal} from '../../modalConductorActions';
import {addComment} from '../../../../../store/app_services/campaign/campaignAction';
import Trans from '../../../utils/Trans';
class MakeAndAddCommentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        comment: ""
    }
    this.addCommentFun = this.addCommentFun.bind(this);
  }
  addCommentFun = () => {
    var comments = this.props.modal.params.comment? JSON.parse(this.props.modal.params.comment):[]
    comments.push(String(this.state.comment))
    var params = {
        comments: comments,
        phonenumberId: this.props.modal.params.phonenumberId
    }
    this.props.Actions.addComment(params);
    this.props.Actions.hideModal();
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "mark_and_add_comment"/>)}
        cancelText={( <Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        okText = {(<Trans id = "button_save"/>)}
        toggle = {false} 
        onOk = {this.addCommentFun}
      >
      <Form>
        <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
                <Form.Label><Trans id = "add_new_comment"/></Form.Label>
                <Form.Control type = "text" placeholder = "new comment placeholder"
                    onChange = {(e)=>{
                        this.setState({
                            comment: e.target.value
                        })
                    }}
                ></Form.Control>
            </Form.Group>
        </Form.Row>
        <Form.Row>
            {
                JSON.parse(this.props.modal.params.comment) ?JSON.parse(this.props.modal.params.comment).map((comment, index) => (
                    <Form.Control type = "text" readOnly = {true} value = {comment} key ={index}></Form.Control>
                )):(null)
            }
        </Form.Row>
     </Form>
     </ModalWrapper>
    );
  }
}

export default connect(
    null,
    dispatch => ({
      Actions: bindActionCreators({ hideModal, addComment }, dispatch)
    })
  )(MakeAndAddCommentModal);
  
