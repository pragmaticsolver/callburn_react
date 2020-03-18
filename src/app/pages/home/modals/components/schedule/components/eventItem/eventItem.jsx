import React from 'react';

class EventItem extends React.Component{
    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className={`fc-content content${this.props.id}`}>
                <span className="fc-title" style = {{color:"white"}}>{this.props.startTimes[this.props.id]}</span>
            </div>
        )
    }
}
export default EventItem;