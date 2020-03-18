import { handleActions } from 'redux-actions';

import {
    clearComposeData,
    initComposeData,
    //set params---------
    setMessageType,
    setFileId,
    setMessageContent,
    setAllContacts,
    setRecipientsData,
    setShuffle,
    setEmailNotify,
    setCampaignName,
    setPlaybackCount,
    setCallback,
    setReplay,
    setBlock,
    setTransfer,
    setSenderName,
    setCallerId,
    //--------------------
    audioFileUpload,
    audioFileUploadSucceed,
    audioFileUploadFailed,
    callbackVoiceFileUpload,
    callbackVoiceFileUploadSucceed,
    callbackVoiceFileUploadFailed,
    setCallbackFileId,
    blockVoiceFileUpload,
    blockVoiceFileUploadSucceed,
    blockVoiceFileUploadFailed,
    setBlockFileId,
    getTemplateFiles,
    getTemplateFilesSucceed,
    getTemplateFilesFailed,
    calculateCost,
    calculateCostSucceed,
    calculateCostFailed,
    addNumberManualy,
    addNumberManualySucceed,
    addNumberManualyFailed,
    saveCampaign,
    saveCampaignSucceed,
    saveCampaignFailed
} from './campaignComposeAction';

const defaultState = {
  error: null,

  messageType: "",
  file_id: null,
  audioFileName: "",
  message_content:"",
  senderName: "Callburn",
  callerId : "",
  //audioFile;
  audioFileUploadLoading: false,
  audio: "",
  callbackFileUploadLoading: false,
  callbackAudio: "",
  blockFileUploadLoading: false,
  blockAudio: "",
  //--------------------
  //template audio files
  template_files: [],
  getTemplateLoading: false,
  //recipients data
  recipients_data: {},  /// data: {all: true, 2123: true}...
  recipients_text: "", 
  
  all_contacts: false,
  //cost data
  calculateCostLoading: false,
  max_cost: null,
  max_cost_with_sms: null,
  max_gift_cost:null,
  recipients_count: null,
  sending_time: null,
  sms_not_supported: null,
  //save
  saveLoading: false,
  campaign_name: null,
  currentTab: "groups",
  get_email_notifications: false,
  //--------------------------------
  is_callback_active: false,
  callback_digit: null,
  callback_voice_file_id: null,
  
  is_donotcall_active: false,
  do_not_call_digit: null,
  do_not_call_voice_file_id: null,

  is_replay_active: false,
  replay_digit: null,

  is_transfer_active: false,
  transfer_digit: null,
  live_transfer_limit: "unlimited",
  transfer_options: [], //testing
  //--------------------------------
  phonenumbers: [],
  phonenumbers_status: [],
  playback_count: 1,
  remaining_repeats: 0,
  repeat_days_interval: 0,
  repeats_count: 0,
  same_sms_text: false,
  schedulations: null,
  should_shuffle: false,
  status: "",
  ///Edit part-------;
  isEdit: false,
  campaign_id: null,
  //------------------
  manualinputLoading: false,
};

const reducer = handleActions({
  [clearComposeData](state) {
    return {
      ...state,
      error: null,
      messageType: "",
      senderName: "Callburn",
      file_id: null,
      audioFileName: "",
      message_content: "",
      audioFileUploadLoading: false,
      audio:"",
      callbackFileUploadLoading: false,
      callbackAudio: "",
      blockFileUploadLoading: false,
      blockAudio: "",
      template_files:[],
      getTemplateLoading: false,
      recipients_data: {}, 
      recipients_text: "", 
      all_contacts: false,
      //cost data
      calculateCostLoading: false,
      max_cost: null,
      max_cost_with_sms: null,
      max_gift_cost:null,
      recipients_count: null,
      sending_time: null,
      sms_not_supported: null,
      saveLoading: false,
      campaign_name: null,
      currentTab: "groups",
      get_email_notifications: false,
      is_callback_active: false,
      callback_digit: null,
      callback_voice_file_id: null,
      is_donotcall_active: false,
      do_not_call_digit: null,
      do_not_call_voice_file_id: null,
      is_replay_active: false,
      replay_digit: null,
      is_transfer_active: false,
      transfer_digit: null,
      live_transfer_limit: "unlimited",
      transfer_options: "390292800925", //testing
      phonenumbers: [],
      phonenumbers_status: [],
      playback_count: 1,
      remaining_repeats: 0,
      repeat_days_interval: 0,
      repeats_count: 0,
      same_sms_text: false,
      schedulations: null,
      should_shuffle: false,
      status: "",
      ///Edit part-------;
      isEdit: false,
      campaign_id: null,
      //------------------
    }
  },
  [initComposeData](state, {payload:{params}}) {
    var groups = {};
    // var recipientsN = 0;
    var groupNames = "";
    params.groups.map((group, index) => {
      groups[group._id] = true;
      // recipientsN = recipientsN + group.contact_count[0].count;
      if (group.type === "CREATED_ON_RETRY_UNDELIVERED") {

        groupNames += "Undelivered contacts of " + group.name;
      }
      groupNames += group.name ;
      if(params.groups.count > index + 1 ) groupNames += ","
    })

    var name = "";
    if (params.voice_file && params.voice_file.type === "TTS") {
      name = params.voice_file.tts_text.substring(0,25);
    } else if (params.voice_file && params.voice_file.type === "UPLOADED") {
      name = params.voice_file.orig_filename;
    }
    return {
      ...state,
      error: null,
      messageType: params.type,
      callerId: params.callerId ? params.callerId : state.callerId,
      senderName: params.sender_name ? params.sender_name : state.senderName,
      file_id:  params.campaign_voice_file_id,
      audioFileName: name,
      message_content: params.sms_text,
      audioFileUploadLoading: false,
      audio:"",
      callbackFileUploadLoading: false,
      callbackAudio: "",
      blockFileUploadLoading: false,
      blockAudio: "",
      // template_files:[],
      getTemplateLoading: false,
      recipients_data: groups,  
      recipients_text:  groupNames,
      all_contacts: false,
      //cost data
      calculateCostLoading: false,
      max_cost: null,
      max_cost_with_sms: null,
      max_gift_cost:null,
      recipients_count: params.totalRecipientsIfGroups,
      sending_time: null,
      sms_not_supported: null,
      saveLoading: false,
      campaign_name: params.campaign_name,
      currentTab: "groups",
      get_email_notifications: false, //
      is_callback_active: params.callback_digit ? true : false,
      callback_digit: params.callback_digit,
      callback_voice_file_id: null,
      is_donotcall_active: params.do_not_call_digit ? true : false,
      do_not_call_digit: params.do_not_call_digit,
      do_not_call_voice_file_id: null,
      is_replay_active: false,
      replay_digit: null,
      is_transfer_active: params.transfer_digit?true:false,
      transfer_digit: params.transfer_digit,
      live_transfer_limit: "unlimited",
      transfer_options: "390292800925", //testing
      phonenumbers: [],
      phonenumbers_status:[],
      playback_count:  params.playback_count,
      remaining_repeats: 0,
      repeat_days_interval: 0,
      repeats_count: 0,
      same_sms_text: false,
      schedulations: JSON.parse(params.schedulation_original_data),
      should_shuffle: false,
      status: params.status,
      isEdit: true,
      campaign_id: params._id,
    }
  },
  [setMessageType](state, {payload:{type}}) {
    return {
      ...state,
      messageType: type
    }
  },
  [setFileId](state, {payload:{id, name}}) {
    return {
      ...state,
      file_id: id,
      audioFileName: name
    }
  },
  [setMessageContent](state, {payload:{content}}) {
    return {
      ...state,
      message_content: content
    }
  },
  [setAllContacts](state, {payload:{all}}) {
    return {
      ...state,
      all_contacts: all
    }
  },
  [setRecipientsData](state, {payload:{data, recipients_text}}) {
    return {
      ...state,
      recipients_data: data,
      recipients_text: recipients_text
    }
  },
  [setShuffle](state, {payload:{should_shuffle}}) {
    return {
      ...state,
      should_shuffle: should_shuffle
    }
  },
  [setEmailNotify](state, {payload:{get_email_notifications}}) {
    return {
      ...state,
      get_email_notifications: get_email_notifications
    }
  },
  [setPlaybackCount](state, {payload:{playback_count}}) {
    return {
      ...state,
      playback_count: playback_count
    }
  },
  [setCampaignName](state, {payload:{campaign_name}}) {
    return {
      ...state,
      campaign_name: campaign_name
    }
  },
  [setSenderName](state, {payload:{senderName}}) {
    return {
      ...state,
      senderName: senderName
    }
  },
  [setCallerId](state, {payload:{callerId}}) {
    return {
      ...state,
      callerId: callerId
    }
  },
  [setCallback](state, {payload:{params}}) {
    if(params.flag == true)
    {
      return {
        ...state,
       is_callback_active: true,
       callback_digit: params.digit ? params.digit : state.callback_digit,
       callback_voice_file_id: params.callback_voice_file_id ? params.callback_voice_file_id : state.callback_voice_file_id
      }
    } else {
      return {
        ...state,
        is_callback_active: false,
        callback_digit: null,
        callback_voice_file_id: null
      }
    }
  },
  [setReplay](state, {payload:{params}}) {
    if(params.flag == true)
    {
      return {
        ...state,
       is_replay_active: true,
       replay_digit: params.digit
      }
    } else {
      return {
        ...state,
        is_replay_active: false,
        replay_digit: null
      }
    }
  },
  [setBlock](state, {payload:{params}}) {
    if(params.flag == true)
    {
      return {
        ...state,
       is_donotcall_active: true,
       do_not_call_digit: params.digit ? params.digit : state.do_not_call_digit,
       do_not_call_voice_file_id: params.do_not_call_voice_file_id ? params.do_not_call_voice_file_id : state.do_not_call_voice_file_id
      }
    } else {
      return {
        ...state,
        is_donotcall_active: false,
        do_not_call_digit: null,
        do_not_call_voice_file_id: null
      }
    }
  },
  [setTransfer](state, {payload:{params}}) {
    if(params.flag == true)
    {
      return {
        ...state,
       is_transfer_active: true,
       transfer_digit: params.digit ? params.digit : state.transfer_digit,
       transfer_options: params.transfer_options ? params.transfer_options : state.transfer_options,
       live_transfer_limit: params.live_transfer_limit ? params.live_transfer_limit : state.live_transfer_limit
      }
    } else {
      return {
        ...state,
        is_transfer_active: false,
        transfer_digit: null,
        transfer_options: null,
        live_transfer_limit: "unlimited"
      }
    }
  },
  //audio upload
  [audioFileUpload](state) {
    return {
      ...state,
      error: null,
      audioFileUploadLoading: true
    }
  },
  [audioFileUploadFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      audioFileUploadLoading: false
    }
  },
  [audioFileUploadSucceed](state, { payload: { audio } }) {

    return {
      ...state,
      audioFileUploadLoading: false,
      audio:audio
    }
  },

  [callbackVoiceFileUpload](state) {
    return {
      ...state,
      error: null,
      callbackFileUploadLoading: true
    }
  },
  [callbackVoiceFileUploadFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      callbackFileUploadLoading: false
    }
  },
  [callbackVoiceFileUploadSucceed](state, { payload: { callbackAudio } }) {

    return {
      ...state,
      callbackFileUploadLoading: false,
      callbackAudio: callbackAudio
    }
  },
  [setCallbackFileId](state, {payload:{id}}) {
    return {
      ...state,
      callback_voice_file_id: id
    }
  },
  [blockVoiceFileUpload](state) {
    return {
      ...state,
      error: null,
      blockFileUploadLoading: true
    }
  },
  [blockVoiceFileUploadFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      blockFileUploadLoading: false
    }
  },
  [blockVoiceFileUploadSucceed](state, { payload: { blockAudio } }) {

    return {
      ...state,
      blockFileUploadLoading: false,
      blockAudio: blockAudio
    }
  },
  [setBlockFileId](state, {payload:{id}}) {
    return {
      ...state,
      do_not_call_voice_file_id: id
    }
  },
  //-----------
  //--get template
  [getTemplateFiles](state) {
    return {
      ...state,
      error: null,
      getTemplateLoading: true
    }
  },
  [getTemplateFilesFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      getTemplateLoading: false
    }
  },
  [getTemplateFilesSucceed](state, { payload: { template_files } }) {
    return {
      ...state,
      getTemplateLoading: false,
      template_files:template_files
    }
  },
  //--calculate cost;
  [calculateCost](state) {
    return {
      ...state,
      error: null,
      calculateCostLoading: true
    }
  },
  [calculateCostSucceed](state, { payload: { costData } }) {
    return {
      ...state,
      calculateCostLoading: false,
      max_cost: costData.max_cost,
      max_cost_with_sms:costData.max_cost_with_sms,
      max_gift_cost: costData.max_gift_cost,
      recipients_count: costData.recipients_count,
      sending_time: costData.sending_time,
      sms_not_supported: costData.sms_not_supported
    }
  },
  [calculateCostFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      calculateCostLoading: false
    }
  },
  [addNumberManualy](state, { payload: { params } }) {
    return {
      ...state,
      manualinputLoading: true,
      recipients_data: params.data
    }
  },
  [addNumberManualySucceed](state, { payload: { data } }) {
    return {
      ...state,
      manualinputLoading: false,
      phonenumbers: data.resource.phonenumbers,
      phonenumbers_status: data.resource.statuses,
      max_cost: data.resource.max_cost,
      max_cost_with_sms:data.resource.max_cost_with_sms,
      max_gift_cost: data.resource.max_gift_cost,
      recipients_count:data.resource.phonenumbers.length
    }
  },
  [addNumberManualyFailed](state, { payload: { error } }) {
    return {
      ...state,
      manualinputLoading: false,
    }
  },
  [saveCampaign](state) {
    return {
      ...state,
      error:null,
      succeed: false,
      saveLoading: true
    }
  },
  [saveCampaignSucceed](state, { payload: { succeed } }) {
    return {
      ...state,
      error:null,
      saveLoading: false,
      succeed: true
    }
  },
  [saveCampaignFailed](state, { payload: { error } }) {
    return {
      ...state,
      error,
      succeed: false,
      saveLoading: false,
    }
  },
}, defaultState);

export default reducer;