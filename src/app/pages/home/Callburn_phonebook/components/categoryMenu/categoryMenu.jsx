import React from 'react';
import {Link} from 'react-router-dom';
import MenuImgButton from './components/menuImgButton/menuIconButton';
import BlockListIcon from 'assets/images/phone/block.png';
import groupIcon from 'assets/images/phone/group.jpg';
import importIcon from 'assets/images/phone/import.png';
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
                    <Link to = "/phonebook/group">
                         <MenuImgButton title = "Group" icon = "group"  active = {this.props.activeMenu == "group"?true:false}/>
                    </Link>
                </div>
                <div className = "menu-item">
                    <Link to = "/phonebook/import">
                         <MenuImgButton title = "import" icon = "import" active = {this.props.activeMenu == "import"?true:false}/>
                    </Link>
                </div>
                <div className = "menu-item">
                    <Link to = "/phonebook/blocklist">
                         <MenuImgButton title = "BlackList" icon = "blockList" active = {this.props.activeMenu == "blockList"?true:false}/>
                    </Link>
                </div>
            </div>
        )
    }
}
export default CategoryMenu;