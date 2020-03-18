/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { toAbsoluteUrl } from "../../../_metronic";
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";
import {Button} from 'react-bootstrap'
import { logOut } from '../../store/app_services/user/userApi';
import Trans from '../../pages/home/utils/Trans';
class UserProfile extends React.Component {
  async logOutFun(){
     var logoutResult = logOut();
     await logoutResult.then((data) => {
        localStorage.setItem("jwtToken", "");
        window.location.href = "/";
     })
  }
  render() {
    const {  showHi, showAvatar, showBadge } = this.props;

    return (
      <Dropdown className="kt-header__topbar-item kt-header__topbar-item--user" drop="down" alignRight>
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id="dropdown-toggle-user-profile"
        >
          <div className="kt-header__topbar-user">
            {showHi && (
              <span className="kt-header__topbar-welcome kt-hidden-mobile">
                Hi,
              </span>
            )}

            {showHi && (
              <span className="kt-header__topbar-username kt-hidden-mobile">
                {/* {user.fullname} */}
                John
              </span>
            )}

            {showAvatar && <img alt="Pic"  src = "/media/users/default.jpg"/>}

            {showBadge && (
              <span className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">
                {/* TODO: Should get from currentUser */}
                John Doe
              </span>
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
          {/** ClassName should be 'dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          <div
            className="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/misc/bg-1.jpg")})`
            }}
          >
            <div className="kt-user-card__avatar">
              <img alt="Pic" className="kt-hidden"   src = "/media/users/default.jpg"/>
              <span className="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success">
                S
              </span>
            </div>
            <div className="kt-user-card__name">
              {/* {user.fullname} */}
              {this.props.userData? this.props.userData.personal_name : ""}
            </div>
          
          </div>
          <div className="kt-notification">
            <Link to ="/settings">
              <div className="kt-notification__item">
                <div className="kt-notification__item-icon">
                  <i className="flaticon2-calendar-3 kt-font-success" />
                </div>
                <div className="kt-notification__item-details">
                  <div className="kt-notification__item-title kt-font-bold">
                     <Trans id = "account_settings_settings"/>
                  </div>
                  <div className="kt-notification__item-time">
                    {/* Account settings and more */}
                  </div>
                </div>
              </div>
            </Link>
            <Link to = "/financials">
              <div className="kt-notification__item">
                <div className="kt-notification__item-icon">
                  <i className="flaticon2-mail kt-font-warning" />
                </div>
                <div className="kt-notification__item-details">
                  <div className="kt-notification__item-title kt-font-bold">
                    <Trans id = "account_invocies_invoices"/>
                  </div>
                  <div className="kt-notification__item-time">
                     <Trans id = "support_tickets_financials_Invoices"/>
                  </div>
                </div>
              </div>
            </Link>
          
            <div className="kt-notification__custom">
              <Button
                className="btn btn-label-brand btn-sm btn-bold"
                onClick = {
                  this.logOutFun
                }
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}



export default connect(
  state => ({
      userData:state.user.userData
  }),
  dispatch => ({
    campaignActions: bindActionCreators({  }, dispatch)
  })
)(UserProfile);

