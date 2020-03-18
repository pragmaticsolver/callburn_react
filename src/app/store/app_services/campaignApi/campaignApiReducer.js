import { handleActions } from 'redux-actions';

import {
  getApiKeys,
  getApiKeysSucceed,
  getApiKeysFailed,
  createKey,
  createKeySucceed,
  createKeyFailed,
  deleteKey, 
  deleteKeySucceed,
  deleteKeyFailed,
} from './campaignApiActions';

const defaultState = {
    apiKeys: [],
    loading: false,
    error: null,
    createAndDeleteLoading: false,
    message: "",
    success: false
};

const reducer = handleActions({
 
  [getApiKeys](state) {
    return {
      ...state,
     loading: true,
     error: null
    }
  },
  [getApiKeysSucceed](state,{payload:{apiKeys}}) {
    return {
      ...state,
      apiKeys: apiKeys,
     loading: false,
     error: null
    }
  },
  [getApiKeysFailed](state,{payload:{error}}) {
    return {
      ...state,
     apiKeys: [],
     loading: false,
     error: error
    }
  },
  [createKey](state,{payload:{params}}) {
    return {
      ...state,
      error: null,
      createAndDeleteLoading: true,
      message:""
    }
  },
  [createKeySucceed](state,{payload:{succeed}}) {
    return {
      ...state,
      error: null,
      createAndDeleteLoading: false,
      message:"Successfully created!",
      success: true
    }
  },
  [createKeyFailed](state,{payload:{error}}) {
    return {
      ...state,
      error: error,
      createAndDeleteLoading: false,
      message:"Error is occoured",
      success: false
    }
  },
  [deleteKey](state,{payload:{id}}) {
    return {
      ...state,
      error: null,
      createAndDeleteLoading: true,
      message:""
    }
  },
  [deleteKeySucceed](state,{payload:{succeed}}) {
    return {
      ...state,
      error: null,
      createAndDeleteLoading: false,
      message:"Successfully deleted!",
      success: true
    }
  },
  [deleteKeyFailed](state,{payload:{error}}) {
    return {
      ...state,
      error: error,
      createAndDeleteLoading: false,
      message:"Error is occoured",
      success: false
    }
  },
  
}, defaultState);

export default reducer;