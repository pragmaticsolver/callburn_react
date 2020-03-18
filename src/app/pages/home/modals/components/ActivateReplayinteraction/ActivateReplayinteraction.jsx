import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import custom components;
import ModalWrapper from '../ModalWrapper';
import Numpad from '../Numpad/Numpad';
//import style
import './ActivateReplayinteraction.scss';
//import actions
import { setReplay } from '../../../../../store/app_services/campaignCompose/campaignComposeAction';
import { hideModal } from '../../modalConductorActions';
import Trans from '../../../utils/Trans';
class ActivateReplayinteraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_confirm: false
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event) =>{
    this.setState({
      check_confirm: event.target.checked
    })
  }
  render() {
    return (
      <ModalWrapper
        title={(<Trans id = "button_activate_replay_voice_message"/>)}
        okText={(<Trans id = "button_activate_replay_voice_message"/>)}
        toggle = {false} 
        onOk={() => {
           if(this.props.replay_digit == null || this.state.check_confirm == false) return;
           else this.props.modalAction.hideModal();
        }}
        cancelText={(<Trans id = "batch_show_repiteation_count_confirm_cancel"/>)}
        onCancel = {()=>{
          this.props.composeActions.setReplay({flag:false, digit:null});
        }}
        width = "700px"
      >
        <div className = "body-area">
            <div className = "main-section">
              <div className = "intro">
                  <h4><Trans id = "modals_camping_batch_activate_callback_how_it_works"/>?</h4>
                  <p style = {{textAlign:"justify"}}>
                        <Trans id = "replay_interaction_modal_text_for_example"/>
                  </p>
              </div>
              <div className = "digit-selector-section">
                  <Numpad title = {(<Trans id = "modals_camping_batch_dijit_choosen_select_a_digit"/>)}  interactionDigitName = "replyInteractionDigit"/>
              </div>
            </div>
            <div className = {this.state.check_confirm?"comfirm-section checked":"comfirm-section"}>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.check_confirm}
                          onChange={this.handleChange}
                          value="checkedB"
                          color="primary"
                        />
                      }
                      label = {(<Trans id = "check_container_text1"/>)}
                  />
            </div>
     
        </div>
          </ModalWrapper>
    );
  }
}

export default connect(
  state => ({
    replay_digit: state.compose.replay_digit,
  }),
  dispatch => ({
    composeActions: bindActionCreators({ setReplay }, dispatch),
    modalAction: bindActionCreators({ hideModal }, dispatch)
  })
)(ActivateReplayinteraction);

