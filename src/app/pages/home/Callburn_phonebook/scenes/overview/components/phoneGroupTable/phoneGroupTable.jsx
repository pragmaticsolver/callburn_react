import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Checkbox , Table, TableHead, TableRow, TableCell, TableBody, Paper} from '@material-ui/core';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Swal from 'sweetalert2';
import {DropdownButton, Dropdown, Spinner} from 'react-bootstrap';
import './phoneGroupTable.scss';
//import actions
import {showModal} from '../../../../../modals/modalConductorActions';
import {getPhoneGroup, clearGroup, exportContacts, removeGroup, mergeGroup} from '../../../../../../../store/app_services/phoneBook/phoneBookAction';
//import translation components
import Trans from '../../../../../utils/Trans';
class phoneGroupsTable extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedGroupIds:new Set(),
            moreMenu: null
        }
        this.selectChanged = this.selectChanged.bind(this);
        this.getMore = this.getMore.bind(this);
        this.removeGroupFun = this.removeGroupFun.bind(this);
        this.table_wrapper    = null;
    }
    handleClick = (event) => {
        this.setState({
            moreMenu:event.currentTarget
        })
    };
    handleClose = () => {
        this.setState({
            moreMenu:null
        })
    };
    exportFun = () => {
        if(!this.state.selectedGroupIds.size ) return;
        var groups = {};
        var values = this.state.selectedGroupIds.values();
        for(var i = 0 ;i < this.state.selectedGroupIds.size; i++)
        {
            var _temp = values.next().value;
            groups[`${_temp}`] = true;
        }
        this.props.Actions.exportContacts(groups);
    }
    removeGroupFun = () => {
        if(!this.state.selectedGroupIds.size ) return;
        var groups = {};
        var values = this.state.selectedGroupIds.values();
        for(var i = 0 ;i < this.state.selectedGroupIds.size; i++)
        {
            var _temp = values.next().value;
            groups[`${_temp}`] = true;
        }
        var params = {};
        params['group_ids'] = JSON.stringify(groups);
        this.props.Actions.removeGroup(params);
        var selectedIds = this.state.selectedGroupIds;
        selectedIds.clear();
        this.setState({
            selectedGroupIds: selectedIds
        })
    }
    mergeGroupFun = () => {
        if(!this.state.selectedGroupIds.size ) return;
        var groups = {};
        var values = this.state.selectedGroupIds.values();
        for(var i = 0 ;i < this.state.selectedGroupIds.size; i++)
        {
            var _temp = values.next().value;
            groups[`${_temp}`] = true;
        }
        var params = {};
        params['ids'] = groups;
        params['name'] = "New name";
        this.props.Actions.mergeGroup({...params});
        var selectedIds = this.state.selectedGroupIds;
        selectedIds.clear();
        this.setState({
            selectedGroupIds: selectedIds
        })
    }
    selectChanged = (event) =>{
        var _temp = this.state.selectedGroupIds;
        if( !_temp.has(event.target.value ) ){
            _temp.add(event.target.value);
        } else {
        _temp.delete(event.target.value);
        }
       this.setState({
           selectedGroupIds: _temp
       })
    }
    pageScrollEvent = () => {
        if(this.table_wrapper.scrollHeight - this.table_wrapper.scrollTop === 500 && !this.props.group_loading && this.props.groups.length < this.props.allGroupsCount)
        {
            const params = {
              page: this.props.currentGroupPageIndex
            }
            this.props.Actions.getPhoneGroup(params);
        }
      }
    getMore = () => {
        var h = this.table_wrapper.scrollTop;
        var ss = setInterval(() => {
           this.table_wrapper.scrollTo(0, h);
           h = h + 50;
           if(h >= this.table_wrapper.scrollHeight)
           {
               clearInterval(ss)
               const params = {
                page: this.props.currentGroupPageIndex
              }
              this.props.Actions.getPhoneGroup(params);
           }
        }, 10);
        
      }
    componentDidMount(){
        this.table_wrapper.addEventListener("wheel", this.pageScrollEvent);
        this.props.Actions.getPhoneGroup();
    }
    componentDidUpdate(prevProps){
        if(this.props.removeGroupLoading === true || this.props.mergeGroupLoading === true){
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
            if(prevProps.removeGroupLoading === true || prevProps.mergeGroupLoading === true)
            {
                this.props.Actions.getPhoneGroup();
            }
        }

    }
    render(){
        return(
            <div>
            {
                this.state.selectedGroupIds.size?(
                    <div className = "more-menu-section">
                        <DropdownButton
                            alignRight
                            title="...Show More"
                            id="dropdown-menu-align-right"
                            variant="success"
                        >
                            <Dropdown.Item eventKey="0" style = {{color:"green"}}><Trans id = "address_book_groups_send_message"/></Dropdown.Item>
                            <Dropdown.Item eventKey="1" onClick = {this.mergeGroupFun}><Trans id = "address_book_groups_merge_unify"/></Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick = {this.exportFun}><Trans id = "address_book_groups_export_selected"/></Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="3" style = {{color:"red"}} onClick = {this.removeGroupFun}><Trans id = "address_book_groups_delete_selected"/></Dropdown.Item>
                        </DropdownButton>
                     </div>
                ):(null)
            }
            <div className  = "phone-group-view-table" ref={(input) => (this.table_wrapper = input)}>
                <Table stickyHeader aria-label="sticky table" size = "small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align = "center"><Trans id = "address_book_groups_name"/></TableCell>
                            <TableCell align = "center"><Trans id = "address_book_groups_no_of_contacts"/></TableCell>
                            <TableCell align = "center"><Trans id = "updated_on"/></TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.props.groups.length>0?this.props.groups.map((group, index) => (
                                <TableRow key = {index} className = "group-row"
                                    onClick = {()=>{
                                        if(group.contact_count[0] && group.contact_count[0].count)
                                        {
                                            var params = {
                                                groupName:group.name,
                                                createdOn:group.created_at,
                                                group_id: group._id
                                            }
                                            this.props.Actions.showModal("PHONE_GROUP_INFO",params);
                                        }
                                }}
                                >
                                    <TableCell align = "center">
                                        <Checkbox
                                            onChange = {(event)=>{
                                                this.selectChanged(event);
                                                }
                                            }
                                            onClick = {(event)=>{
                                                event.stopPropagation();
                                            }}
                                            value={group._id}
                                            checked = {this.state.selectedGroupIds.has(`${group._id}`) === true ? true : false}
                                        />
                                    </TableCell>
                                    <TableCell align = "center">
                                     {
                                         group.name
                                     }
                                    </TableCell>
                                    <TableCell align = "center">
                                     {
                                        group.in_progress == 1?(
                                            <Spinner animation="border" variant="primary" size = "lg"/>
                                        ):(
                                                group.contact_count[0]?group.contact_count[0].count+" contacts":"0 contacts"
                                        )
                                     }
                                    </TableCell>
                                    <TableCell align = "center">
                                     {
                                       group.updated_at
                                     }
                                    </TableCell>
                                </TableRow>
                            )):(null)
                        }
                    </TableBody>
                </Table>
             </div>
             <div className = "group-table-loading-spider-view">
              {
                this.props.group_loading==true?(
                  <Spinner animation="border" variant="primary" size = "lg"/>
                ):(
                  null
                )
              }
              {
                this.props.group_loading == true && this.props.currentGroupPageIndex === 0 ? (
                   null
                ):(
                  <React.Fragment>
                    {
                      !this.props.group_loading && this.props.groups.length < this.props.allGroupsCount && (
                        <ArrowDownIcon className = "arrow-down-icon" onClick = {this.getMore}/>
                      )
                    }
                    {/* <div className = "group-info-show">
                      showing {this.props.groups.length} of {this.props.allGroupsCount} items
                    </div> */}
                  </React.Fragment>
                )
              }
              
            </div>
            </div>
        )
    }
}
export default connect(
    state => ({
        ...state.phoneBook
      }),
     dispatch => ({
         Actions: bindActionCreators(
             { showModal , getPhoneGroup, clearGroup, exportContacts, removeGroup, mergeGroup},
             dispatch
         )
     })
   )(phoneGroupsTable);;