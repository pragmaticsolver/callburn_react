import React from 'react';
import './style.scss';
class SelectItem extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className = {this.props.choosedWay_ID === this.props.id ? "selector-area selected" : "selector-area"}>
                <div className = "selector-label">
                    {
                        this.props.label
                    }
                </div>
            </div>
        )
    }
}
export default SelectItem;