import React from 'react';
import './menuIconButton.scss';
class MenuIconButton extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className = "menu-icon-button-area">
                <div className = "title">
                    { this.props.title }
                </div>
                <div className = "icon">
                    <img src = {this.props.iconImgUrl} alt = ""/>
                </div>
            </div>
        )
    }
}

export default MenuIconButton;