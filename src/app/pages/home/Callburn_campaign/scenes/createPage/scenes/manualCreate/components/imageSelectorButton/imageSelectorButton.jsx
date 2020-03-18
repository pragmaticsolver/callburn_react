import React from 'react';
import './imageSelectorButton.scss';
class ImageSelectorButton extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return(
            <div className = {this.props.selected ? "image-selector-button-area selected" : "image-selector-button-area"}>
                <div className = "image-area">
                    <img src = {this.props.imageUrl} alt = ""/>
                </div>
                <div className = "title-area">
                    {this.props.title}
                </div>
                <p className = "des-area">
                    {this.props.description}
                </p>
            </div>
        )
    }
}
export default ImageSelectorButton;