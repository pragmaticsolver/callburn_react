import { handleActions } from 'redux-actions';

import {
  clearCampaigns,
  setCampaigns,
  getCampaigns,
  getCampaignsSucceed,
  getCampaignsFailed,
  getCampaignById,
  getCampaignByIdSucceed,
  getCampaignByIdFailed,
  getCampaignsTotalCount,
  getCampaignsTotalCountSucceed,
  getCampaignsTotalCountFailed,
  deleteCampaign,
  deleteCampaignSucceed,
  deleteCampaignFailed,
  updateCampaign,
  updateCampaignSucceed,
  updateCampaignFailed,
  updateCampaignStatus,
  updateCampaignStatusSucceed,
  updateCampaignStatusFailed,
  setFilterByStatus,
  setFilterByCreationDate,
  setFilterByMessageType,
  setOrderField,
  setOrder,
  addComment,
  addCommentFailed,
  addCommentSucceed,
  getRetry,
  getRetrySucceed,
  getRetryFailed,
  createGroupForUndelivered,
  createGroupForUndeliveredSucceed,
  createGroupForUndeliveredFailed,
} from './campaignAction';

const defaultState = {
  firstGetting: false,
  campaigns: [],
  currentPageIndex: 1,
  totalCampaignCount: 0,
  filterByStatus: new Set(),
  filterByCreationDate:null,
  filterByMessageType: null,
  order: "DESC",
  orderField:"updated_at",
  error: null,
  loading: false,
  message: '',
  success: false,
   //editing campaign part--------
   editingCampaign: null,
   editingCampaignLoading: false,
   editingCampaignError: null,
   //-----------------------------
   deleteCampaignLoading: false,
   //-----------------------------
   updatingCampaignStatusLoading: false,
   //-----------------------------
   addCommentLoading: false,
   addCommentSuccess: false,
   //----Get Retry----
   retryDataLoading: false,
   retryData: null,
   retryError: null,
   retryCampaign: null,
   //----Create Group for Undelivered---
   creatingGroupForUndeliveredLoading: false,
   groupIdOfUndelivered: null,
   creatingGroupForUndeliveredError: null
};

const reducer = handleActions({
  [clearCampaigns](state) {
    return {
      ...state,
      firstGetting: false,
      campaigns: [],
      currentPageIndex: 0,
      totalCampaignCount: 0,
      filterByStatus: new Set(),
      filterByCreationDate:null,
      filterByMessageType: null,
      order: "DESC",
      orderField:"updated_at",
      error: null,
      // loading: false,
      message: '',
      success: false,
      //editing campaign part--------
      editingCampaign: null,
      editingCampaignLoading: false,
      editingCampaignError: null,
      //-----------------------------
      //----Get Retry----
      retryDataLoading: false,
      retryData: null,
      retryError: null,
      retryCampaign: null,
      //----Create Group for Undelivered---
      creatingGroupForUndeliveredLoading: false,
      creatingGroupForUndeliveredSucceed: false,
      creatingGroupForUndeliveredError: null
    }
  },
  [setCampaigns](state, {payload: {campaigns}}) {
    return {
      ...state,
       campaigns: campaigns
    }
  },
  [getCampaigns](state) {
      return {
        ...state,
        firstGetting: true,
        error: null,
        loading: true,
        message: 'Generating campaigns lists...'
      }
  },
  [getCampaignsFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      loading: false
    }
  },
  [getCampaignsSucceed](state, { payload: { campaigns } }) {
    if (campaigns.resource.page == 1) 
    {
      return {
        ...state,
        loading: false,
        campaigns:campaigns.resource.campaigns,
        totalCampaignCount: campaigns.resource.campaigns_count,
        currentPageIndex: 1
      }
    } else {
      var tempCampaigns = state.campaigns;
      tempCampaigns = tempCampaigns.concat(campaigns.resource.campaigns)
      return {
        ...state,
        loading: false,
        campaigns:tempCampaigns,
        totalCampaignCount: campaigns.resource.campaigns_count,
        currentPageIndex: campaigns.resource.page + 1
      }
    }
  },
  [getCampaignById](state) {
    return {
      ...state,
      editingCampaignLoading: true,
      editingCampaignError: null,
    }
  },
  [getCampaignByIdFailed](state, { payload: { error } }) {
    return {
      ...state,
      editingCampaignError: error,
      editingCampaignLoading : false,
      editingCampaign: null
    }
  },
  [getCampaignByIdSucceed](state, { payload: { campaign } }) {
    return {
      ...state,
      editingCampaignError: null,
      editingCampaignLoading : false,
      editingCampaign: campaign
    }
  },
  [getCampaignsTotalCount](state) {
    return {
      ...state,
    }
  },
  [getCampaignsTotalCountSucceed](state, { payload: { totalCampaignCount } }) {
    return {
      ...state,
      totalCampaignCount:totalCampaignCount
    }
  },
  [getCampaignsTotalCountFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
    }
  },
  [deleteCampaign](state) {
    return {
      ...state,
      success: false,
      deleteCampaignLoading: true,
      message: ""
    }
  },
  [deleteCampaignSucceed](state) {
    return {
      ...state,
      success: true,
      deleteCampaignLoading: false,
      message: "Campaign deleted successfully!"
    }
  },
  [deleteCampaignFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      deleteCampaignLoading: false,
      success: false
    }
  },
  [updateCampaign](state) {
    return {
      ...state,
      success: false,
      loading: true,
      message: ""
    }
  },
  [updateCampaignSucceed](state) {
    return {
      ...state,
      success: true,
      loading: false,
      message: "Campaign updated successfully!"
    }
  },
  [updateCampaignStatus](state,{payload:{params}}) {
    return {
      ...state,
      updatingCampaignStatusLoading: true,
      error:null,
      message: ""
    }
  },
  [updateCampaignStatusFailed](state,{payload:{error}}) {
    return {
      ...state,
      updatingCampaignStatusLoading: true,
      error:error,
      message: ""
    }
  },
  [updateCampaignStatusSucceed](state,{payload:{succeed}}) {
    return {
      ...state,
      updatingCampaignStatusLoading: false,
      error:null,
      success: succeed,
      message: "Campaign Status updated successfully!"
    }
  },
  [setFilterByStatus](state, { payload: { filterByStatus } }) {
    return {
      ...state,
      filterByStatus:new Set(filterByStatus),
      campaigns: [],
      currentPageIndex: 0
    }
  },
  [setFilterByCreationDate](state, { payload: { filterByCreationDate } }) {
    return {
      ...state,
      filterByCreationDate: filterByCreationDate,
      campaigns: [],
      currentPageIndex: 0
    }
  },
  [setFilterByMessageType](state, { payload: { filterByMessageType } }) {
    return {
      ...state,
      filterByMessageType: filterByMessageType,
      campaigns: [],
      currentPageIndex: 0
    }
  },
  [setOrderField](state, { payload: { orderField } }) {
    return {
      ...state,
      orderField: orderField,
      campaigns: [],
      currentPageIndex: 0
    }
  },
  [setOrder](state, { payload: { order } }) {
    return {
      ...state,
      order: order,
      campaigns: [],
      currentPageIndex: 0
    }
  },
  [addComment](state) {
    return {
      ...state,
      addCommentLoading: true,
      addCommentSuccess: false,
    }
  },
  [addCommentSucceed](state,{payload:{succeed}}) {
    return {
      ...state,
      addCommentLoading: false,
      addCommentSuccess: true,
    }
  },
  [getRetry](state,{payload:{campaign}}) {
    return {
      ...state,
      retryDataLoading: true,
      retryError: null,
      retryCampaign: campaign
    }
  },
  [getRetrySucceed](state,{payload:{retryData}}) {
    return {
      ...state,
      retryDataLoading: false,
      retryError: null,
      retryData: retryData
    }
  },
  [getRetryFailed](state,{payload:{error}}) {
    return {
      ...state,
      retryDataLoading: false,
      retryError: error,
      retryData: null
    }
  },
  [createGroupForUndelivered](state,{payload:{params}}) {
    return {
      ...state,
      creatingGroupForUndeliveredLoading: true,
      groupIdOfUndelivered: null,
      creatingGroupForUndeliveredError: null
    }
  },
  [createGroupForUndeliveredSucceed](state,{payload:{group_id}}) {
    return {
      ...state,
      creatingGroupForUndeliveredLoading: false,
      groupIdOfUndelivered: group_id,
      creatingGroupForUndeliveredError: null
    }
  },
  [createGroupForUndeliveredFailed](state,{payload:{error}}) {
    return {
      ...state,
      creatingGroupForUndeliveredLoading: false,
      groupIdOfUndelivered: null,
      creatingGroupForUndeliveredError: error
    }
  },
}, defaultState);

export default reducer;