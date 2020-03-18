import React from "react";
import MessageImg from 'assets/callburn/images/images/voice_message_hover.svg';
import PhoneBookImg from 'assets/callburn/images/images/phonebook-icon-blue@2x.svg';
import ApiImg from 'assets/callburn/images/images/a-p-i-icon-blue@2x.svg';
import SupportImg from 'assets/callburn/images/images/support-icon-blue@2x.svg';
import Trans from '../../../../app/pages/home/utils/Trans';
export default class HMenuItemInner extends React.Component {

  itemCssClassWithBullet(item, parentItem) {
    if (item.bullet) {
      return `kt-menu__link-bullet--${item.bullet}`;
    }

    if (parentItem && parentItem.bullet) {
      return `kt-menu__link-bullet--${parentItem.bullet}`;
    }

    return "";
  }

  render() {
    const { item, parentItem} = this.props;
    return (
      <>
        {/* if menu item has icon */}
        {item.icon && (
          // <i className={`kt-menu__link-icon ${item.icon}`} />  ikram
          <span>
            {
              item.title == "sidebar_message" && (
                <img src = {MessageImg} alt = "" style = {{height:"34px", marginRight:"5px"}}/>
              )
            }
            {
              item.title == "include_nav_all_phonebook" && (
                <img src = {PhoneBookImg} alt = "" style = {{height:"25px", marginRight:"5px"}}/>
              )
            }
            {
              item.title == "include_nav_all_api" && (
                <img src = {ApiImg} alt = "" style = {{height:"25px", marginRight:"5px"}}/>
              )
            }
            {
              item.title == "include_nav_all_support" && (
                <img src = {SupportImg} alt = "" style = {{height:"25px", marginRight:"5px"}}/>
              )
            }
          </span>
        )}

        {/* if menu item using bullet */}
        {(!item.icon && (item.bullet || (parentItem && parentItem.bullet))) && (
         <i className={`kt-menu__link-bullet ${this.itemCssClassWithBullet(item, parentItem)}`}><span /></i>
        )}

        {!item.badge ? (
          <>
            <span className="kt-menu__item-here"/>
            {/* menu item title text */}
            <span className="kt-menu__link-text"><Trans id = {item.title}/></span>
          </>
        ) : (
          <>
            {/* menu item with badge */}
            <span className="kt-menu__link-text"><Trans id = {item.title}/></span>
            <span className="kt-menu__link-badge">
              <span className={`kt-badge kt-badge--brand kt-badge--inline kt-badge--pill ${item.badge.type} `}>
                {item.badge.value}
              </span>
            </span>
          </>
        )}
      </>
    );
  }
}
