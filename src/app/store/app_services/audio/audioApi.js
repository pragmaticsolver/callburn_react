import { wrapRequest, xapi} from '../utils';
const getUrl = wrapRequest(async audio_id =>
        xapi().get(`/audio-files/amazon-url-of-audio/${audio_id}`)
);

export {
    getUrl
};