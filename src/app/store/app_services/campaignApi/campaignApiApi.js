import { wrapRequest, xapi} from '../utils';
const getApiKeys = wrapRequest(async () =>
        xapi().get('api-keys/api-keys')
);
const createKey = wrapRequest(async (params) =>
        xapi().post('api-keys/create-api-key', params)
);
const deleteKey = wrapRequest(async (id) =>
        xapi().delete(`api-keys/remove-api-key/${id}`)
);
export {
    getApiKeys,
    createKey,
    deleteKey
};