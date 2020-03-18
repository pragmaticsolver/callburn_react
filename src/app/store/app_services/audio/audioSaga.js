import { put, takeEvery, call, all } from 'redux-saga/effects';

// Import Actions
import {
    setAudioFailed,
    setAudioSucceed
} from './audioAction';

// Import API
import * as audioApi from './audioApi';

export function* audioSubscriber() {
  yield all([takeEvery('SET_AUDIO', setAudioFun)]);
}

export function* setAudioFun({ payload: { audio_id } }) {
  try {
    const data = yield call(audioApi.getUrl, audio_id);
    if(data.resource.error.no == 0 ) //no error
    {
      yield put(setAudioSucceed(data.resource.amazon_s3_url));
    } else 
    {
      yield put(setAudioFailed(data.resource.error.text));
    }
  } catch (error) {
    yield put(setAudioFailed(error));
  }
}