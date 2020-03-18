import React from 'react';
import MenuImgButton from './components/menuImgButton/menuIconButton';
import CallMessagesIcon from 'assets/images/overview/overview_vm.svg';
import SmsIcon from 'assets/images/overview/overview_sms.svg';
import CallbackIcon from 'assets/images/compose/callback.svg';
import BlockListIcon from 'assets/images/compose/blacklist-white.svg';
import './categoryMenu.scss';
class CategoryMenu extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            category: "all"
        }
    }
    handleClick = (event) => {

    }
    render(){
        return(
            <div className = "category-menu-area">
                <div className = "menu-item">
                    <MenuImgButton title = "CallMessages" iconImgUrl = {CallMessagesIcon}  />
                </div>
                <div className = "menu-item">
                    <MenuImgButton title = "SMS" iconImgUrl = {SmsIcon}/>
                </div>
                <div className = "menu-item">
                    <MenuImgButton title = "Callback" iconImgUrl = {CallbackIcon}/>
                </div>
                <div className = "menu-item">
                    <MenuImgButton title = "BlockList" iconImgUrl = {BlockListIcon}/>
                </div>
            </div>
        )
    }
}
export default CategoryMenu;