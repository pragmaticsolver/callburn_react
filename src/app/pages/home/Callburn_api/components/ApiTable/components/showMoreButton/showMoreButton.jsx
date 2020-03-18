import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class ShowMoreButton extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            anchorEl: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
  handleClick = (event) => {
    this.setState({
        anchorEl:event.currentTarget
    })
  };
  handleClose = () => {
    this.setState({
        anchorEl:null
    })
  };
  
  render(){
    return (
        <div>
          <Button aria-controls="more-api-menu" aria-haspopup="true" onClick={(event)=>{ event.preventDefault();event.stopPropagation(); this.handleClick(event) }} component="div" color="primary">
            ... More
          </Button>
          <Menu
            id="more-api-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
              <MenuItem onClick = {()=>{
                  this.handleClose()
              }}>
                  Show Item
              </MenuItem>
              <MenuItem onClick = {()=>{
                  this.handleClose()
              }}>
                  Delete
              </MenuItem>
          </Menu>
        </div>
      );
  }

}
export default ShowMoreButton;