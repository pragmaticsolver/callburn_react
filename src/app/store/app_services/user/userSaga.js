import { put, takeEvery, call, all } from 'redux-saga/effects';
import moment from 'moment-timezone';
// Import Actions
import {
  getUserData,
  setTimeZone,
  setCurrentTime,
  getUserDataSucceed,
  getBillingsSucceed,
  getBillingsFailed,
  getInvoicesSucceed,

  checkCouponCodeFailed,
  checkCouponCodeSucceed,
  getTaxDataSucceed,
  checkOrdersData,
  checkOrdersDataSucceed,
  checkOrdersDataFailed,
  orderMainData,
  updateMainDataSucceed,
  updateMainDataFailed,
  checkVatIdSucceed,
  checkVatIdFailed,
  payByBankSucceed,
  payByBankFailed,
  removeOrderFailed,
  removeOrderSucceed,
  payByPaypalFailed,
  payByPaypalSucceed,
  payByCardSucceed,
  payByCardFailed,

} from './userAction';

// Import API
import * as userApi from './userApi';

export function* userSubscriber() {
  yield all([takeEvery('GET_USER_DATA', getUser)]);
  yield all([takeEvery('GET_BILLINGS', getBillingsFun)]);
  yield all([takeEvery('GET_INVOICES', getInvoicesFun)]);
  yield all([takeEvery('INVOICE_DOWNLOAD', invoiceDownloadFun)]);

  yield all([takeEvery('GET_TAX_DATA', getTaxDataFun)]);
  yield all([takeEvery('CHECK_ORDERS_DATA', checkOrdersDataFun)]);
  yield all([takeEvery('UPDATE_MAIN_DATA', updateMainDataFun)]);
  yield all([takeEvery('CHECK_VAT_ID', checkVatIdFun)]);
  yield all([takeEvery('CHECK_COUPON_CODE', checkCouponFun)]);
  yield all([takeEvery('PAY_BY_BANK', payByBankFun)]);
  yield all([takeEvery('REMOVE_ORDER', removeOrderFun)]);
  yield all([takeEvery('PAY_BY_PAYPAL', payByPaypalFun)]);
  yield all([takeEvery('SELECT_CARD', selectCardFun)]);
  yield all([takeEvery('REMOVE_CARD', removeCardFun)]);
  yield all([takeEvery('PAY_BY_CARD', payByCardFun)]);
}

export function* getUser() {
  try {
    console.log("get_user_data")
    const userData = yield call(userApi.getUser);
    yield put(getUserDataSucceed(userData.resource.user_data));
  } catch (error) {
    console.log("error")
    window.location.href = "/login";
  }
}
export function* getBillingsFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.getBillings, params);
    yield put(getBillingsSucceed(Data));
  } catch (error) {
  }
}
export function* getInvoicesFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.getInvoices, params);
    yield put(getInvoicesSucceed(Data));
  } catch (error) {
  }
}
export function* invoiceDownloadFun({ payload: { params } }) {
  try {
    const tokenData = yield call(userApi.downloadToken, params);
    window.location.href = `https://beta.callburn.com/billings/download-invoice?id=${params.id}&token=${tokenData.resource.token}`
  } catch (error) {
  }
}
export function* checkOrdersDataFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.checkOrdersData);
    yield put(checkOrdersDataSucceed(Data));
    //
  } catch (error) {
    yield put(checkOrdersDataFailed(error))
  }
}

//
export function* getTaxDataFun() {
  try {
    const Data = yield call(userApi.getTaxData);
    yield put(getTaxDataSucceed(Data));
    yield put(orderMainData());
  } catch (error) {
    yield put(checkCouponCodeFailed(error))
  }
}
export function* updateMainDataFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.updateMainData, params);
    if (Data.resource.error.no == 0) {
      yield put(updateMainDataSucceed(true));
      yield put(getUserData());

    } else {
      yield put(updateMainDataFailed("error"));
    }
  } catch (error) {
    yield put(updateMainDataFailed(error))
  }
}
export function* checkVatIdFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.checkVatId, params);
    if (Data.resource.error.no == 0) {
      yield put(checkVatIdSucceed(true));
      yield put(getUserData());

    } else {
      yield put(checkVatIdFailed("error"));
    }
  } catch (error) {
    yield put(checkVatIdFailed(error))
  }
}
export function* checkCouponFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.checkCoupon, params);
    if (Data.resource.error.no == 0) {
      yield put(checkCouponCodeSucceed(Data));
    } else {
      yield put(checkCouponCodeFailed(Data.resource.error.text));
    }
  } catch (error) {
    yield put(checkCouponCodeFailed(error))
  }
}
export function* payByBankFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.createBankOrder, params);
    if (Data.resource.error.no == 0) {
      yield put(payByBankSucceed(Data));
    } else {
      yield put(payByBankFailed(Data.resource.error.text));
    }
  } catch (error) {
    yield put(payByBankFailed(error))
  }
}
export function* removeOrderFun({ payload: { order_id } }) {
  try {
    const Data = yield call(userApi.removeOrder, order_id);
    if (Data.resource.error.no == 0) {
      yield put(removeOrderSucceed(true));
      yield put(checkOrdersData());
    } else {
      yield put(removeOrderFailed(Data.resource.error.text));
    }
  } catch (error) {
    yield put(removeOrderFailed(error))
  }
}
export function* payByPaypalFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.payByPaypal, params);
    if (Data.resource.error.no == 0) {
      yield put(payByPaypalSucceed(true));
    } else {
      yield put(payByPaypalFailed(Data.resource.error.text));
    }
  } catch (error) {
    yield put(payByPaypalFailed(error))
  }
}
export function* selectCardFun({ payload: { card_id } }) {
  try {
    const Data = yield call(userApi.selectCard, { card_id: card_id });
    if (Data.resource.error.no == 0) {

    } else {
      console.log(Data.resource.error.text)
    }
  } catch (error) {
    console.log(error)
  }
}
export function* removeCardFun({ payload: { card_id } }) {
  try {
    const Data = yield call(userApi.removeCard, card_id);
    if (Data.resource.error.no == 0) {

    } else {
      console.log(Data.resource.error.text)
    }
  } catch (error) {
    console.log(error)
  }
}
export function* payByCardFun({ payload: { params } }) {
  try {
    const Data = yield call(userApi.payByCard, params);
    if (Data.resource.error.no == 0) {

    } else {
      console.log(Data.resource.error.text)
    }
  } catch (error) {
    console.log(error)
  }
}