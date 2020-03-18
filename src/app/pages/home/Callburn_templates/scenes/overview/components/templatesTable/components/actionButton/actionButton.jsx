import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import './actionButton.scss';
const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: 'black',
      color: 'white',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
class ActionButton extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            hover:false
        }
    }
    renderBackgroundColor = ()=>{
        if(this.state.hover)
        {
            return this.props.hoverBackgroundColor;
        } else {
            return  this.props.defaultBackgroundColor
        }
    }
    renderColor = ()=>{
        if(this.state.hover)
        {
            return this.props.hoverColor;
        } else {
            return  this.props.color
        }
    }
    actionHandleClick = (file, actionType) => {
    }
    render(){
        return(
            <HtmlTooltip
                title={
                <React.Fragment>
                <Typography color="inherit">
                     {this.props.tooltip_title}
                </Typography>
                </React.Fragment>
            }
            placement = "top"
            >
                <div className = "action-button-area"
                    onMouseEnter = {()=>{
                        this.setState({
                            hover:true
                        })
                    }}
                    onMouseLeave = {()=>{
                        this.setState({
                            hover:false
                        })
                    }}
                    onClick = {() => {this.actionHandleClick(this.props.file, this.props.tooltip_title)}}
                    style = {{
                        backgroundColor: this.renderBackgroundColor(),
                        color: this.renderColor()
                    }}
                >
                    <i className = {this.props.iconName}></i>
                </div>
            </HtmlTooltip>
            
        )
    }
}

export default ActionButton;