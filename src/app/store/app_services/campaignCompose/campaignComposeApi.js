import { wrapRequest, xapi} from '../utils';
const audioFileUpload = wrapRequest(async params =>
        xapi().post('/campaigns/upload-audio-file', params)
);
const getTemplateFiles = wrapRequest(async () =>
    xapi().get('/audio-files/audio-templates?page=0')
);
const calculateCost = wrapRequest(async (params) =>
    xapi().post('/phonenumbers/add-numbers-and-calculate-cost-groups', params)
);
const saveCampaign = wrapRequest(async (params) =>
    xapi().post('/campaigns/create-campaign', params)
);
//manualInput;
//params
//  all_contacts: false
//  data: ["+34679914155"]
//  file_id: 1386
//  is_campaign_create: true
//  sms_text: "uloyl"
//  type: "VOICE_WITH_SMS"
const manualInput = wrapRequest(async (params) =>
    xapi().post('/phonenumbers/add-numbers-and-calculate-cost-manually', params)
);
const sendVerificationCode = wrapRequest(async (params) =>
    xapi().post("/verifications/send-verification-code", params)
);
const addCallerId = wrapRequest(async (params) =>
    xapi().post('/users/add-caller-id', params)
);
export {
    audioFileUpload,
    getTemplateFiles,
    calculateCost,
    saveCampaign,
    manualInput,
    sendVerificationCode,
    addCallerId
};