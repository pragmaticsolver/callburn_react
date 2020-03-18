import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import Button from '@material-ui/core/Button';
import {Spinner} from 'react-bootstrap';
class Basic extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
      this.setState({files})
      if(this.props.onLoad)
      {
          var data = new FormData;
          data.append('file', files[0]);
          console.log(data);
          this.props.onLoad(files[0]);
      }
    };
    this.state = {
      files: []
    };
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));
    return (
      <Dropzone onDrop={this.onDrop} disabled = {this.props.loading ? true : false}>
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
               <p><Trans id = "campaign_compose_compose_step_1_move_your_mp3"/></p>
            </aside>
              <input {...getInputProps()} />
              <Button variant = "contained" color = "primary" ><Trans id = "campaign_compose_compose_step_1_choose_file"/></Button>
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
                      <img src="/media/play.svg" style = {{width:"20px"}} />
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

export default Basic;