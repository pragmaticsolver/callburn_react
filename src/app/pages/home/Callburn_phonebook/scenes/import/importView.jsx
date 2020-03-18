import React from 'react';
//import react material ui components
import Paper from '@material-ui/core/Paper';
//import components
import CategoryMenu from '../../components/categoryMenu/categoryMenu';
import ImportStepper from './components/importStepper/importStepper';
//import styles
import './importView.scss';
import Trans from '../../../utils/Trans';
class TemplatesForm extends React.Component{
 
  render(){
    return(
      <React.Fragment>
        <div className = "form-info">
            <h3 className = "title"><Trans id = "addressbook_menu_import"/></h3>
        </div>
       <CategoryMenu activeMenu = "import"/>
       <br/>
       <Paper>
          <ImportStepper/>
       </Paper>
      </React.Fragment>
    )
  }
}
export default TemplatesForm;