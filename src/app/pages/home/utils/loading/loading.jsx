import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {Spinner} from 'react-bootstrap';
class Loading extends React.Component{
  
    render(){
        return(
            <React.Fragment>
                {
                    this.props.campaignLoading === true?(
                        <div 
                            style = {{
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                height:"50px",
                                position:"fixed",
                                bottom: 0,
                                width:"100%",
                                backgroundColor:"white"
                            }}
                        >
                            <Spinner animation="border" variant="primary" size = "lg"/>
                        </div>
                    ):(null)
                }
            </React.Fragment>
        )
    }
}

export default withRouter(connect(
    state => ({
      campaignLoading: state.campaign.loading,
    }),
    null
)(Loading));
  