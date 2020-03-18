import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
//import pages;
import RechargeForm from './components/rechargeCredit';
import AutoChargeForm from './components/autoCharge';
import InvoiceForm from './components/invoices';
//import style;
import './financials.scss';
//import translation component
import Trans from '../../utils/Trans';
//import Actions;
class FinancialsForm extends React.Component {

  constructor(props)
  {
    super(props)
    this.state = {
      value : 0
    }
  }
  handleChange = (event, newValue) =>{
    this.setState({
      value: newValue
    })
  }
  render(){
    return (
      <div>
        <div className = "form-info">
            <h3 className = "title"><Trans id = "account_financials_financials"/></h3>
            <h5 className = "des">
                <Trans id = "account_financials_actual_balance"/>
                <span style = {{color:"#3190e6"}}> {
                  "€ "+ (this.props.userData.balance?this.props.userData.balance:"0")
                  }
                </span>
            </h5>
        </div>
        <AppBar position="static" color = "inherit">
          <Tabs  variant="fullWidth" value={this.state.value} onChange={this.handleChange}>
            <Tab label= {(<Trans id = "account_financials_recharge"/>)}  />
            <Tab label={(<Trans id = "include_nav_all_invoices"/>)}  />
          </Tabs>
        </AppBar>
        {this.state.value === 0 ? ( <RechargeForm  /> ):(null)}
        {/* {this.state.value === 1 ? ( <AutoChargeForm/> ):(null)} */}
        {this.state.value === 1 ? ( <InvoiceForm/>):(null)}
      </div>
    );
  }
}
export default connect(
  state => ({
      userData:state.user.userData,
  }),
   null
)(FinancialsForm);
