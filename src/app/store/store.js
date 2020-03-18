import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";

import { rootReducer, rootSaga } from "./rootDuck";
import {campaignSubscriber} from './app_services/campaign/campaignSaga';
import { composeSubscriber } from './app_services/campaignCompose/campaignCompseSaga';
import {phoneBookSubscriber} from './app_services/phoneBook/phoneBookSaga';
import {apiSubscriber} from './app_services/campaignApi/campaignApiSaga';
import {userSubscriber} from './app_services/user/userSaga';
import {audioSubscriber} from './app_services/audio/audioSaga';
//
import logger from 'redux-logger';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
sagaMiddleware.run(campaignSubscriber);
sagaMiddleware.run(composeSubscriber);
sagaMiddleware.run(phoneBookSubscriber);
sagaMiddleware.run(apiSubscriber);
sagaMiddleware.run(userSubscriber);
sagaMiddleware.run(audioSubscriber);

export default store;
