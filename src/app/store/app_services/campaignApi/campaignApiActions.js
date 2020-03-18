import { createActions } from 'redux-actions';

const {
  getApiKeys,
  getApiKeysSucceed,
  getApiKeysFailed,
  createKey,
  createKeySucceed,
  createKeyFailed,
  deleteKey, 
  deleteKeySucceed,
  deleteKeyFailed,
} = createActions({
  GET_API_KEYS: () => ({}),
  GET_API_KEYS_SUCCEED: (apiKeys) => ({apiKeys}),
  GET_API_KEYS_FAILED: (error) => ({error}),
  CREATE_KEY: (params) => ({params}),
  CREATE_KEY_SUCCEED: (succeed) => ({succeed}),
  CREATE_KEY_FAILED: (error) => ({error}),
  DELETE_KEY: (id) => ({id}),
  DELETE_KEY_SUCCEED: (succeed) => ({succeed}),
  DELETE_KEY_FAILED: (error) => ({error})
});

export {
    getApiKeys,
    getApiKeysSucceed,
    getApiKeysFailed,
    createKey,
    createKeySucceed,
    createKeyFailed,
    deleteKey, 
    deleteKeySucceed,
    deleteKeyFailed,
};
