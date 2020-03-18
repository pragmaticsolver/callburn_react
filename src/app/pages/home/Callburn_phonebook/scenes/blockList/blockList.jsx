import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
//import components
import CategoryMenu from '../../components/categoryMenu/categoryMenu';
import BlockListTable from './components/blockListTable/blockListTable';
//import styles
import './blockList.scss';
//import actions
import {showModal} from '../../../modals/modalConductorActions';
import {getBlackList, addNumberToBlackList, removeNumberFromBlackList} from '../../../../../store/app_services/phoneBook/phoneBookAction';
import Trans from '../../../utils/Trans';
class BlockListView extends React.Component{
  constructor(props)
  {
    super(props);
  }
  componentWillMount()
  {
    this.props.Actions.getBlackList();
  }
  componentDidUpdate(prevProps)
  { 
      if(this.props.addBlackLoading === true || this.props.removeBlackLoading === true){
        Swal.fire({
            text: "",
            onOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false
          });
    } else {
        Swal.close()
        if(prevProps.addBlackLoading === true || prevProps.removeBlackLoading === true)
        {
            this.props.Actions.getBlackList();
        }
    }
  }
  render(){
    return(
      <React.Fragment>
        <div className = "form-info">
            <h3 className = "title"><Trans id = "campaign_statistics_blacklist"/></h3>
        </div>
       <CategoryMenu activeMenu = "blockList"/>
       <br/>
       <Fab
            variant="extended"
            size="small"
            color="default"
            aria-label="add"
            style = {{padding:"0px 50px", backgroundColor:"white",margin:"10px"}}
            onClick = {
              ()=>{
                this.props.Actions.showModal("ADD_TO_BLOCKLIST")
              }
            }
          >
            <AddIcon />
            <Trans id = "account_settings_add_new"/>
       </Fab>
       <br/>
       <BlockListTable/>
      </React.Fragment>
    )
  }
}
export default connect(
  state => ({
    addBlackLoading: state.phoneBook.addBlackLoading,
    removeBlackLoading: state.phoneBook.removeBlackLoading,
  }),
   dispatch => ({
       Actions: bindActionCreators(
           { showModal, getBlackList, addNumberToBlackList, removeNumberFromBlackList },
           dispatch
       )
   })
 )(BlockListView);;