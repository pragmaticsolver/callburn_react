import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
    getCampaignsSucceed,
    getCampaignsFailed,
    getCampaignByIdSucceed,
    getCampaignByIdFailed,
    deleteCampaignSucceed,
    deleteCampaignFailed,
    updateCampaignStatusSucceed,
    updateCampaignStatusFailed,
    addCommentSucceed,
    getRetrySucceed,
    getRetryFailed,
    createGroupForUndeliveredFailed,
    createGroupForUndeliveredSucceed
} from './campaignAction';

// Import API
import * as campaignApi from './campaignApi';

export function* campaignSubscriber() {
  yield all([takeEvery('GET_CAMPAIGNS', getCampaigns_fun)]);
  yield all([takeEvery('GET_CAMPAIGN_BY_ID', getCampaignByID_fun)]);
  yield all([takeEvery('DELETE_CAMPAIGN', deleteCampaignFun)]);
  yield all([takeEvery('UPDATE_CAMPAIGN_STATUS', updateCampaignStatusFun)]);
  yield all([takeEvery('ADD_COMMENT', addCommentFun)]);
  yield all([takeEvery('GET_RETRY', getRetryFun)]);
  yield all([takeEvery('CREATE_GROUP_FOR_UNDELIVERED', createGroupFun)]);
}

export function* getCampaigns_fun({ payload: { params } }) {
  try {
    const campaignsData = yield call(campaignApi.getCampaigns, params);
    yield put(getCampaignsSucceed(campaignsData));
  } catch (error) {
    yield put(getCampaignsFailed(error));
  }
}
export function* getCampaignByID_fun({ payload: { id } }) {
  try {
    const data = yield call(campaignApi.getOneCampaign, id);
    yield put(getCampaignByIdSucceed(data.resource.campaign));
  } catch (error) {
    yield put(getCampaignByIdFailed("error"));
  }
}
export function* deleteCampaignFun({ payload: { id } }) {
  try {
    const data = yield call(campaignApi.deleteCampaign, id);
    yield put(deleteCampaignSucceed());
  } catch (error) {
    yield put(deleteCampaignFailed("error"));
  }
}
export function* updateCampaignStatusFun({ payload: { params } }) {
  try {
    const data = yield call(campaignApi.updateCampaignStatus, params);
    yield put(updateCampaignStatusSucceed(true));
  } catch (error) {
    yield put(updateCampaignStatusFailed("error"));
  }
}
export function* addCommentFun({ payload: { params } }) {
  try {
    const data = yield call(campaignApi.addComment, params);
    yield put(addCommentSucceed(true))
  } catch (error) {
  }
}
export function* getRetryFun({ payload: { campaign } }) {
  try {
    const retryData = yield call(campaignApi.getRetry, campaign._id);
    yield put(getRetrySucceed(retryData))
  } catch (error) {
    yield put(getRetryFailed(error))
  }
}
export function* createGroupFun({ payload: { params } }) {
  try {
    const data = yield call(campaignApi.createGroupForUndelivered, params);
    yield put(createGroupForUndeliveredSucceed(data.resource.group_id))
  } catch (error) {
    yield put(createGroupForUndeliveredFailed(error))
  }
}