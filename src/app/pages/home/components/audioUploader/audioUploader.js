import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dropzone from 'react-dropzone';
import Button from '@material-ui/core/Button';
import {Spinner} from 'react-bootstrap';
import Trans from '../../utils/Trans';
import { setAudio, playAudio, pauseAudio } from '../../../../store/app_services/audio/audioAction';
class Basic extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      files: []
    };
    this.onDrop = this.onDrop.bind(this);
  }
  onDrop = (files) => {
    this.setState({files})
    if(this.props.onLoad)
    {
        var data = new FormData;
        data.append('file', files[0]);
        this.props.onLoad(files[0]);
    }
  };
  renderPlayStopButton = () => {
    if(this.props.audio_id !== this.props.audio._id) return "/media/play.svg";
    else {
         if(this.props.loadingAudio == true)
         {
            return "/media/spinner.svg";
         } else {
            if(this.props.isPlaying == false) return "/media/play.svg";
            else return "/media/stop.svg";
         }
    }
  }
  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));
    return (
      <Dropzone onDrop={this.onDrop} disabled = {this.props.loading?true:false}>
        {({getRootProps, getInputProps}) => (
          <section >
           
            <div {...getRootProps({})}
                style = {{
                  width:"100%",
                  padding:"20px",
                  border:"2px dashed green",
                  borderRadius:"10px",
                  height:"200px",
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                  flexDirection:"column"
                }}
            >
            <aside>
               <p><Trans id = "modals_camping_batch_activate_callback_move_your_mp3"/></p>
            </aside>
              <input {...getInputProps()} />
              <Button variant = "contained" color = "primary" ><Trans id = "modals_camping_batch_activate_callback_choose_file"/></Button>
            </div>
            {
                this.props.audio && this.props.audio.orig_filename && !this.props.loading && (
                  <aside style = {{
                    padding:"10px",
                    marginTop:"5px",
                    border:"1px solid #3190e6",
                    display:"flex",
                  }}>
                    
                    <div style = {{
                      display:"flex",
                      padding:"5px",
                      backgroundColor:"#3190e6",
                      color:"white",
                      flex:"1",
                      justifyContent:"center",
                      alignItems:"center"
                    }}>{this.props.audio.orig_filename}</div>
                    <div style = {{
                      display:"flex",
                      padding:"5px",
                      backgroundColor:"white",
                      justifyContent:"center",
                      alignItems:"center"
                    }}>
                      <img src={this.renderPlayStopButton()} style = {{width:"20px"}} 
                        onClick = {()=>{
                          if(this.props.audio_id !== this.props.audio._id) {
                            if(this.props.isPlaying === true) this.props.audioActions.pauseAudio();
                            this.props.audioActions.setAudio(this.props.audio._id)
                          } else {
                              if(this.props.loadingAudio == true)
                              {
                                  return;
                              } else {
                                  if(this.props.isPlaying == false) {
                                    this.props.audioActions.playAudio();
                                  }
                                  else {
                                    this.props.audioActions.pauseAudio();
                                  }
                              }
                          }
                        }}
                      />
                    </div>
                  </aside>
                )
              }
              {
                this.props.loading && (
                  <aside style = {{
                    padding:"10px",
                    marginTop:"5px",
                    // border:"1px solid #3190e6",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    width :"100%"
                  
                  }}>
                    <Spinner animation="border" variant="primary" size = "lg"/>
                  </aside>
                )
              }
            </section>
        )}
      </Dropzone>
    );
  }
}

export default  connect(
  state => ({
    audioFile: state.audio.audio,
    audio_id: state.audio.audio_id,
    url: state.audio.url,
    error: state.audio.error,
    isPlaying: state.audio.isPlaying,
    loadingAudio: state.audio.loading
  }),
  dispatch => ({
    audioActions: bindActionCreators({ setAudio, playAudio, pauseAudio }, dispatch)
  })
)(Basic);