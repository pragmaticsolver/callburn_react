import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {pauseAudio} from '../../../store/app_services/audio/audioAction';
class AudioPlayer extends React.Component{
    componentDidUpdate(prevProps)
    {
        if(prevProps.isPlaying !== this.props.isPlaying)
        {
            if(this.props.isPlaying === true )
            {
               if( this.props.audio !== null) 
               {
                   this.props.audio.play();
                   this.props.audio.onended = () => {
                        this.props.audioActions.pauseAudio();
                   }
               }
            } else {
               if( this.props.audio !== null) this.props.audio.pause();
            }
        }
    }
    render(){
        return(
            <React.Fragment>

            </React.Fragment>
        )
    }
}
export default connect(
    state => ({
        audio: state.audio.audio,
        isPlaying: state.audio.isPlaying
    }),
    dispatch => ({
        audioActions: bindActionCreators({ pauseAudio }, dispatch)
    })
  )(AudioPlayer);
  