import { wrapRequest, xapi } from '../utils';
const getCampaigns = wrapRequest(async params =>
  xapi().get('/campaigns/index-campaigns', {
    params
  })
);
const getOneCampaign = wrapRequest(async id =>
  xapi().get(`/campaigns/show-campaign/${id}`)
);
const deleteCampaign = wrapRequest(async id =>
  xapi().delete(`/campaigns/remove-campaign/${id}`)
);
const getCampaignPhonenumbers = wrapRequest(async params =>
  xapi().post('/phonenumbers/campaign-phonenumbers', params)
);
const updateCampaignStatus = wrapRequest(async params =>
  xapi().post('/campaigns/update-campaign-status', params)
);
const retryUndelivered = wrapRequest(async id =>
  xapi().get(`/retry-undelivered/${id}`)
);
const createGroupForUndelivered = wrapRequest(async params =>
  xapi().post('campaigns/create-group-for-undelivered', params)
);
const addComment = wrapRequest(async params =>
  xapi().post('phonenumbers/add-comment', params)
);
const getRetry = wrapRequest(async id =>
  xapi().get(`campaigns/retry-undelivered/${id}`)
);
export {
    getCampaigns,
    getOneCampaign,
    deleteCampaign,
    getCampaignPhonenumbers,
    updateCampaignStatus,
    retryUndelivered,
    createGroupForUndelivered,
    addComment,
    getRetry
};