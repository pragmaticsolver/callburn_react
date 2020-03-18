import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
   audioFileUploadSucceed,
   audioFileUploadFailed,
   callbackVoiceFileUploadFailed,
   callbackVoiceFileUploadSucceed,
   setCallbackFileId,
   blockVoiceFileUploadFailed,
   blockVoiceFileUploadSucceed,
   setBlockFileId,
   //template getting actions
   getTemplateFilesSucceed,
   getTemplateFilesFailed,
   setFileId,
   //Calculate cost;
   calculateCostSucceed,
   calculateCostFailed,
   //save campaign
   saveCampaignSucceed,
   saveCampaignFailed,
   addNumberManualySucceed,
   addNumberManualyFailed,
   
} from './campaignComposeAction';

// Import API
import * as composeApi from './campaignComposeApi';

export function* composeSubscriber() {
  yield all([takeEvery('AUDIO_FILE_UPLOAD', audioFileUploadFun)]);
  yield all([takeEvery('CALLBACK_VOICE_FILE_UPLOAD', callbackFileUploadFun)]);
  yield all([takeEvery('BLOCK_VOICE_FILE_UPLOAD', blockFileUploadFun)]);
  yield all([takeEvery('GET_TEMPLATE_FILES', getTemplatesFun)]);
  yield all([takeEvery('CALCULATE_COST',  calculateCostFun)]);
  yield all([takeEvery('SAVE_CAMPAIGN',  saveFun)]);
  yield all([takeEvery('ADD_NUMBER_MANUALY',  manulalInputFun)]);
}

export function* audioFileUploadFun({ payload: { params } }) {
  try {
    const data = yield call(composeApi.audioFileUpload, params);
    if(data.resource.error.no == 0 ) //no error
    {
      yield put(audioFileUploadSucceed(data.resource.file));
      yield put(setFileId(data.resource.file._id, data.resource.file.orig_filename));
    } else 
    {
      yield put(audioFileUploadFailed(data.resource.error.text));
    }
  } catch (error) {
    yield put(audioFileUploadFailed(error));
  }
}
export function* callbackFileUploadFun({ payload: { params } }) {
  try {
    const data = yield call(composeApi.audioFileUpload, params);
    if(data.resource.error.no == 0 ) //no error
    {
      yield put(callbackVoiceFileUploadSucceed(data.resource.file));
      yield put(setCallbackFileId(data.resource.file._id));
    } else 
    {
      yield put(callbackVoiceFileUploadFailed(data.resource.error.text));
    }
  } catch (error) {
    yield put(callbackVoiceFileUploadFailed(error));
  }
}
export function* blockFileUploadFun({ payload: { params } }) {
  try {
    const data = yield call(composeApi.audioFileUpload, params);
    if(data.resource.error.no == 0 ) //no error
    {
      yield put(blockVoiceFileUploadSucceed(data.resource.file));
      yield put(setBlockFileId(data.resource.file._id));
    } else 
    {
      yield put(blockVoiceFileUploadFailed(data.resource.error.text));
    }
  } catch (error) {
    yield put(blockVoiceFileUploadFailed(error));
  }
}
export function* getTemplatesFun() {
  try {
    const data = yield call(composeApi.getTemplateFiles);
    yield put(getTemplateFilesSucceed(data.resource.files));
  } catch (error) {
    yield put(getTemplateFilesFailed(error));
  }
}
export function* calculateCostFun({ payload: { params }}) {
  try {
    const costData = yield call(composeApi.calculateCost, params);
    if(costData.resource.error.no == 0)
    {
       yield put(calculateCostSucceed(costData.resource));
    } else {
       yield put(calculateCostFailed(costData.resource.error.text))
    }
  } catch (error) {
    yield put(calculateCostFailed(error));
  }
}

export function* saveFun({ payload: { params }}) {
  try {
    const result = yield call(composeApi.saveCampaign, params);
    if(result.resource.error.no == 0)
    {
       yield put(saveCampaignSucceed(result.resource));
    } else {
       yield put(saveCampaignFailed(result.resource.error.text))
    }
  } catch (error) {
    yield put(saveCampaignFailed(error));
  }
}

export function* manulalInputFun({ payload: { params }}) {
  try {
    const result = yield call(composeApi.manualInput, params);
    if(result.resource.error.no == 0)
    {
       yield put(addNumberManualySucceed(result));
    } else {
       yield put(addNumberManualyFailed(result.resource.error.text))
    }
  } catch (error) {
    yield put(addNumberManualyFailed(error));
  }
}





