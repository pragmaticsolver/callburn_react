import React from 'react';

//import custom components;
import ModalWrapper from '../ModalWrapper';
import ScheduleModalForm from './scheduleModal';
import Trans from '../../../utils/Trans';
//import style

class ScheduleModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "modals_camping_batch_schedulation_modal_voice_message_schedule"/>)}
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        okText = {(<Trans id = "button_add"/>)}
        toggle = {null}
        width = "1000px" 
        cancelButtonShow = {false}
        okButtonShow = {false}
        footerView = {false}
      >
        <ScheduleModalForm/>
     </ModalWrapper>
    );
  }
}

export default ScheduleModal;
