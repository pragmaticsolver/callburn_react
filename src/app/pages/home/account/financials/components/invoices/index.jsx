import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment-timezone';
//import material ui components;
import {Table, TableHead, TableBody, TableRow, TableCell,
       Tooltip, Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {Spinner, Pagination} from 'react-bootstrap';
//import style && images;
import './style.scss';
import PigIcon from 'assets/callburn/images/images/pig-icon@3x.svg';
import DownloadIcon from '@material-ui/icons/Description';
//import translation components;
import Trans from '../../../../utils/Trans';
//import Actions;
import {getBillings, getInvoices,checkOrdersData, invoiceDownload} from '../../../../../../store/app_services/user/userAction';
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: 'black',
      color: 'white',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);

class InvoiceForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            ordersData: null,
            ordersDataLoading: false,
        }
    }
    getDateDifference = (created_at) => {
        // moment.locale($rootScope.currentLanguage)
        // createdAt = moment(created_at);
        // $scope.createdAtFormated = $filter('localDate')(moment(created_at));
        
        // return createdAt.fromNow();
        return created_at;
    }
    getAppropriateStatus = (type, billingObj) => {
        if (type === 'BILLING') {
            return <Trans id = 'account_invocies_billings_billed'/>;
        } else if (type === 'GIFT') {
            return <Trans id ='account_invocies_billings_gifted_2'/>;
        } else if (type === 'TRANSACTION') {
            return <Trans id = 'account_invocies_billings_purchased'/>;
        } else if (type === 'REFUND') {
            return <Trans  id = 'account_invocies_billings_refund'/>;
        } else if (type === 'MANUAL_SERVICE') {
            return <Trans id = 'account_invocies_billings_manual_service'/>;
        }
    };
    getAppropriateAmount = (type, billingObj) => {
        billingObj.paidFromGift = false;
        billingObj.giftSumText = null;
        if (type === 'BILLING') {
            if (billingObj.giftSum) {
                billingObj.paidFromGift = true
                // var giftSum = <Trans id ='account_invocies_billings_gift'/> + ": (€ " + billingObj.giftSum.toFixed(2) + ")";
                var giftSum = "Taken from free credit" + ": (€ " + billingObj.giftSum.toFixed(2) + ")";
                billingObj.giftSumText = giftSum;
                var final_amount = billingObj.purchasedSum + billingObj.giftSum;
                return final_amount.toFixed(2);
            }
            return billingObj.purchasedSum.toFixed(2);
        } else if (type === 'GIFT') {

            return billingObj.giftSum ? billingObj.giftSum.toFixed(2) : '0.00'; 
        } else if (type === 'TRANSACTION') {
            // var taxAmount = billingObj.taxAmount && parseInt(billingObj.taxAmount) > 0 ? <Trans id = 'account_invocies_billings_tax_amount'/> + ": (€ " + billingObj.taxAmount.toFixed(2) + ")" : "";
            // $scope.invoiceGiftSum = taxAmount; ikram-global-varialble
            return billingObj.purchasedSum.toFixed(2);
        } else if (type === 'REFUND') {
            if (billingObj.giftSum) {
                var giftSum = "Taken from free credit" + ": (€ " + billingObj.giftSum.toFixed(2) + ")";
                // $scope.invoiceGiftSum = giftSum; 
                var final_amount = Math.abs(billingObj.purchasedSum + billingObj.giftSum);
                return "- " + final_amount.toFixed(2);
            }
            return "- " +Math.abs(billingObj.purchasedSum).toFixed(2);
        } else if (type === 'MANUAL_SERVICE') {
            return billingObj.purchasedSum.toFixed(2);
        }
    }
    getBalanceAfterBilling = (billing) => {
        var balanceAfterBilling = billing.current_balance_after_billing.toFixed(2);
        return balanceAfterBilling;
    }
    componentDidMount(){
        this.props.userActions.getBillings({page:0});
        this.props.userActions.getInvoices({invoices_page:0})
        this.props.userActions.checkOrdersData();
    }
    makePagenationItems = (totalCount) => {
        var list = [];
        var startPage =  10 * Math.floor(this.props.billingsPage / 10);
        var itemNumber;
        if(startPage == 0) itemNumber = 1;
        else itemNumber = startPage;
        if(itemNumber > 1) list.push(itemNumber -1)
        for(var i = startPage * 10; i <=  Math.min((startPage + 10) * 10, totalCount); i+=10)
        {
          list.push(itemNumber);
          itemNumber++;
        }
        return(
          <React.Fragment>
            {
              list.map((item,index)=>(
                <Pagination.Item key = {index} active={item==this.props.billingsPage}
                  onClick = {()=>{
                    this.props.userActions.getBillings({page:item - 1});
                  }}
                >
                   {item}
                </Pagination.Item>
              ))
            }
          </React.Fragment>
        )
    }
    makePagenationItems1 = (totalCount) => {
        var list = [];
        var itemNumber = 1;
        for(var i = 0; i <= totalCount; i+=5)
        {
          list.push(itemNumber);
          itemNumber++;
        }
        return(
          <React.Fragment>
            {
              list.map((item,index)=>(
                <Pagination.Item key = {index} active={item==this.props.invoicesPage}
                  onClick = {()=>{
                    this.props.userActions.getInvoices({invoices_page:item - 1});
                  }}
                >
                   {item}
                </Pagination.Item>
              ))
            }
          </React.Fragment>
        )
    }
    render(){
        return(
            <div className = "invoice-form-wrapper">
                <div className = "info-section">
                    <div>
                        <Trans id = "account_financials_actual_balance"/> <span className = "balance-letter">€ {this.props.balance ? this.props.balance.toFixed(2):""} </span>
                        <Trans id = "retained_credit_text"/>  <span className = "retained-credit-letter">€ {this.props.retainedBalance?this.props.retainedBalance.toFixed(2):""}</span>
                    </div>
                </div>
                <div className = "billing-detail-section">
                    <h3 className = "billing-details-title"><Trans id = "account_invocies_billings_details"/></h3>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><Trans id ="invoice_billing_date" name = ""/></TableCell>
                                <TableCell align="center"><Trans id ="invoice_billing_status" name = ""/></TableCell>
                                <TableCell align="center"><Trans id ="invoice_billing_amount" name = ""/></TableCell>
                                <TableCell align="center"><Trans id ="invoice_billing_balance" name = ""/></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.billings && this.props.billings.map((billing, index) => (
                                    <TableRow key = {index}>
                                        <TableCell align="center">{ this.getDateDifference(billing.created_at) }</TableCell>
                                        <TableCell align="center" 
                                              className = {billing.billingType == "BILLING"?"billed":""}
                                              onClick = {()=>{
                                                  if(billing.billingType == "BILLING"){
                                                      //this.getBillingDetails(billing)  ikram-api
                                                  }
                                              }}
                                        >
                                              { this.getAppropriateStatus(billing.billingType, billing) }
                                        </TableCell>
                                        <TableCell align="center">
                                          {
                                             "€" + this.getAppropriateAmount(billing.billingType, billing)
                                          }
                                          {
                                                billing.paidFromGift && (
                                                    <HtmlTooltip
                                                        title={
                                                        <React.Fragment>
                                                        <Typography component = "div" color="inherit" >
                                                            { billing.giftSumText }
                                                        </Typography>
                                                        </React.Fragment>}
                                                    placement = "top"
                                                    >
                                                        <img alt = "" src = {PigIcon}/>
                                                    </HtmlTooltip>
                                                )
                                          }
                                        </TableCell>
                                        <TableCell align="center">{ this.getBalanceAfterBilling(billing) }</TableCell>
                                    </TableRow>
                                ))
                            }
                           
                        </TableBody>
                    </Table>
                    {
                        this.props.billingsLoading == true ? (
                            <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                                <Spinner animation = "border" color = "primary"/>
                            </div>
                        ):(null)
                    }
                     <div style = {{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5px"}}>
                        <Pagination>
                        {
                            this.props.totalBillingsCount > 10 ? (
                                this.makePagenationItems(this.props.totalBillingsCount)
                            ):(null)
                        }
                        </Pagination>
                    </div>
                </div>
                <div className = "invoice-detail-section">
                    <h3 className = "invoice-detail-title"><Trans id = "account_invocies_your_invoices"/></h3>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><Trans id = "account_invocies_invoices"/></TableCell>
                                <TableCell align="center"><Trans id = "account_invocies_date"/></TableCell>
                                <TableCell align="center"><Trans id = "account_invocies_amount"/></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.invoicesData && this.props.invoicesData.map((invoice, index) => (
                                    <TableRow key = {index}>
                                        <TableCell align="center">
                                               {invoice.invoice_number}
                                        </TableCell>
                                        <TableCell align="center">
                                            {invoice.invoice_date}
                                        </TableCell>
                                        <TableCell align="center">{invoice.purchased_amount}</TableCell>
                                        <TableCell align="center">
                                            <DownloadIcon
                                                onClick = {()=>{
                                                    this.props.userActions.invoiceDownload({id:invoice._id})
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    {
                        this.props.getInvoicesLoading == true ? (
                            <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                                <Spinner animation = "border" color = "primary"/>
                            </div>
                        ):(null)
                    }
                     <div style = {{display:"flex", justifyContent:"center", alignItems:"center", marginTop:"5px"}}>
                        <Pagination>
                        {
                            this.props.totalInvoicesCount > 5 ? (
                                this.makePagenationItems1(this.props.totalInvoicesCount)
                            ):(null)
                        }
                        </Pagination>
                    </div>
                </div>
                <div className = "pending-detail-section">
                    <h3 className = "pending-details-title"><Trans id = "account_invocies_your_pending"/></h3>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><Trans id = "account_invocies_order_id"/></TableCell>
                                <TableCell align="center"><Trans id = "account_invocies_date"/></TableCell>
                                <TableCell align="center"><Trans id = "account_invocies_amount"/></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.ordersData ? (
                                    <TableRow>
                                        <TableCell align="center">{this.props.ordersData.order_number}</TableCell>
                                        <TableCell align="center">{ this.props.ordersData.created_at}</TableCell>
                                        <TableCell align="center">{this.props.ordersData.purchased_amount}</TableCell>
                                        <TableCell align="center"><a href = "#">click here to pay</a></TableCell>
                                    </TableRow>
                                ):(null)
                            }
                           
                        </TableBody>
                    </Table>
                    {
                        this.props.ordersDataLoading ? (
                            <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                                <Spinner animation = "border" color = "primary"/>
                            </div>
                        ):(null)
                    }
                </div>
             </div>   
        )
    }
}

export default connect(
    state => ({
        //---billings-----
        billings:state.user.billingsData,
        billingsLoading: state.user.getBillingsLoading,
        billingsPage: state.user.billingsPage,
        totalBillingsCount: state.user.totalBillingsCount,
        //----Invoices-----
        invoicesData: state.user.invoicesData,
        invoicesPage: state.user.invoicesPage,
        totalInvoicesCount: state.user.totalInvoicesCount,
        getInvoicesLoading: state.user.getInvoicesLoading,
        //---
        retainedBalance: state.user.userData.retainedBalance,
        balance: state.user.userData.balance,
        ordersDataLoading: state.user.ordersDataLoading,
        ordersData: state.user.ordersData
    }),
    dispatch => ({
      userActions: bindActionCreators({ getBillings, getInvoices,checkOrdersData, invoiceDownload }, dispatch)
    })
  )(InvoiceForm);
  