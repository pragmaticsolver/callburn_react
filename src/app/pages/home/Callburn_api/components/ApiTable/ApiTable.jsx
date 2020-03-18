import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {toastr} from 'react-redux-toastr';
import Swal from 'sweetalert2';
//import material ui components;
import Table from '@material-ui/core/Table'
import TableHead   from '@material-ui/core/TableHead'
import  TableBody  from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'
//-----------------------------
import {DropdownButton, Dropdown, Spinner} from 'react-bootstrap'
//import actions
import { getApiKeys, deleteKey } from '../../../../../store/app_services/campaignApi/campaignApiActions';
//import style
//import Translation components;
import Trans from '../../../utils/Trans';
class ApiTable extends React.Component{
    componentDidMount()
    {
        this.props.apiActions.getApiKeys();
    }
    componentDidUpdate(prevProps)
    {
        if(this.props.createAndDeleteLoading === true)
        {
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
            Swal.close();
            if(prevProps.createAndDeleteLoading === true)
            {
                if(this.props.success)
                {
                    toastr.success("SUCCESS",this.props.message);
                } else {
                    toastr.error("ERROR", this.props.message);
                }
                this.props.apiActions.getApiKeys();
            }
        }
    }
    render()
    {
        return(
            <Paper className = "blocklist-wrapper" style = {{overflowX:"auto", padding:"10px"}}>
                <Table size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><Trans id= "engaines_api_description"/></TableCell>
                            <TableCell align="center"><Trans id = "engaines_api_type"/></TableCell>
                            <TableCell align="center"><Trans id = "engaines_api_created"/></TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.props.apiKeys && this.props.apiKeys.length ? this.props.apiKeys.map((api, index) =>(
                                <TableRow key = {index}>
                                    <TableCell align="center">{api.description}</TableCell>
                                    <TableCell align="center">{api.type = "live"?"Production Key":"Test Key"}</TableCell>
                                    <TableCell align="center">{api.created_at}</TableCell>
                                    <TableCell align="center">
                                        <DropdownButton
                                            alignRight
                                            title = {(<Trans id = "engaines_api_more"/>)}
                                            id="dropdown-menu-align-right"
                                            variant="success"
                                        >
                                            <Dropdown.Item eventKey="0" onClick = {()=>{
                                                            Swal.fire({
                                                                title: api.description,
                                                                html : '<div style = "color:red">' + api.key + '</div>',
                                                                icon :'info',
                                                            });
                                            }}><Trans id = "engaines_api_show_key"/></Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item eventKey="1" style = {{color:"red"}}
                                                onClick = {()=>{
                                                    Swal.fire({
                                                        title: 'Are you sure?',
                                                        text: "This action is irreversible.!",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#d33',
                                                        confirmButtonText: 'Yes!'
                                                      }).then((result) => {
                                                        if (result.value) {
                                                            this.props.apiActions.deleteKey(api._id);
                                                        }
                                                      })
                                                }}
                                            ><Trans id = "engaines_api_delete"/></Dropdown.Item>
                                        </DropdownButton>
                                    </TableCell>
                                </TableRow>
                            )):(null)
                        }
                    </TableBody>
                </Table>
                {
                    <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                        {
                            this.props.getApiKeyLoading == true ? (
                                <Spinner animation = "border" size = "lg"/>
                            ):(null)
                        }
                    </div>
                }
            </Paper>
        )
    }
}

export default connect(
  state => ({
      apiKeys:state.api.apiKeys,
      getApiKeyLoading: state.api.loading,
      createAndDeleteLoading: state.api.createAndDeleteLoading,
      success: state.api.success,
      message: state.api.message
  }),
  dispatch => ({
    apiActions: bindActionCreators({ getApiKeys, deleteKey }, dispatch)
  })
)(ApiTable);
