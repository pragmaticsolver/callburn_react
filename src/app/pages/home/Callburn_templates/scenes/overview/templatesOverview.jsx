import React from 'react';
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
//import components
import CategoryMenu from './components/categoryMenu/categoryMenu';
import TemplatesTable from './components/templatesTable/templatesTable';
//import styles
import './templatesOverview.scss';
import 'assets/callburn/style/scss/modules/_overview.scss';
class TemplatesForm extends React.Component{
  constructor(props)
  {
    super(props);
  }
  render(){
    return(
      <React.Fragment>
        <div className = "form-info">
            <h3 className = "title">Templates</h3>
            <h5 className = "des">Create your most frequently used messages or browse already sent ones</h5>
        </div>
       <CategoryMenu/>
       <br/>
       <Link
         to = "/templates/create" 
      >
          <Fab
            variant="extended"
            size="small"
            color="default"
            aria-label="add"
            style = {{padding:"0px 50px", backgroundColor:"white"}}
          >
            <AddIcon />
            Create New
          </Fab>
        </Link>
        <div  className = "templates-area">
          <TemplatesTable/>
        </div>
      </React.Fragment>
    )
  }
}
export default TemplatesForm;