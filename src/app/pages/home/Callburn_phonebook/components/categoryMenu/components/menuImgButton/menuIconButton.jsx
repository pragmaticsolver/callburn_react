import React from 'react';
import UsersIcon from '@material-ui/icons/Group';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Lock';
import './menuIconButton.scss';
import Trans from '../../../../../utils/Trans';
class MenuIconButton extends React.Component{
    render(){
        return(
            <div className = {this.props.active?"menu-icon-button-area active":"menu-icon-button-area"}>
                <div className = "title">
                    { this.props.title === "Group" ? (
                        <Trans id = "addressbook_menu_groups"/>
                    ): this.props.title === "import" ? (
                        <Trans id = "addressbook_menu_import"/>
                    ) : (
                        <Trans id = "campaign_statistics_blacklist"/>
                    ) }
                </div>
                <div className = "icon">
                  {
                      this.props.icon === "group" ? <UsersIcon fontSize = "large"/> :
                      this.props.icon === "import" ? <AddIcon fontSize = "large"/> : <BlockIcon fontSize = "large"/>
                  }
                </div>
            </div>
        )
    }
}

export default MenuIconButton;