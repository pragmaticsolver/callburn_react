import { handleActions } from 'redux-actions';

import {
  clearGroup,
  getPhoneGroup,
  getPhoneGroupSucceed,
  getPhoneGroupFailed,
  removeGroup,
  removeGroupSucceed,
  removeGroupFailed,
  getContacts,
  getContactsSucceed,
  getContactsFailed,
  getCampaignPhoneNumbers,
  getCampaignPhoneNumbersSucceed,
  getCampaignPhoneNumbersFailed,
  getBlackList,
  getBlackListSucceed,
  getBlackListFailed,
  clearContacts,
  addNumberToBlackList,
  addNumberToBlackListSucceed,
  addNumberToBlackListFailed,
  removeNumberFromBlackList,
  removeNumberFromBlackListSucceed,
  removeNumberFromBlackListFailed,
  mergeGroup,
  mergeGroupSucceed,
  mergeGroupFailed,
} from './phoneBookAction';

const defaultState = {
  allContactsCount: 0,
  //phoneGroup
  groups: [],
  currentGroupPageIndex: 1,
  allGroupsCount: 0,
  group_loading: false,
  //contact in Group
  contacts:[],
  currentContactPageIndex: 0,
  allContactsOfGroupCount: 0,
  contact_loading: false,
  //campaign-phone-numbers for Statistics view
  campaignPhoneNumbers:[],
  phonenumbers_count: 0,
  total_cost: 0,
  campaignPhoneNumbersLoading: false,
  currentCampaignPhoneNumbersPageIndex: 0,
  interactions:{
    "reply": 0,
    "transfer": 0,
    "callback": 0,
    "blacklist": 0
  },
  //filter-params
  order: "DESC",
  orderField:"updated_at",
  //info-params
  error: null,
  message: '',
  success: false,
  //black-lists
  blackListData: [],
  blackListLoading: false,
  //add - remove number to black list
  addBlackLoading: false,
  addBlackSuccess: false,
  removeBlackLoading: false,
  removeBlackSuccess: false,
  //remove group
  removeGroupLoading: false,
  removeGroupsucceed: false,
  removeGroupError: null,
  //merge group
  mergeGroupLoading: false,
  mergeGroupSucceed: false,
  mergeGroupError: null,
};

const reducer = handleActions({
  [clearGroup](state) {
    return {
      ...state,
      error: null,
      //phoneGroup
      groups: [],
      currentGroupPageIndex: 0,
      allGroupsCount: 0,
      group_loading: false,
    }
  },
  [getPhoneGroup](state) {
    return {
      ...state,
      error: null,
      group_loading: true,
      message: 'Generating campaigns lists...'
    }
  },
  [getPhoneGroupFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      group_loading: false
    }
  },
  [getPhoneGroupSucceed](state, { payload: { groupData } }) {
    if(state.currentGroupPageIndex == groupData.resource.page - 1)
    {
      var tempGroups = state.groups;
      tempGroups = tempGroups.concat(groupData.resource.groups)
      return {
        ...state,
        group_loading: false,
        groups:tempGroups,
        allGroupsCount: groupData.resource.count,
        currentGroupPageIndex: groupData.resource.page,
        allContactsCount: groupData.resource.allContactsCount
      }
    } else if (groupData.resource.page == 1)
    {
      return {
        ...state,
        group_loading: false,
        groups:groupData.resource.groups,
        allGroupsCount: groupData.resource.count,
        currentGroupPageIndex: 1,
        allContactsCount: groupData.resource.allContactsCount
      }
    }
    
  },
  [removeGroup](state) {
    return {
      ...state,
      removeGroupLoading: true,
      removeGroupsucceed: false,
      removeGroupError: null
    }
  },
  [removeGroupSucceed](state, {payload:{succeed}}) {
    return {
      ...state,
      removeGroupLoading: false,
      removeGroupsucceed: true,
      removeGroupError: null
    }
  },
  [removeGroupFailed](state, {payload:{error}}) {
    return {
      ...state,
      removeGroupLoading: false,
      removeGroupsucceed: false,
      removeGroupError: error
    }
  },
  [mergeGroup](state, {payload:{params}}) {
    return {
      ...state,
      mergeGroupLoading: true,
      mergeGroupSucceed: false,
      mergeGroupError: null
    }
  },
  [mergeGroupSucceed](state, {payload:{succeed}}) {
    return {
      ...state,
      mergeGroupLoading: false,
      mergeGroupSucceed: true,
      mergeGroupError: null
    }
  },
  [mergeGroupFailed](state, {payload:{error}}) {
    return {
      ...state,
      mergeGroupLoading: false,
      mergeGroupSucceed: false,
      mergeGroupError: error
    }
  },
  [getContacts](state) {
    return {
      ...state,
      error: null,
      contact_loading: true,
      message: 'Generating contacts lists...'
    }
  },
  [getContactsFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      contact_loading: false
    }
  },
  [getContactsSucceed](state, { payload: { contactsData } }) {
    var tempContacts = state.contacts;
    tempContacts = tempContacts.concat(contactsData.resource.contacts)
    return {
      ...state,
      contact_loading: false,
      contacts:tempContacts,
      allContactsOfGroupCount: contactsData.resource.allContactsOfGroupCount,
      currentContactPageIndex: state.currentContactPageIndex + 1
    }
  },
  [clearContacts](state) {
    return {
      ...state,
      error: null,
      contact_loading: false,
      contacts: [],
      currentContactPageIndex: 0,
      allContactsOfGroupCount: 0
    }
  },
  [getCampaignPhoneNumbers](state) {
    return {
      ...state,
      campaignPhoneNumbersLoading: true,
      error: null
    }
  },
  [getCampaignPhoneNumbersSucceed](state, { payload: { campaignPhoneNumberData } }) {
    var tempC_Pnumbers = state.campaignPhoneNumbers;
    tempC_Pnumbers = tempC_Pnumbers.concat(campaignPhoneNumberData.resource.phonenumbers)
    return {
      ...state,
      contact_loading: false,
      campaignPhoneNumbers:tempC_Pnumbers,
      phonenumbers_count: campaignPhoneNumberData.resource.phonenumbers_count,
      currentCampaignPhoneNumbersPageIndex: state.currentCampaignPhoneNumbersPageIndex + 1
    }
  },
  [getBlackList](state, {payload:{params}})
  {
    return {
      ...state,
      blackListLoading: true,
      error: null,
      message:""
    }
  },
  [getBlackListSucceed](state, {payload:{blackListData}})
  {
    return {
      ...state,
      blackListLoading: false,
      blackListData: blackListData,
      message:""
    }
  },
  [getBlackListFailed](state, {payload:{error}})
  {
    return {
      ...state,
      blackListLoading: false,
      error: error,
      message:""
    }
  },
  [addNumberToBlackList](state, {payload:{params}})
  {
    return {
      ...state,
      addBlackLoading: true,
      addBlackSuccess: false,
    }
  },
  [addNumberToBlackListSucceed](state, {payload:{succeed}})
  {
    return {
      ...state,
      addBlackLoading: false,
      addBlackSuccess: true,
    }
  },
  [addNumberToBlackListFailed](state, {payload:{error}})
  {
    return {
      ...state,
      addBlackLoading: false,
      addBlackSuccess: false,
      error: error
    }
  },
  [removeNumberFromBlackList](state, {payload:{params}})
  {
    return {
      ...state,
      removeBlackLoading: true,
      removeBlackSuccess: false,
    }
  },
  [removeNumberFromBlackListSucceed](state, {payload:{succeed}})
  {
    return {
      ...state,
      removeBlackLoading: false,
      removeBlackSuccess: true,
    }
  },
}, defaultState);

export default reducer;