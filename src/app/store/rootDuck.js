import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import { metronic } from "../../_metronic";
import ModalReducer from "../pages/home/modals/modalConductorReducer";
import CampaignReducer from "./app_services/campaign/campaignReducer";
import ComposeReducer from './app_services/campaignCompose/campaignComposeReducer';
import ApiReducer from './app_services/campaignApi/campaignApiReducer';
import PhoneBookReducer from './app_services/phoneBook/phoneBookReducer';
import UserReducer from './app_services/user/userReducer';
import AudioReducer from './app_services/audio/audioReducer';
//
import { reducer as toastrReducer } from "react-redux-toastr";
export const rootReducer = combineReducers({
  auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  modal: ModalReducer,
  user: UserReducer,
  campaign: CampaignReducer,
  compose: ComposeReducer,
  phoneBook: PhoneBookReducer,
  api: ApiReducer,
  audio: AudioReducer,
  //
  toastr: toastrReducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
