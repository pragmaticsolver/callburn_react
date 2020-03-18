import { wrapRequest, xapi } from '../utils';
const getGroups = wrapRequest(async params =>
  xapi().get('/address-book/index-groups', {
    params
  })
);
const getAllGroups = wrapRequest(async ()=>
  xapi().get('address-book/all-groups')
);
const getContacts = wrapRequest(async params =>
  xapi().get('/address-book/index-contacts', {
    params
  })
);
const getBlackList = wrapRequest(async params =>
  xapi().get('/address-book/index-black-list', {
    params
  })
);
const addNumberToBlackList = wrapRequest(async params =>
  xapi().post('/address-book/add-black-list',params)
);
const removeNumberFromBlackList = wrapRequest(async params =>
  xapi().post('/address-book/remove-black-list', 
    params
  )
);
const removeGroup = wrapRequest(async params =>
  xapi().delete('/address-book/remove-groups', {
    params
  })
);
const mergeGroup = wrapRequest(async params =>
  xapi().post('/address-book/merge-groups', params)
);
const uploadNumbersFirst = wrapRequest(async params =>
  xapi().post('/phonenumbers/upload-phonenumbers-first-step', params)
);
const phoneNumberText = wrapRequest(async params =>
  xapi().post('/phonenumbers/text-phonenumbers', params)
);

const validateNumbers = wrapRequest(async params =>
  xapi().post('/phonenumbers/validate-phone-numbers', params)
);
const uploadPhoneNumbers = wrapRequest(async params =>
  xapi().post('/phonenumbers/upload-phonenumbers', params)
);

export {
  getGroups,
  getAllGroups,
  getContacts,
  getBlackList,
  addNumberToBlackList,
  removeNumberFromBlackList,
  removeGroup,
  mergeGroup,
  uploadNumbersFirst,
  phoneNumberText,
  validateNumbers,
  uploadPhoneNumbers
};