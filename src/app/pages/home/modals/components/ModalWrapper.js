import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@material-ui/core/Button'

// Import actions
import { hideModal } from '../modalConductorActions';

class ModalWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.hideModal = this.hideModal.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  hideModal() {
    this.props.modalActions.hideModal();
  }

  onOk() {
    this.props.onOk();
    // this.hideModal();
  }

  onCancel() {
    this.props.onCancel();
    this.hideModal();
  }

  render() {
    return (
      <Modal
        isOpen={true}
        toggle={this.props.toggle?this.hideModal:null}
        className="modal-dialog-centered"
        style = {{maxWidth:this.props.width}}
      >
        <ModalHeader> {this.props.title} </ModalHeader>

        <ModalBody>{this.props.children}</ModalBody>
        {
              this.props.footerView == true ? (
              <ModalFooter>
              
                      <React.Fragment>
                      {
                        this.props.okButtonShow?(
                          <Button color="secondary" variant = "contained" onClick={this.onOk}>
                            {this.props.okText}
                          </Button>
                        ):(null)
                      }
                      {
                        this.props.cancelButtonShow?(
                          <Button color="primary" variant = "contained" onClick={this.onCancel}>
                            {this.props.cancelText}
                          </Button>
                        ):(null)
                      }
                      </React.Fragment>
              </ModalFooter>
            ):(null)
        }
      </Modal>
    );
  }
}

ModalWrapper.defaultProps = {
  okText: 'Yes',
  cancelText: 'Cancel',
  title: 'Modal Title',
  onOk: () => {},
  onCancel: () => {},
  toggle:true,
  okButtonShow:true,
  cancelButtonShow: true,
  footerView: true
};


export default connect(
  null,
  dispatch => ({
    modalActions: bindActionCreators({ hideModal }, dispatch)
  })
)(ModalWrapper);
