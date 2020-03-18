import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
    getApiKeysSucceed,
    getApiKeysFailed,
    createKeySucceed,
    createKeyFailed,
    deleteKeySucceed, 
    deleteKeyFailed,
} from './campaignApiActions';

// Import API
import * as campaignApi from './campaignApiApi';

export function* apiSubscriber() {
  yield all([takeEvery('GET_API_KEYS', getApiKeysFun)]);
  yield all([takeEvery('DELETE_KEY', deleteKeyFun)]);
  yield all([takeEvery('CREATE_KEY', createKeyFun)]);
}

export function* getApiKeysFun() {
  try {
    const data = yield call(campaignApi.getApiKeys);
    yield put(getApiKeysSucceed(data.resource.api_keys));
  } catch (error) {
    yield put(getApiKeysFailed(error));
  }
}
export function* createKeyFun({payload:{params}}) {
  try {
    const data = yield call(campaignApi.createKey, params);
    yield put(createKeySucceed(data));
  } catch (error) {
    yield put(createKeyFailed(error));
  }
}

export function* deleteKeyFun({payload:{id}}) {
  try {
    const data = yield call(campaignApi.deleteKey, id);
    yield put(deleteKeySucceed(data));
  } catch (error) {
    yield put(deleteKeyFailed(error));
  }
}
