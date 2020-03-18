import React from 'react';
import { connect } from 'react-redux';

// Import Interaction Modals
import ActivateReplayinteraction from './components/ActivateReplayinteraction/ActivateReplayinteraction';
import LiveTransferInteractionModal from './components/CallLiveTransfer/CallLiveTransferInteraction';
//phone book modals
import GroupInfoModal from './components/phonebook/showGroupInfo/showGroupInfoModal';
import AddToBlocklistModal from './components/phonebook/addNumberToBlocklist/addNumberToBlocklist';
import CallMeBackInteractionModal from './components/CallMeBack/CallMeBackInteraction';
import BlockListMeModal from './components/BlackListMe/BlockListMe';
//api modals
import AddApiModal from './components/apiForm/addApi/addApiModal';
//account modals
import ActiveCallerIdModal from './components/account/ActiveCallerID/ActiveCallerID';
import AddNewCard from './components/financials/addNewCard/addNewCard';
//schedule modal
import ScheduleModal from './components/schedule';
//add comment modal;
import MakeAndAddCommentModal from './components/makeAndAddComment/makeAndAddComment';
//----------------
import SendAgainModal from './components/sendAgainModal/sendAgainModal';
//--Retry confirm
import RetryConfirmModal from './components/retryConfirmModal/retryConfirmModal';
import ChangeCallerIdModal from './components/ChangeCallerId/changeCallerIdModal';
const ModalConductor = props => {
  switch (props.modal.modalType) {
    case 'ACTIVATE_REPLAY_INTERACTION':
      return <ActivateReplayinteraction {...props} />;
    case 'CALL_LIVE_TRANSFER_INTERACTION':
      return <LiveTransferInteractionModal {...props}/>;
    case 'CALL_ME_BACK':
      return <CallMeBackInteractionModal {...props} />
    case 'BLOCK_LIST_ME':
      return <BlockListMeModal {...props} />
    case 'PHONE_GROUP_INFO':
      return <GroupInfoModal {...props}/>
    case 'ADD_TO_BLOCKLIST':
      return <AddToBlocklistModal/>
    case 'ADD_API':
      return <AddApiModal/>
    case 'ACTIVE_CALLER_ID':
      return <ActiveCallerIdModal/>
    case 'SCHEDULE_SETTING':
      return <ScheduleModal/>
    case 'MAKE_AND_ADD_COMMENT':
      return <MakeAndAddCommentModal {...props}/>
    case 'SEND_AGAIN':
      return <SendAgainModal {...props}/>
    case 'RETRY_CONFIRM':
      return <RetryConfirmModal/>
    case 'ADD_NEW_CARD':
      return <AddNewCard/>
    case 'CHANGE_CALLER_ID':
      return <ChangeCallerIdModal/>
    default:
      return null;
  }
};

export default connect(
  state => ({
    modal: 
      {...state.modal}
    
  }),
  null
)(ModalConductor);
