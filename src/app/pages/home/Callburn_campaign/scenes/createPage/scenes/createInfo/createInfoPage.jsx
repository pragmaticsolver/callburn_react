import React from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
//import material ui components-------------------------;
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//------------------------------------------------------;
import Selector from './components/SelectItem/SelectItem'; 
//import Actions;
import { clearComposeData } from '../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
//import styles;
import './createInfoPage.scss';

function getSteps() {
  return ['<small>First of all</small>, <b>choose the way you want to create</b> <small>your callmessage/s. *</small>',
          '<small>To let our specialist be able to help you, we need to know more about your business.</small><br/><b> What is your company doing? *</b>',
          '<b>What you want to accomplish</b><small>by sending this campaign/message?</small>',
          '<small>Have you got an idea about the</small><b> content of the callmessage</b><small> you want to send? </small>',
          '<small>Introduce your</small> <b>callmessage content idea</b><small> including potentials interactions</small>',
          '<b>For creating your callmessage audio,</b><small> which of these methods do you prefer? *</small>',
          '<b>Have you got the recipients where</b><small> you want to send this callmessage? *</small>',
        ];
}
function getSteps1() {
    return ['<small>First of all</small>, <b>choose the way you want to create</b> <small>your callmessage/s. *</small>',
           ];
  }
function getStepContent(step, choosedWay_ID, _fourthAnswer, _sixth_answer, _seventh_answer, _that) {
  switch (step) {
    case 0:
      return(
        <Typography className = "step-area" component={'div'}>
            <Typography className = "step-title" component={'div'}>
                If you haven't got recipients where to send the message or you want to do a marketing-mass sending, select "Callburn specialist creation
            </Typography>
            <br/>
            <Typography className = "step-body" component={'div'}>
               <Typography component={'div'} onClick = {()=>{_that.setState({choosedWay_ID:0})}}> <Selector id = {0}   choosedWay_ID = {choosedWay_ID} label = "Callburn specialist creation - I want a live operator which do all the stuff based on my requirements"/></Typography>
               <Typography component={'div'} onClick = {()=>{_that.setState({choosedWay_ID:1})}}> <Selector id = {1}   choosedWay_ID = {choosedWay_ID} label = "Manual creation - I have got both message content and recipients"/></Typography>
               <Typography component={'div'} onClick = {()=>{_that.setState({choosedWay_ID:2})}}> <Selector id = {2}   choosedWay_ID = {choosedWay_ID} label = "API creation - I want to send callmessages directly integrating into my custom application (only for developers)"/></Typography> 
            </Typography>
        </Typography>
      );
    case 1:
            return(
              <Typography className = "step-area" component={'div'}>
                  <Typography className = "step-title" component={'div'}>
                       Example: "We are a company offering assurance services" - knowing this is useful because we already have a lot of data and metrics to help you in a better way.
                  </Typography>
                  <br/>
                  <Typography className = "step-body" component={'div'}>
                        <TextField
                                    id="standard-full-width"
                                    // label="Label"
                                    style={{ margin: 8 }}
                                    // placeholder="Placeholder"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                        />
                  </Typography>
              </Typography>
            );
    case 2:
            return(
                <Typography className = "step-area" component={'div'}>
                    <Typography className = "step-title" component={'div'}>
                         Example: send a special discount to promote my business
                    </Typography>
                    <br/>
                    <Typography className = "step-body" component={'div'}>
                        <TextField
                            id="standard-full-width"
                            // label="Label"
                            style={{ margin: 8 }}
                            // placeholder="Placeholder"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Typography>
                </Typography>
            );
    case 3:
            return(
                <Typography className = "step-area" component={'div'}>
                    <Typography className = "step-title" component={'div'}>
                            Content is the text of the message, like "Hello from .... we are offering you a special discount on your car assurance, press 1 to... press 2 to..."
                    </Typography>
                    <br/>
                    <Typography className = "step-body" component={'div'}>
                        <Typography component={'div'} onClick = {()=>{_that.setState({fourthAnswer:0})}}> <Selector id = {0}   choosedWay_ID = {_fourthAnswer} label = "Yes"/></Typography>
                        <Typography component={'div'} onClick = {()=>{_that.setState({fourthAnswer:1})}}> <Selector id = {1}   choosedWay_ID = {_fourthAnswer} label = "Yes, but i would like some suggestion"/></Typography>
                        <Typography component={'div'} onClick = {()=>{_that.setState({fourthAnswer:2})}}> <Selector id = {2}   choosedWay_ID = {_fourthAnswer} label = "No, i haven't got any idea, propose me something interesting"/></Typography> 
                    </Typography>
                    <Typography className = "step-title" component={'div'}>
                        A callmessage can include <b>interactions</b> to allow interactivity from your recipient: "press 1 to..., press 2 to..., and so.".
                        Possible interactions are: live call transfer, message replay, request a callback, blacklist.<br/>
                        We <b>strongly recommend</b> the use of them.<br/>

                        Example: "Hello from your assurance. We are offering a 30% discount on renewals that are being filled inside this week.<br/>
                        Press 1 to place a renewal now with an operator,<br/>
                        Press 2 to be called again later,<br/>
                        Press 3 to listen again this message,<br/>
                        Press 4 to opt-out from these communications"<br/>
                    </Typography>
                </Typography>
            );
    case 4:
            return(
                <Typography className = "step-area" component={'div'}>
                    <Typography className = "step-title" component={'div'}>
                        Example: "Hello from domins pizza. Every monday we are giving 2x1 offer on pizza orders.<br/>
                        Press 1 to claim this offer with an operator,<br/>
                        Press 2 to be called again later,<br/>
                        Press 3 to listen again this message,<br/>
                        Press 4 to opt-out from these communications"<br/>
                    </Typography>
                    <br/>
                    <Typography className = "step-body" component={'div'}>
                        <TextField
                                id="standard-full-width"
                                // label="Label"
                                style={{ margin: 8 }}
                                // placeholder="Placeholder"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                        />
                    </Typography>
                </Typography>
            );
    case 5:
            return(
                <Typography className = "step-area" component={'div'}>
                    <Typography className = "step-title" component={'div'}>
                    </Typography>
                    <br/>
                    <Typography className = "step-body" component={'div'}>
                        <Typography component={'div'} onClick = {()=>{_that.setState({sixthMethod:0})}}> <Selector id = {0}   choosedWay_ID = {_sixth_answer} label = "Human professional recorded voice - 35€"/></Typography>
                        <Typography component={'div'} onClick = {()=>{_that.setState({sixthMethod:1})}}> <Selector id = {1}   choosedWay_ID = {_sixth_answer} label = "TTS generated voice (Computer generated) - FREE"/></Typography>
                        <Typography component={'div'} onClick = {()=>{_that.setState({sixthMethod:2})}}> <Selector id = {2}   choosedWay_ID = {_sixth_answer} label = "I want to record my own voice message and send to you."/></Typography> 
                    </Typography>
                </Typography>
            );
    case 6:
            return(
                <Typography className = "step-area" component={'div'}>
                    <Typography className = "step-title" component={'div'}>
                    </Typography>
                    <br/>
                    <Typography className = "step-body" component={'div'}>
                        <Typography component={'div'} onClick = {()=>{_that.setState({seventhAnswer:0})}}> <Selector id = {0}   choosedWay_ID = {_seventh_answer} label = "No, i haven't got it. I want to send to a specific postal code/s using a public phonenumber database provided by Callburn"/></Typography>
                        <Typography component={'div'} onClick = {()=>{_that.setState({seventhAnswer:1})}}> <Selector id = {1}   choosedWay_ID = {_seventh_answer} label = "Yes, I have got my list of contacts, so i don't need any recipient."/></Typography>
                    </Typography>
                </Typography>
            );
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  constructor(props)
  {
      super(props);
  }
  state = {
    activeStep: 0,
    choosedWay_ID: 4,
    fourthAnswer: 4,
    sixthMethod: 4,
    seventhAnswer: 4
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  componentDidMount(){
    this.props.Actions.clearComposeData();
    
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.choosedWay_ID != this.state.choosedWay_ID)
    {
       if(this.state.choosedWay_ID == 0){
        Swal.fire({
            title:'<h3><b>Welcome to message creation</b></h3>',
            html :'Callmessages are just <b>voice messages delivered through a normal phone call</b> and they can be used for a lot of purposes, including <b>marketing, notifications</b> and <b>emergencies.</b>' + 
                  '<br/><br/> We will help you to create a <b>successful callmessage campaign</b> just answering to some simple questions.  It will take <b>no more than 5 minutes</b>',
            icon :'info',
            customClass: 'swal-wide',
        });
      } else if( this.state.choosedWay_ID == 1 )
      {
         this.props.history.push("/campaign/create/manulaycreate");
      } else if( this.state.choosedWay_ID == 2 ) {
        this.props.history.push("/apiform");
      }
    }
  }
  render() {
    // const { classes } = this.props;
    let steps = {};
    if(this.state.choosedWay_ID == 0  )
    {
        steps = getSteps();
    } else {
        steps = getSteps1();
    }
    const { activeStep } = this.state;
    return (
      <div >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel >
              <span className = "step-label">{
                  <div dangerouslySetInnerHTML={{__html: label}}>
                  </div>
              }</span>
              </StepLabel>
              <StepContent>
                <Typography  component={'div'}                
                >{getStepContent(index, 
                      this.state.choosedWay_ID,
                      this.state.fourthAnswer,
                      this.state.sixthMethod,
                      this.state.seventhAnswer,
                      this)}
                </Typography>
                <div >
                  <div>
                    {
                      this.state.choosedWay_ID != 4 && (
                        <React.Fragment>
                        <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        // className={classes.button}
                      >
                        Back
                      </Button>
                      <span>{
                        activeStep === steps.length - 1 && this.state.choosedWay_ID == 1?(
                           <Link to = "/campaign/create/manulaycreate">
                            <Button
                                variant="contained"
                                color="primary"
                                // className={classes.button}
                              >
                                Submit
                            </Button>
                           </Link>
                        ):(
                          <Button
                              variant="contained"
                              color="secondary"
                              onClick={this.handleNext}
                              // className={classes.button}
                            >
                              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                            
                           </Button>
                        )
                      }</span>
                      </React.Fragment> )
                    }
                   
                   
                  
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} >
            {/* <Typography component={'div'}>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button> */}
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(connect(
  // state => ({
  //   compose:state.compose
 
  // }),
   null,
   dispatch => ({
       Actions: bindActionCreators(
           {  clearComposeData },
           dispatch
       )
   })
 )(VerticalLinearStepper));