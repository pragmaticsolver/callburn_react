import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
  getPhoneGroupSucceed,
  getPhoneGroupFailed,
  getContactsSucceed,
  getContactsFailed,
  getBlackListSucceed,
  getBlackListFailed,
  addNumberToBlackListSucceed,
  removeNumberFromBlackListSucceed,
  removeGroupSucceed,
  removeGroupFailed,
  mergeGroupSucceed,
  mergeGroupFailed,
  addNumberToBlackListFailed,
} from './phoneBookAction';
// Import API
import * as phoneBookApi from './phoneBookApi';
import * as userApi from '../user/userApi';
export function* phoneBookSubscriber() {
  yield all([takeEvery('GET_PHONE_GROUP', getPhoneGroup_Fun)]);
  yield all([takeEvery('GET_CONTACTS',    getContacts_Fun)]);
  yield all([takeEvery('GET_BLACK_LIST',    getBlackListFun)]);
  yield all([takeEvery('ADD_NUMBER_TO_BLACK_LIST',    addNumberToBlackListFun)]);
  yield all([takeEvery('REMOVE_NUMBER_FROM_BLACK_LIST',  removeNumberFromBlackListFun)]);
  yield all([takeEvery('EXPORT_CONTACTS',  exportContactsFun)]);
  yield all([takeEvery('REMOVE_GROUP',  removeGroupfun)]);
  yield all([takeEvery('MERGE_GROUP',  mergeGroupFun)]);
  
}
///---Group script------
export function* getPhoneGroup_Fun({ payload: { params } }) {
  try {
    const groupData = yield call(phoneBookApi.getGroups, params);
    yield put(getPhoneGroupSucceed(groupData));
  } catch (error) {
    yield put(getPhoneGroupFailed(error));
  }
}
//----Contacts Script------
export function* getContacts_Fun({ payload: { params } }) {
  try {
    const contactsData = yield call(phoneBookApi.getContacts, params);
    yield put(getContactsSucceed(contactsData));
  } catch (error) {
    yield put(getContactsFailed(error));
  }
}
//----blackList----
export function* getBlackListFun({ payload: { params } }) {
  try {
    const blackListData = yield call(phoneBookApi.getBlackList, params);
    yield put(getBlackListSucceed(blackListData.resource));
  } catch (error) {
    yield put(getBlackListFailed(error));
  }
}

export function* addNumberToBlackListFun({ payload: { params } }) {
  try {
    yield call(phoneBookApi.addNumberToBlackList, params);
    yield put(addNumberToBlackListSucceed(true));
  } catch (error) {
    yield put(addNumberToBlackListFailed(error))
  }
}
export function* removeNumberFromBlackListFun({ payload: { params } }) {
  try {
    yield call(phoneBookApi.removeNumberFromBlackList, params);
    yield put(removeNumberFromBlackListSucceed(true));
  } catch (error) {
  }
}
export function* exportContactsFun({ payload: { groupData } }) {
  try {
    const tokenData = yield call(userApi.downloadToken);
    window.location.href = `https://beta.callburn.com/address-book/export-contacts?group_or_contact=group&token=${tokenData.resource.token}&locale=en&selected_ids=${JSON.stringify(groupData)}`;
  } catch (error) {
  }
}
export function* removeGroupfun({ payload: { params } }) {
  try {
    yield call(phoneBookApi.removeGroup, params);
    yield put(removeGroupSucceed(true));
  } catch (error) {
    yield put(removeGroupFailed(error))
  }
}

export function* mergeGroupFun({ payload: { params } }) {
  try {
    const result = yield call(phoneBookApi.mergeGroup, params);
    if(result.resource.error.no === 0) {
      yield put(mergeGroupSucceed(true));
    } else {
      yield put(mergeGroupFailed("Error is occoured!"));
    }
  } catch (error) {
    yield put(mergeGroupFailed(error))
  }
}

