import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment-timezone';
//import actions
import { getUserData, setCurrentTime } from '../../../store/app_services/user/userAction';
import { setCallerId } from '../../../store/app_services/campaignCompose/campaignComposeAction';
class Fun extends React.Component {
    constructor(props) {
        super(props);
        this.time = "";
        this.setTime = this.setTime.bind(this);
    }
    setTime = () => {
        if (this.props.userData.timezone != undefined && this.props.userData.timezone != null && this.props.userData.setTime != "") {
            this.time = moment
                .tz(this.props.userData.timezone)
                .format("HH:mm");
            this.props.Actions.setCurrentTime(this.time);
        }
    }
    componentDidMount() {
        this.props.Actions.getUserData();
        if (this.props.userData.timezone) {
            this.time = moment
                .tz(this.props.userData.timezone)
                .format("HH:mm");
            this.props.Actions.setCurrentTime(this.time);
        }
        setInterval(this.setTime, 1000);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.userData != this.props.userData && this.props.userData.numbers.length > 0) {
            if (this.props.compose.caller_id === "" || this.props.compose.caller_id === null || this.props.compose.caller_id === undefined) {
                this.props.Actions.setCallerId(
                    this.props.userData.numbers[this.props.userData.numbers.length - 1].phone_number
                )
            }
        }
    }
    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}

export default connect(
    state => ({
        userData: state.user.userData,
        compose: state.compose,
    }),
    dispatch => ({
        Actions: bindActionCreators({ getUserData, setCurrentTime, setCallerId }, dispatch)
    })
)(Fun);
