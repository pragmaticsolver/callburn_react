import { handleActions } from 'redux-actions';

import {
  getUserData,
  getUserDataSucceed,
  setCurrentTime,
  getBillings,
  getBillingsSucceed,
  getBillingsFailed,
  getInvoices,
  getInvoicesSucceed,
  getInvoicesFailed,


  initRechargeValue,
  getTaxDataSucceed,
  checkOrdersData,
  checkOrdersDataSucceed,
  checkOrdersDataFailed,
  orderMainData,
  updateMainDataSucceed,
  updateMainDataFailed,
  checkVatId,
  checkVatIdSucceed,
  checkVatIdFailed,
  checkCouponCode,
  checkCouponCodeSucceed,
  checkCouponCodeFailed,
  setPaymentData,
  setCheckBoxVat,
  setCheckBoxDiscountCode,
  enableToPayOrder,
  payByBank,
  payByBankSucceed,
  payByBankFailed,
  setDiscountData,
  setPaymentMethod,
  removeOrder,
  removeOrderSucceed,
  removeOrderFailed,
  payByPaypal,
  payByPaypalSucceed,
  payByPaypalFailed,
  selectCard,
  payByCard,
  payByCardSucceed,
  payByCardFailed,
} from './userAction';

const defaultState = {
   userData: [],
   currentTime: "",
   error: null,
   loading: false,
   message :"",
   success: false,
   //------Billings------
   billingsData: [],
   billingsPage: 0,
   totalBillingsCount: 0,
   getBillingsLoading: false,
   getBillingsError: null,
   //------Invoices------
   invoicesData: [],
   invoicesPage: 0,
   totalInvoicesCount: 0,
   getInvoicesLoading: false,
   getInvoicesError: null,
   //---------------------
   //---check orders------
   ordersData : {},
   toPayOrder : false,
   checkOrdersLoading: false,
   //---------------------
   //---check coupon code
   couponCheckLoading: false,
   coupon: null,
   ordersDataLoading: false,
   taxData: null,
   backgroundProcess: false,
   paymentMethod: "",
   paymentData:  null,
   disableBankTransfer: false,
   disablePayByBank: false,
   checkboxDiscountCode: false,
   checkedDiscountCode: false,
   checkboxVAT: false,
   lastCheckedVatId: null,
   disableCreditActions: false,
   vatUpdateChecker: false,
   errClass: "",
   minAmount: null,
   lastCheckedCoupon: null,
   discountData: null,
   hideBonus: false,
   disablePayButton: false,
   payByBankSuccess: false,

};

const reducer = handleActions({
  
  [getUserData](state) {
    return {
      ...state,
      error: null,
      loading: true,
      message: 'getting userData...'
    }
  },
  [getUserDataSucceed](state, { payload: { userData } }) {
    return {
      ...state,
      error: null,
      loading: false,
      userData: userData
    }
  },
  [setCurrentTime](state, { payload: { currentTime } }) {
    return {
      ...state,
      error: null,
      loading: false,
      currentTime: currentTime
    }
  },
  [getBillings](state, { payload: { parans } }) {
    return {
      ...state,
      getBillingsError: null,
      getBillingsLoading: true
    }
  },
  [getBillingsSucceed](state, { payload: { billingsData } }) {
    return {
      ...state,
      getBillingsError: null,
      getBillingsLoading: false,
      billingsData: billingsData.resource.billings,
      totalBillingsCount: billingsData.resource.count,
      billingsPage: billingsData.resource.page,
    }
  },
  [getBillingsFailed](state, { payload: { error } }) {
    return {
      ...state,
      getBillingsLoading: false,
      getBillingsError: error
    }
  },
  [getInvoices](state, { payload: { parans } }) {
    return {
      ...state,
      getInvoicesError: null,
      getInvoicesLoading: true
    }
  },
  [getInvoicesSucceed](state, { payload: { invoicesData } }) {
    return {
      ...state,
      getInvoicesError: null,
      getInvoicesLoading: false,
      invoicesData: invoicesData.resource.invoices,
      totalInvoicesCount: invoicesData.resource.count,
      invoicesPage: invoicesData.resource.page,
    }
  },
  [getInvoicesFailed](state, { payload: { error } }) {
    return {
      ...state,
      getInvoicesLoading: false,
      getInvoicesError: error
    }
  },
 
  
  //
  [initRechargeValue](state, { payload: { params } }) {
    return {
      ...state,
      
    }
  },
  [getTaxDataSucceed](state, {payload:{data}}) {
    return {
      ...state,
      taxData: data
    }
  },
  [checkOrdersData](state) {
    return {
      ...state,
      backgroundProcess: true,
      ordersDataLoading: true,
    }
  },
  [checkOrdersDataSucceed](state, { payload: { ordersData } }) {
    var _paymentMethod = ""
    if (state.ordersData || (state.disableBankTransfer || state.disablePayByBank)) {
        _paymentMethod = 'bank';
    } else {
        _paymentMethod = 'credit';
    }
    return {
      ...state,
      ordersData: ordersData.resource.invoices[0],
      toPayOrder: false,
      paymentMethod: _paymentMethod,
      backgroundProcess: false,
      ordersDataLoading: false,
    }
  },
  [checkOrdersDataFailed](state, { payload: { error } }) {
    return {
      ...state,
      backgroundProcess: false,
      ordersDataLoading: false,
    }
  },
  [orderMainData](state) {
    if(state.ordersData){
      return {
        ...state,
        paymentData :{
          amount: state.ordersData.purchased_amount,
          vat_id: state.ordersData.vat_id,
          vat_amount: state.ordersData.vat_amount,
          discount_code: state.ordersData.coupon_code,
          total_amount: state.ordersData.total_amount
        },
        disableBankTransfer: true,
        toPayOrder: false, //ikram
        checkboxDiscountCode: state.ordersData.coupon_code ? true : state.checkboxDiscountCode,
        checkedDiscountCode: state.ordersData.coupon_code ? false : state.checkedDiscountCode,
        checkboxVAT: state.ordersData.vat_id ? true : state.checkboxVAT,
      }
    } else {
      return {
        ...state,
        paymentData :{
          amount: (10).toFixed(2),
          vat_id: state.userData.vat,
          vat_amount: 0,
        },
        disableBankTransfer: false,
        disablePayByBank: false
      }
    }
  },
  [updateMainDataSucceed](state, { payload: { succeed } }) {
    return {
      ...state,
      backgroundProcess: state.vatUpdateChecker? false: state.backgroundProcess,
      vatUpdateChecker: true
    }
  },
  [updateMainDataFailed](state, { payload: { error } }) {
    return {
      ...state,
      backgroundProcess: false,
      vatUpdateChecker: false
    }
  },
  [checkVatId](state, { payload: { params } }) {
    return {
      ...state,
      backgroundProcess: true,
    }
  },
  [checkVatIdSucceed](state, { payload: { succeed } }) {
    return {
      ...state,
      backgroundProcess: false,
      taxData: {
                  ...state.taxData,
                  standard_rate: 0
               },
      lastCheckedVatId: state.paymentData.vat_id,
      errClass: 'input-success',
      paymentData:{
        ...state.paymentData,
        vat_amount: state.paymentData.amount && state.taxData ? (state.paymentData.amount * state.taxData.standard_rate) / 100 : 0,
        total_amount: Number(state.paymentData.vat_amount) + Number(state.paymentData.amount)
      }
    }
  },
  [checkVatIdFailed](state, { payload: { error } }) {
    return {
      ...state,
      backgroundProcess: false,
      errClass: 'input-warning',
    }
  },
  [checkCouponCode](state, { payload: { params } }) {
    return {
      ...state,
      couponCheckLoading: true,
    }
  },
  [checkCouponCodeSucceed](state, { payload: { couponData } }) {
    return {
      ...state,
      lastCheckedCoupon: couponData.resource.coupon,
      discountData: couponData.resource.coupon,
      minAmount: couponData.resource.coupon.minimum_amount,
      hideBonus: couponData.resource.coupon.minimum_amount < state.minAmount ? true : state.hideBonus,
    }
  },
  [checkCouponCodeFailed](state, { payload: { error } }) {
    return {
      ...state,
      error: error,
      message:"Error message"
    }
  },
  [setPaymentData](state, { payload: { paymentData } }) {
    return {
      ...state,
      paymentData: paymentData
    }
  },
  [setCheckBoxVat](state, { payload: { value } }) {
    return {
      ...state,
      checkboxVAT: value
    }
  },
  [setCheckBoxDiscountCode](state, { payload: { value } }) {
    return {
      ...state,
      checkboxDiscountCode: value
    }
  },
  [enableToPayOrder](state) {
    return {
      ...state,
      toPayOrder: true,
      disableCreditActions: true,
      paymentMethod:"paypal"
    }
  },
  [payByBank](state, { payload: { params } }) {
    return {
      ...state,
      paymentData: {
        ...state.paymentData,
        discount_code: state.checkboxDiscountCode === true? state.paymentData.discount_code : null,
        vat_id: state.checkboxVAT === true ? state.paymentData.vat_id : null
      },
      disablePayButton: true
    }
  },
  [payByBankSucceed](state, { payload: { data } }) {
    return {
      ...state,
      ordersData: data.resource.invoice,
      payByBankSuccess: true,
    }
  },
  [payByBankFailed](state, { payload: { error } }) {
    return {
      ...state,
      payByBankSuccess: false,
    }
  },
  [setDiscountData](state, { payload: { value } }) {
    return {
      ...state,
      discountData: value
    }
  },
  [setPaymentMethod](state, { payload: { method } }) {
    return {
      ...state,
      paymentMethod: method
    }
  },
  [removeOrder](state, { payload: { id } }) {
    return {
      ...state,
      disablePayButton: false,
    }
  },
  [removeOrderSucceed](state, { payload: { succeed } }) {
    return {
      ...state,
      message:"pending orders successfully deleted",
      error: null,
      success: true,
    }
  },
  [removeOrderFailed](state, { payload: { error } }) {
    return {
      ...state,
      message: typeof(error) == "string" ? error : "Error",
      error: error,
      success: false,
    }
  },
  [payByPaypal](state, { payload: { params } }) {
    return {
      ...state,
      paymentData: {
        ...state.paymentData,
        discount_code: state.checkboxDiscountCode === true? state.paymentData.discount_code : null,
        vat_id: state.checkboxVAT === true ? state.paymentData.vat_id : null
      },
      disablePayButton: true
    }
  },
  [payByPaypalSucceed](state, { payload: { succeed } }) {
    return {
      ...state,
      disablePayButton: false
    }
  },
  [payByPaypalFailed](state, { payload: { error } }) {
    return {
      ...state,
      disablePayButton: false,
      error: error,
      message: typeof(error) == "string" ? error : "Error",
    }
  },
  [selectCard](state, { payload: { card_id } }) {
    return {
      ...state,
      paymentData: {...state.paymentData, card_id: card_id}
    }
  },
  [payByCard](state, { payload: { params } }) {
    return {
      ...state,
      disablePayButton: true
    }
  },
  [payByCardSucceed](state, {payload:{succeed}}) {
    return {
      ...state,
      error: null,
      message: "payment_done_successfully",
      success: true,
      disablePayButton: false
    }
  },
  [payByCardFailed](state, {payload:{error}}) {
    return {
      ...state,
      error: error,
      message: typeof(error) == "string" ? error : "Error",
      success: false,
      disablePayButton: false
    }
  },
}, defaultState);

export default reducer;