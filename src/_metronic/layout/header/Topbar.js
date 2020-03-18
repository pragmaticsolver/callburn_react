import React from "react";
import LanguageSelector from "../../../app/partials/layout/LanguageSelector";
import UserProfile from "../../../app/partials/layout/UserProfile";
import TimeShow from '../../../app/partials/layout/TimeShow';
import UserBalance from '../../../app/partials/layout/BalanceShow';
export default class Topbar extends React.Component {
  render() {
    return (
      <div className={this.props.isMobile?"kt-header__topbar":"kt-header__topbar mobile-hide"}>
        <UserBalance/>
        <TimeShow/>
        <LanguageSelector iconType="" />
        <UserProfile showAvatar={true} showHi={false} showBadge={false} />
      </div>
    );
  }
}
