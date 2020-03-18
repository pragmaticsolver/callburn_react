import { handleActions } from 'redux-actions';

import {
    setAudio,
    setAudioSucceed,
    setAudioFailed,
    playAudio,
    pauseAudio
} from './audioAction';

const defaultState = {
    audio: null,
    audio_id: null,
    url: null,
    isPlaying: false,
    loading:false,
    error: null
};

const reducer = handleActions({
 
  [setAudio](state, { payload: { audio_id } }) {
    return {
      ...state,
      audio: null,
      audio_id: audio_id,
      url: null,
      error: null,
      isPlaying: false,
      loading: true
    }
  },
  [setAudioSucceed](state, { payload: { url } }) {
    return {
      ...state,
      audio: new Audio(url),
      url: url,
      error: null,
      isPlaying: true,
      loading: false,
    }
  },
  [setAudioFailed](state, { payload: { error } }) {
    return {
      ...state,
      audio: null,
      url: null,
      error: error,
      isPlaying: false,
      loading: false,
    }
  },
  [playAudio](state) {
    return {
      ...state,
      isPlaying: true
    }
  },
  [pauseAudio](state) {
    return {
      ...state,
      isPlaying: false
    }
  },
  
}, defaultState);

export default reducer;