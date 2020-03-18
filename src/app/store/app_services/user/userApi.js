import { wrapRequest, xapi } from '../utils';
const getUser = wrapRequest(async () =>
  xapi().get('/users/show-user')
);
const getBillings = wrapRequest(async (params) =>
  xapi().get('/billings/billings', {params})
);
const getInvoices = wrapRequest(async (params) =>
  xapi().get('/billings/invoices', {params})
);
const downloadToken = wrapRequest(async () =>
  xapi().get('/data/download-token')
);
const invoiceDownload = wrapRequest(async (params) =>
  xapi().get('/billings/download-invoice', {params})
);
const getOrders = wrapRequest(async () =>
   xapi().get('/billings/orders')
);
const getTaxData = wrapRequest(async () =>
   xapi().get('/data/tax-data')
);
const checkVatId = wrapRequest(async (params) =>
   xapi().post('/billings/check-vat-id', params)
);
const checkOrdersData = wrapRequest(async () =>
   xapi().get('/billings/orders')
);
const checkCoupon = wrapRequest(async (params) =>
   xapi().post('/billings/check-coupon-code', params)
);
const updateMainData = wrapRequest(async (params) =>
  xapi().post('/users/update-main-data', params)
);
const selectCard = wrapRequest(async (params) =>
  xapi().post('/stripe/make-card-default', params)
);
const payByCard = wrapRequest(async (params) =>
  xapi().post('/stripe/make-payment', params)
);
const payByPaypal = wrapRequest(async (params) =>
  xapi().post('/billings/pay-by-paypal', params)
);
const createCard = wrapRequest(async (params) =>
  xapi().post('/stripe/create-card', params)
);
const removeCard = wrapRequest(async (id) =>
  xapi().delete(`/stripe/remove-card/${id}`)
);
const removeOrder = wrapRequest(async (id) =>
  xapi().delete(`/billings/remove-order/${id}`)
);
const createBankOrder = wrapRequest(async (params) =>
  xapi().post('/billings/create-bank-order', params)
)
const logOut = wrapRequest(async ()=>
  xapi().get('auth/logout')
);
export {
  getUser,
  getBillings,
  getInvoices,
  downloadToken,
  invoiceDownload,
  getOrders,
  checkVatId,
  checkOrdersData,
  checkCoupon,
  getTaxData,
  updateMainData,
  selectCard,
  payByCard,
  createCard,
  removeCard,
  removeOrder,
  payByPaypal,
  createBankOrder,
  logOut
};