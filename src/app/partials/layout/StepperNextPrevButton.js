import React from 'react';
import Button from '@material-ui/core/Button';
import './StepperNextPrevButton.scss';
class StepperButtons extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className = "stepper-button-area">
                <Button>Back</Button>
                <Button>Next</Button>
            </div>
        )
    }
}

export default StepperButtons;