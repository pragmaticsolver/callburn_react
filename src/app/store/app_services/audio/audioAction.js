import { createActions } from 'redux-actions';

const {
  setAudio,
  setAudioSucceed,
  setAudioFailed,
  playAudio,
  pauseAudio
} = createActions({
 SET_AUDIO: (audio_id) => ({audio_id}),
 SET_AUDIO_SUCCEED: (url) => ({url}),
 SET_AUDIO_FAILED: (error) => ({error}),
 PLAY_AUDIO: () => ({}),
 PAUSE_AUDIO :() => ({})
});

export {
    setAudio,
    setAudioSucceed,
    setAudioFailed,
    playAudio,
    pauseAudio
};
