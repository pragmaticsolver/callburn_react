import React from 'react';
import './style.scss';
class SelectItem extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className = {this.props.choose_IDs.has( this.props.id )?"selector-area selected":"selector-area"}>
                <div className = "selector-label">
                    {
                        this.props.label
                    }
                </div>
                {/* <div className = "selector-info-image">
                    {
                        this.props.choosedWay_ID == this.props.id?(
                            <img src = {SelectImg} alt = "" style = {{width:"25px"}}/>
                        ):(null)
                    }
                </div> */}
            </div>
        )
    }
}
export default SelectItem;