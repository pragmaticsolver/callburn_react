import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Spinner} from 'react-bootstrap';
//import material ui components;
import Table from '@material-ui/core/Table'
import TableHead   from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
//import style
import './blockListTable.scss'
import { TableBody } from '@material-ui/core'
import Trans from '../../../../../utils/Trans';
//import Actions;
import {removeNumberFromBlackList} from '../../../../../../../store/app_services/phoneBook/phoneBookAction';
class BlockListTable extends React.Component{
    setStatusText = (contact) => {
        switch (contact.blacklist_type) {
          case 'MANUALLY_TYPED':
            return <Trans id ='manually_typed'/>;
          case 'MANUALLY_ADDED':
            return   contact.campaign && contact.campaign.campaign_name ? ' ' + contact.campaign.campaign_name : '';
          case 'REQUESTED':
            return <Trans id ='requested_blacklist_from'/> +  contact.campaign && contact.campaign.campaign_name ? ' ' + contact.campaign.campaign_name : '';
          default:
            break;
        }
      };
      
    render()
    {
        return(
            <Paper className = "blocklist-wrapper">
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><Trans id = "contact_phone_number"/></TableCell>
                            <TableCell align="center"><Trans id = "name"/></TableCell>
                            <TableCell align="center"><Trans id = "created_on"/></TableCell>
                            <TableCell align="center"><Trans id = "campaign_template_index_type"/></TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.props.blackList && this.props.blackList.contacts? this.props.blackList.contacts.map(
                                (contact, index)=>(
                                    <TableRow key = {index}>
                                        <TableCell align = "center">+{contact.phonenumber}</TableCell>
                                        <TableCell align = "center">{contact.name?contact.name:"--"}</TableCell>
                                        <TableCell align = "center">{contact.created_at}</TableCell>
                                        <TableCell align = "center">{this.setStatusText(contact)}</TableCell>
                                        <TableCell align = "center">
                                            <span>
                                                 <DeleteIcon onClick = {()=>{
                                                     var phonenumber_ids = [];
                                                     phonenumber_ids[0] = contact._id;
                                                     var params = {
                                                        phonenumber_ids: phonenumber_ids
                                                     }
                                                     this.props.Actions.removeNumberFromBlackList(params);
                                                 }}/>
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )
                            ):(null)
                        }
                    </TableBody>
                </Table>
                 <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                   {
                       this.props.blackListLoading == true ? (
                           <Spinner animation = "border" size = "lg"/>
                       ):(null)
                   }
               </div>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        blackList:state.phoneBook.blackListData,
        blackListLoading: state.phoneBook.blackListLoading
    }),
    dispatch => ({
        Actions: bindActionCreators({  removeNumberFromBlackList }, dispatch)
    })
  )(BlockListTable);
  