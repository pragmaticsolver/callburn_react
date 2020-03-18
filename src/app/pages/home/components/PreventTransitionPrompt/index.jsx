import React from "react";
import { withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Prompt } from "react-router";

class PreventTransitionPrompt extends React.Component {
  /**
   * Dialog state
   */
  state = { open: false, nextLocation: "" };

  constructor() {
    super();
  }
  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState)
  {
    if(this.state.open === true)
    {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action is irreversible.!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
          }).then((result) => {
            this.setState({
                open: false
            })
            if (result.value) {
                this.props.stopBlockingFun(this.state.nextLocation);
            }
          })
    }
  }
  render() {
    const { when } = this.props;
    return (
      <React.Fragment>
        <Prompt when={when} message={location=>{
            this.setState({
                open:true,
                nextLocation: location.pathname
            })
            return false;
        }} />
      </React.Fragment>
    );
  }
}

export default withRouter(PreventTransitionPrompt);
