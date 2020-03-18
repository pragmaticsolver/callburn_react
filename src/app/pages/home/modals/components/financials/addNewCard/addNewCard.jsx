import React from 'react';
import Card from 'react-credit-cards';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {toastr} from 'react-redux-toastr';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Spinner} from 'react-bootstrap';
import Button from '@material-ui/core/Button'
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from './utils';
// Import actions
import { hideModal } from '../../../modalConductorActions';
import { createCard } from '../../../../../../store/app_services/user/userApi';
import Trans from '../../../../utils/Trans';
class ModalWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cvc: "",
      expiry:"",
      focus: "",
      name:"",
      number:"",
      createLoading: false,
  }
    this.createCardFun = this.createCardFun.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  
  async createCardFun() {
      var params = {
        cvc: this.state.cvc,
        name: this.state.name,
        number: this.state.number,
        exp_month: parseInt( this.state.expiry.split('/')[0] ),
        exp_year: parseInt( this.state.expiry.split('/')[1] )
      } 
      this.setState({
        createLoading:true
      })
      var createCardResult = createCard(params);
      await createCardResult.then((data) => {
        this.setState({
          createLoading: false
        })
        if(data.resource.error.no === 0)
        {
          toastr.success("Card created successfully!");

        } else {
          toastr.error(data.resource.error.text);
          this.props.modalActions.hideModal();
        }
      })
  }

  onCancel() {
    this.props.modalActions.hideModal();
  }
  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer });
    }
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name,
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
    }
    this.setState({ [target.name]: target.value });
  };
  render() {
    const { name, number, expiry, cvc, focused } = this.state;

    return (
      <Modal
        isOpen={true}
        toggle={null}
        className="modal-dialog-centered"
      >
         <ModalHeader> <Trans id = "add_new_card"/> </ModalHeader>
         <ModalBody>
         <div key="Payment">
            <div className="App-payment">
              <Card
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focused}
                callback={this.handleCallback}
                locale = {{valid :'MONTH / YEAR'}}
              />
              <br/>
              <form ref={c => (this.form = c)} onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="tel"
                    name="number"
                    className="form-control"
                    placeholder="Card Number"
                    pattern="[\d| ]{16,22}"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                  <small>E.g.: 49..., 51..., 36..., 37...</small>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="tel"
                      name="expiry"
                      className="form-control"
                      placeholder="Valid Thru"
                      pattern="\d\d/\d\d"
                      required
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="tel"
                      name="cvc"
                      className="form-control"
                      placeholder="CVC"
                      pattern="\d{3,4}"
                      required
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                    />
                  </div>
                </div>
              
              </form>
            </div>
          </div>
         </ModalBody>
         <ModalFooter>
             <Button color="secondary" variant = "contained" onClick={this.createCardFun}>
                {
                  this.state.createLoading ? (
                    <Spinner animation = "border"/>
                  ): ( <Trans id = "button_save"/> )
                }
              </Button>
              <Button color="primary" variant = "contained" onClick={this.onCancel}>
                  <Trans id = "batch_show_repiteation_count_confirm_cancel"/>
              </Button>
         </ModalFooter>  
      </Modal>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    modalActions: bindActionCreators({ hideModal }, dispatch)
  })
)(ModalWrapper);
