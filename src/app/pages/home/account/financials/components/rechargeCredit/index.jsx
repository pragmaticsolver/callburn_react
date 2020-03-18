import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import {toastr} from 'react-redux-toastr';
import {Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import CheckBox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import HelpIcon from '@material-ui/icons/Help';
import PayImg from 'assets/callburn/images/images/fill-113@2x.svg';
import callburnImg from 'assets/callburn/images/callburn_logo.svg';
import './style.scss';
import 'react-credit-cards/lib/styles.scss';
import { Divider, Checkbox } from '@material-ui/core';
import Trans from '../../../../utils/Trans';
import { 
    getUserData,
    getTaxData,
    checkOrdersData, 
    updateMainData, 
    checkVatId,
    checkCouponCode,
    setPaymentData,
    setCheckBoxVat,
    setCheckBoxDiscountCode,
    enableToPayOrder,
    setDiscountData,
    payByBank,
    setPaymentMethod,
    removeOrder,
    payByPaypal,
    selectCard,
    removeCard,
    payByCard
} from '../../../../../../store/app_services/user/userAction';
import { showModal } from '../../../../modals/modalConductorActions';
class RechargeForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            userEditableData: {},
            stripeCards: [],
        }
        this.checkVat = this.checkVat.bind(this);
        this.openDeleteStripeCard = this.openDeleteStripeCard.bind(this);
        this.openDeletePendingOrder = this.openDeletePendingOrder.bind(this);
    }
    componentDidMount(){
        this.props.Actions.setCheckBoxVat(
            this.props.userData.vat ? true : false
        )
        this.props.Actions.getTaxData();
        this.props.Actions.checkOrdersData();
    }
    componentDidUpdate(prevProps, prevState)
    {
        if(prevProps.paymentData && this.props.paymentData && prevProps.paymentData.discount_code != this.props.paymentData.discount_code)
        {
            if(this.props.lastCheckedCoupon && this.props.paymentData.discount_code !== this.props.lastCheckedCoupon.code){
                this.props.Actions.setDiscountData({});
            } else {
                this.props.Actions.setDiscountData(this.props.lastCheckedCoupon);
            }
        }
        if(prevProps.payByBankSuccess == false && this.props.payByBankSuccess == true)
        {
            Swal.fire({
                title: 'Order created',
                icon: 'info',
                html: '<img src = "' + callburnImg + '" alt = ""/>' + 
                      '<div style = "display:flex; justify-content: center;align-items: center;flex-direction: column;">' +
                      '<p>your order' + this.props.ordersData.order_number + ' of € ' + this.props.ordersData.total_amount + ' was successfully created.</p>' +
                      '<p>You can pay it using these Bank Account Details</p>' + 
                      '<p class="iban">IBAN: ES36 0049 3241 7121 1456 2241</p>' +
                      '<p class="bic">BIC/SWIFT CODE: BSCHESMMXXX</p>' +
                      '<p>You will receive an email with total price, order number and our bank details</p>' +
                      '<p>You will find this pending order in your Invoices section until the payment.</p>' +
                      '</div>',    
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            })
        }
    }
    getTotalRecharge = () => {
        if(!this.props.paymentData) return "";
        var totalRecharge = parseFloat(this.props.paymentData.amount);
        if (this.props.discountData && !this.props.hideBonus) {
          totalRecharge += parseFloat((this.props.paymentData.amount * this.props.discountData.discount_percentage) / 100);
        }
        return totalRecharge ? totalRecharge : 0;
      };
    getDiscountAmount = (type) => {
        if (type == 'noValue' || this.props.hideBonus) {
          return 0;
        }
        if (!this.props.discountData) {
          return 0;
        }
        var discountAmount = (this.props.paymentData.amount * this.props.discountData.discount_percentage) / 100;
        return discountAmount ? discountAmount : 0;
      };
  
    userEditableDataChange = (e) => {
        var _userEditableData = this.state.userEditableData;
        _userEditableData[`${e.target.id}`] = e.target.value;
        this.setState({
            userEditableData: _userEditableData
        })
    }
    checkVat(){
        this.props.Actions.checkVatId(this.props.paymentData);
        this.setState({
            userEditableData : {...this.state.userEditableData, vat: this.props.paymentData.vat_id}
        })
        this.props.Actions.updateMainData(this.state.userEditableData);
    }
    openDeleteStripeCard(id){
        Swal.fire({
            title: 'Are you sure?',
            text: "This action is irreversible.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
             this.props.Actions.removeCard(id);
        })
    }
    openDeletePendingOrder(id){
        Swal.fire({
            title: 'Are you sure?',
            text: "This action is irreversible.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
               this.props.Actions.removeOrder(id);
            }
        })
    }
    paymentMethodClassNname = (_active, _disabled) => {
        if(_active && _disabled) return "method-selector isSelected disabled"
        else if(_active) return "method-selector isSelected";
        else if(_disabled) return "method-selector disabled"
        else return "method-selector"
    }
    render(){
        return(
            <div className = "reCharge-form-wrapper">
                <Row>
                    <Col md = {7}>
                        <Form.Group>
                            <h4 ><Trans id = "recharge_content_title"/></h4>
                            <Divider/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control placeholder = "Campany name" disabled = {this.props.disableCreditActions} onChange = {this.userEditableDataChange} id = "company_name"/>
                       </Form.Group>
                        <Form.Group>
                            <Form.Control placeholder = "Address"  disabled = {this.props.disableCreditActions} onChange = {this.userEditableDataChange} id = "address"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Col md = {5}><Form.Control placeholder = "Postal code"  disabled = {this.props.disableCreditActions} onChange = {this.userEditableDataChange} id = "postal_code"/></Col>
                                <Col md = {7}><Form.Control placeholder = "City"  disabled = {this.props.disableCreditActions} onChange = {this.userEditableDataChange} id = "city"/></Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Row style = {{display:"flex", alignItems:"center"}}>
                            <CheckBox checked = {this.props.checkboxVAT} 
                                disabled = {this.props.toPayOrder}
                                onChange = {(e)=>{
                                    this.props.Actions.setCheckBoxVat(e.target.checked)
                            }}/>
                            <Form.Label style = {{marginBottom:"0"}} ><Trans id = "account_financials_vat"/></Form.Label>
                            <HelpIcon/>
                        </Form.Row>
                        {
                            this.props.checkboxVAT == true && !this.props.backgroundProcess? (
                                <Form.Group style = {{display:"flex", position:"relative"}}>
                                    <Form.Control defaultValue = {this.props.userData.vat ? this.props.userData.vat : ""} placeholder = "VAT ID" style = {{paddingLeft:"50px"}}
                                        disabled = {this.props.disableCreditActions}
                                        // className = {this.state.errClass}
                                        onChange = {(e)=>{
                                            var _paymentData = this.props.paymentData;
                                            _paymentData.vat_id = e.target.value;
                                            this.setState({
                                                paymentData: _paymentData
                                            })
                                        }}
                                    />
                                    <Button disabled = {this.props.disableCreditActions || this.props.backgroundProcess}
                                        onClick = {this.checkVat}
                                    >
                                        {
                                            this.props.backgroundProcess ? (
                                                <Spinner animation = "border"  size="sm"/>
                                            ): ( <Trans id = "account_financials_check"/>)
                                        }
                                    </Button>
                                    <span style = {{position:"absolute", left:"10px", top:"6px", fontSize:"1.3rem"}}>ES</span>
                                </Form.Group>
                            ):(null)
                        }
                    </Col>
                    <Col md = {5} style = {{display:"flex", flexDirection:"column"}}>
                        <Form.Group>
                            <h4 ><Trans id = "account_financials_manually"/></h4>
                            <Divider/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control disabled = {this.props.disableCreditActions} style = {{textAlign:"center", fontSize:"1,3rem", fontWeight:"bold"}} defaultValue = {this.props.ordersData ? this.props.ordersData.purchased_amount:""}/>
                            <Form.Label style = {{display:"flex", justifyContent:"center"}}><Trans id = "account_financials_minimium"/></Form.Label>
                       </Form.Group>
                       <Form.Row style = {{flex:1}}></Form.Row>
                       <Form.Row style = {{display:"flex", alignItems:"center"}}>
                            <CheckBox 
                              checked = {this.props.checkboxDiscountCode} 
                              disabled = {this.props.toPayOrder}
                              onChange = {(e)=>{
                                this.props.Actions.setCheckBoxDiscountCode(e.target.checked)
                            }}/>
                            <Form.Label style = {{marginBottom:"0"}}><Trans id = "account_financials_discount_code"/></Form.Label>
                            <HelpIcon/>
                        </Form.Row>
                        {
                            this.props.checkboxDiscountCode == true ? (
                                <Form.Group style = {{display:"flex"}}>
                                    <Form.Control disabled = {this.props.disableCreditActions} onChange = {(e) => {
                                        this.props.Actions.setPaymentData({
                                            ...this.props.paymentData, discount_code: e.target.value
                                        })
                                    }}/>
                                    <Button onClick = {()=>this.props.Actions.checkCouponCode(this.props.paymentData)} disabled = {this.props.disableCreditActions}><Trans id = "account_financials_apply"/></Button>
                                </Form.Group>
                            ):(null)
                        }
                    </Col>
                </Row>
                <br/>
                <Divider/>
                <Row style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                    <Form.Group>
                       <h4><Trans id ="account_financials_payment_methods"/></h4>
                    </Form.Group>
                </Row>
                <Row className = "payment-method-details-view">
                    <Col md = {7} className = "method-view">
                        <div 
                            className = {this.paymentMethodClassNname(this.props.paymentMethod == "credit", this.props.ordersData && !this.props.toPayOrder) }
                            onClick = {()=> {
                                if(this.props.ordersData && !this.props.toPayOrder) return;
                                this.props.Actions.setPaymentMethod("credit")
                            }}
                        >
                            <Radio checked = {this.props.paymentMethod == "credit" ? true : false} className = "check"/>
                            <div className = "info">
                                <div className = "title"><Trans id = "credit_card"/></div>
                                <div className = "details"><Trans id = "credit_card_text"/></div>
                            </div>
                            {
                                this.props.paymentMethod === "credit" ? (
                                    <Button disabled = {this.props.paymentMethod !== "credit"} size = "small"
                                        onClick = {(e) => {
                                            this.props.Actions.showModal("ADD_NEW_CARD");
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    ><Trans id = "add_new_card"/></Button>
                                ): (null)
                            }
                        </div>
                        <div 
                            className = {this.paymentMethodClassNname(this.props.paymentMethod == "paypal", this.props.ordersData && !this.props.toPayOrder) }
                            onClick = {()=> {
                                if(this.props.ordersData && !this.props.toPayOrder) return;
                                if(!this.props.ordersData || (this.props.ordersData && this.props.toPayOrder))  this.props.Actions.setPaymentMethod("paypal")
                            }}
                        >
                            <Radio checked = {this.props.paymentMethod == "paypal" ? true :  false} className = "check"/>
                            <div className = "info">
                                <div className = "title">Paypal</div>
                                <div className = "details"><Trans id = "account_financials_step3_paypal_text"/></div>
                            </div>
                        </div>
                        <div
                            className = {this.paymentMethodClassNname(this.props.paymentMethod == "bank" || (this.props.ordersData && !this.props.toPayOrder), null) }
                            onClick = {(e)=> {
                                if(!this.props.disableBankTransfer || !this.props.disablePayByBank && !this.props.toPayOrder) this.props.Actions.setPaymentMethod("bank")
                            }}
                        >
                            {
                                this.props.paymentMethod === "bank" ? (
                                    <Radio checked = {this.props.paymentMethod == "bank" ? true :  false} className = "check"/>
                                ):(null)
                            }
                            <div className = "info">
                                <div className = "title"><Trans id = "account_financials_bank_transfer"/></div>
                                <div>
                                    {
                                        !this.props.ordersData ? (
                                            <Trans id = "account_financials_make_the_payment"/>
                                        ): (null)
                                    }
                                </div>
                                <div className = "details">
                                                <Trans id = "you_have_not_payed_pending_order"/><Trans id = "your_order"/>
                                                {this.props.ordersData && this.props.ordersData.order_number ? this.props.ordersData.order_number + "-" : ""}
                                                <Trans id = "account_invocies_amount"/>
                                                € {this.props.ordersData && this.props.ordersData.total_amount ? this.props.ordersData.total_amount.toFixed(2) : ""}
                                </div>
                                {
                                    this.props.ordersData?(
                                        <div style = {{display:"flex"}}>
                                        <Button variant = "success" style = {{flex:1}} disabled = {this.props.toPayOrder} onClick = {(e)=>{this.props.Actions.enableToPayOrder(); e.preventDefault(); e.stopPropagation();}}><Trans id = "financials_button_pay"/></Button>
                                        <Button variant = "warning"
                                            onClick = {(e)=>{
                                                if(this.props.ordersData._id)
                                                {
                                                    this.openDeletePendingOrder(this.props.ordersData._id);
                                                }
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        ><Trans id = "financials_button_cancel"/></Button>
                                    </div>
                                    ):(null)
                                }
                               </div>
                        </div>
                    </Col>
                    <Col md = {5} className = "details-view">
                        <div className = "details-section">
                            <div className = "details-info">
                                <div className = "title"><Trans id = "account_financials_totla_excl_vat"/></div>
                                <div className = "info">  {
                                this.props.backgroundProcess ? (
                                    <Spinner animation = "border"  size="sm"/>
                                ):this.props.paymentData ? " € " + this.props.paymentData.amount : ""}</div>
                            </div>
                            <div className = "details-info">
                                <div className = "title"><Trans id = "account_financials_totla_vat"/> ({this.props.taxData ? this.props.taxData.standard_rate:""}%)</div>
                                <div className = "info">  { 
                                this.props.backgroundProcess ? (
                                    <Spinner animation = "border"  size="sm"/>
                                    ):this.props.paymentData && this.props.paymentData.vat_amount ? " € " + this.props.paymentData.vat_amount.toFixed(2):""}</div>
                            </div>
                        </div>
                        <div className = "details-section">
                            <div className = "details-info">
                                <div className = "title"><Trans id = "account_financials_totla_to_pay"/></div>
                                <div className = "info">  {
                                this.props.backgroundProcess ? (
                                    <Spinner animation = "border"  size="sm"/>
                                    ):this.props.paymentData && this.props.paymentData.total_amount ? " € " + this.props.paymentData.total_amount.toFixed(2):""}</div>
                            </div>
                            <div className = "details-info">
                                <div className = "title"><Trans id = "account_financials_bonus"/></div>
                                <div className = "info">  { 
                                this.props.backgroundProcess ? (
                                    <Spinner animation = "border"  size="sm"/>
                                    ):this.props.paymentData ? " € " + this.getDiscountAmount().toFixed(2) : ""}</div>
                            </div>
                        </div>
                        <div className = "details-section">
                            <div className = "details-info">
                                <div className = "title"><Trans id = "account_financials_total_recharge"/> </div>
                                <div className = "info">  {
                                this.props.backgroundProcess ? (
                                    <Spinner animation = "border"  size="sm"/>
                                    ):" € " +this.getTotalRecharge()}</div>
                            </div>
                           
                        </div>
                        <br/>
                        {
                            this.props.paymentMethod === 'credit' && this.state.stripeCards.length > 0 ? (
                                <p>
                                    <strong><Trans id = "credit_card"/></strong>
                                </p>
                            ) : (null)
                        }
                        {
                            <React.Fragment>
                            {this.props.paymentMethod === 'credit' ? this.state.stripeCards.map((stripeCard, index) => (
                                <div className = "pay-item" key = {index}>
                                    <div 
                                        className = {stripeCard.stripe_id === this.statepaymentData.card_id ? "pay-item-inner card-choiced-item":"pay-item-inner"}
                                        onClick = {()=>{this.props.Actions.selectCard(stripeCard.stripe_id)}}
                                    >
                                        <div className = "pay-item-text">
                                             <span>
                                                 <strong>{stripeCard.card_holder_name + " "}</strong> xxxx-<strong>{stripeCard.last_4_digits}</strong>                                               
                                             </span>
                                             <span>
                                                 <Trans id = "expires_on"/>
                                                 {stripeCard.expiration_month} / {stripeCard.expiration_year}
                                             </span>
                                        </div>
                                        <div className = "pay-item-close"
                                            onClick = {()=>{
                                                this.openDeleteStripeCard(stripeCard.stripe_id)
                                            }}
                                        >
                                            X
                                        </div>
                                    </div>
                                </div>
                            )):(null)}
                            </React.Fragment>
                        }
                        {
                            this.props.paymentMethod == "credit" ? (
                                <Button
                                     variant = "success"
                                     style = {{width:"100%"}}
                                     disabled = {this.props.disablePayButton || this.state.stripeCards.length < 1}
                                     onClick = {()=>this.props.Actions.payByCard()}
                                >
                                    <img alt = "" src = {PayImg}/><Trans id = "pay_with_credit_card"/>
                                </Button>
                            ):(null)
                        }
                        {
                            this.props.paymentMethod == "paypal" ? (
                                <Button
                                     variant = "success"
                                     style = {{width:"100%"}}
                                     disabled = {this.props.disablePayButton}
                                     onClick = {()=>this.props.Actions.payByPaypal(this.props.paymentData)}
                                >
                                    <img alt = "" src = {PayImg}/><Trans id = "account_financials_pay_by_paypal"/>
                                </Button>
                            ):(null)
                        }
                         {
                            this.props.paymentMethod == "bank" && !this.props.ordersData ? (
                                <Button 
                                    variant = "success"
                                    style = {{width:"100%"}} 
                                    disabled = {this.props.disablePayButton}
                                    onClick = {()=>this.props.Actions.payByBank(this.props.paymentData)}
                                >
                                    <img alt = "" src = {PayImg}/><Trans id = "account_financials_confirm_and_send_email"/>
                                </Button>
                            ):(null)
                        }
                    </Col>
                </Row>
            </div>   
        )
    }
}

export default connect(
    state => ({
        userData: state.user.userData,
        taxData:state.user.taxData,
        backgroundProcess: state.user.backgroundProcess,
        paymentMethod: state.user.paymentMethod,
        paymentData: state.user.paymentData,
        checkboxVAT: state.user.checkboxVAT,
        toPayOrder: state.user.toPayOrder,
        disableCreditActions: state.user.disableCreditActions,
        ordersData: state.user.ordersData,
        payByBankSuccess: state.user.payByBankSuccess,
        lastCheckedVatId: state.user.lastCheckedVatId,
        lastCheckedCoupon: state.user.lastCheckedCoupon,
        disableBankTransfer: state.user.disableBankTransfer,
        discountData: state.user.discountData,
        disablePayButton: state.user.disablePayButton,
        disablePayByBank: state.user.disablePayByBank,
        checkboxDiscountCode: state.user.checkboxDiscountCode
    }),
    dispatch => ({
      Actions: bindActionCreators({ 
          getUserData,
          getTaxData,
          checkOrdersData,
          updateMainData,
          checkVatId, 
          checkCouponCode,
          setPaymentData,
          setCheckBoxVat,
          setCheckBoxDiscountCode,
          setDiscountData,
          payByBank,
          setPaymentMethod,
          removeOrder,
          payByPaypal,
          selectCard,
          removeCard,
          payByCard,
          //modal actions;
          showModal,
          enableToPayOrder 
      }, dispatch),
    })
  )(RechargeForm);
  