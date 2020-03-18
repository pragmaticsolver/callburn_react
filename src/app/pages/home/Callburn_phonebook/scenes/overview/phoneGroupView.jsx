import React from 'react';
import { Link } from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
//import components
import CategoryMenu from '../../components/categoryMenu/categoryMenu';
import PhoneGroupTable from './components/phoneGroupTable/phoneGroupTable';
//import styles
import './phoneGroupView.scss';
//import translation component
import Trans from '../../../utils/Trans';
class TemplatesForm extends React.Component{
  constructor(props)
  {
    super(props);
  }
  render(){
    return(
      <React.Fragment>
        <div className = "form-info">
            <h3 className = "title"><Trans id = "address_book_groups_groups"/></h3>
        </div>
       <CategoryMenu activeMenu = "group"/>
       <br/>
       <Link
         to = "/phonebook/import" 
        >
          <Fab
            variant="extended"
            size="medium"
            color="secondary"
            aria-label="add"
            className = "create-group-icon"
          >
            <AddIcon style = {{marginRight:"10px"}}/>
            <Trans id = "account_settings_add_new" name = ""/>
          </Fab>
        </Link>
        <div  className = "templates-area">
          <PhoneGroupTable/>
        </div>
      </React.Fragment>
    )
  }
}
export default TemplatesForm;