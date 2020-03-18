import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Checkbox , Table, TableHead, TableRow, TableCell, TableBody, Paper} from '@material-ui/core';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {DropdownButton, Dropdown, Spinner} from 'react-bootstrap';
import './phoneGroupTable.scss';
//import actions
import {showModal} from '../../../../../../../modals/modalConductorActions';
import {getPhoneGroup, clearGroup} from '../../../../../../../../../store/app_services/phoneBook/phoneBookAction';
import { setRecipientsData, setAllContacts, calculateCost} from '../../../../../../../../../store/app_services/campaignCompose/campaignComposeAction';
//import translation components
import Trans from '../../../../../../../utils/Trans';
class phoneGroupsTable extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
        }
        this.selectChanged = this.selectChanged.bind(this);
        this.getMore = this.getMore.bind(this);
        this.table_wrapper    = null;
    }
    
    selectChanged = (event, group_id, group_name) =>{
      var tempData = this.props.compose.recipients_data ? this.props.compose.recipients_data:[];
      tempData[group_id] = event.target.checked;
      var groupNameText = "";
      var currentGroupNameTexts = this.props.compose.recipients_text.split(",");
      if(event.target.checked)
      {
        if(!currentGroupNameTexts.includes(group_name))
        {
          currentGroupNameTexts.push(group_name)
        }
      } else {
        if(currentGroupNameTexts.includes(group_name))
        {
          for( var i = 0; i < currentGroupNameTexts.length; i++){ 
            if ( currentGroupNameTexts[i] === group_name) {
              currentGroupNameTexts.splice(i, 1)
            }
         }
        }
      }
      for(var i = 0 ;i < currentGroupNameTexts.length; i++)
      {
        if(currentGroupNameTexts[i] !== "") groupNameText += currentGroupNameTexts[i];
        if(i < currentGroupNameTexts.length - 1 && currentGroupNameTexts[i] !== "") groupNameText += ","
      }
      
      this.props.Actions.setRecipientsData(tempData, groupNameText);
      var allContacts = this.props.compose.allContacts;

      if(group_id === "all") 
      {
        this.props.Actions.setAllContacts(event.target.checked);
        allContacts = event.target.checked;
      }
      var params = {};

      params.all_contacts = allContacts;
      params.data = tempData;
      if(this.props.compose.file_id && this.props.compose.file_id !== "" ) params.file_id = this.props.compose.file_id;
      if(this.props.compose.message_content && this.props.compose.message_content !== "" ) params.sms_text = this.props.compose.message_content;
      params.type = this.props.compose.messageType;
      this.props.Actions.calculateCost(params);
    }
    pageScrollEvent = () => {
        if(this.table_wrapper.scrollHeight - this.table_wrapper.scrollTop === 350 && !this.props.group.group_loading && this.props.group.groups.length < this.props.group.allGroupsCount)
        {
            const params = {
              page: this.props.group.currentGroupPageIndex
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
                page: this.props.group.currentGroupPageIndex
              }
              this.props.Actions.getPhoneGroup(params);
           }
        }, 10);
        
      }
    componentWillMount(){
      // this.props.Actions.clearGroup();
    }
    componentDidMount(){
        this.table_wrapper.addEventListener("wheel", this.pageScrollEvent);
        this.props.Actions.getPhoneGroup();
     }
     getGroupName = (group) => {
      if (group._id === "all") {
        return <Trans id ="addressbook_all_contacts"/>;
      }

      if (!group.name) {
        return <Trans id ="add_a_name"/>;
      }
      if (group.type === "CREATED_ON_RETRY_UNDELIVERED") {

        return "Undelivered contacts of " + group.name ;
      }
      return group.name;
    };
    render(){
        return(
            <div>
            <div className  = "reciption-table" ref={(input) => (this.table_wrapper = input)}>
                <Table stickyHeader aria-label="sticky table" size = "small" >
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align = "center"><Trans id = "address_book_groups_name"/></TableCell>
                            <TableCell align = "center"><Trans id = "address_book_groups_no_of_contacts"/></TableCell>
                            <TableCell align = "center"><Trans id = "updated_on"/></TableCell>
                         </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align = "center">
                          <Checkbox  onChange = {(event)=>{
                                                this.selectChanged(event, "all", "All");
                                              }
                                            }
                            checked ={this.props.compose.recipients_data && this.props.compose.recipients_data.all?true:false}
                          />
                          </TableCell>
                        <TableCell align = "center"><Trans id = "addressbook_all_contacts"/></TableCell>
                        <TableCell align = "center">{this.props.allContactsCount} <Trans id = "voice_message_schedule_modal1_contacts"/></TableCell>
                        <TableCell align = "center">----</TableCell>
                      </TableRow>
                        {
                            this.props.group.groups.length>0?this.props.group.groups.map((group, index) => (
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
                                                this.selectChanged(event, group._id, group.type === "CREATED_ON_RETRY_UNDELIVERED" ? "Undelivered contacts of " + group.name:group.name);
                                              }
                                            }
                                            onClick = {(event)=>{
                                                event.stopPropagation();
                                            }}
                                            value={index}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            disabled = {group.in_progress === 1 ? true : false}
                                            checked ={this.props.compose.recipients_data && this.props.compose.recipients_data[group._id]?true:false}
                                        />
                                    </TableCell>
                                    <TableCell align = "center">
                                     {
                                         this.getGroupName(group)
                                     }
                                    
                                    </TableCell>
                                    <TableCell align = "center">
                                     {
                                        group.in_progress === 1 ? (
                                            <Spinner animation="border" variant="primary" size = "lg"/>
                                        ):(
                                                group.contact_count[0] ? group.contact_count[0].count+" contacts" : "0 contacts"
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
             <div className = "reciption-table-loading-spider-view">
              {
                this.props.group.group_loading === true?(
                  <Spinner animation="border" variant="primary" size = "lg"/>
                ):(
                  null
                )
              }
              {
                this.props.group.group_loading === true && this.props.currentGroupPageIndex === 0? (
                   null
                ):(
                  <React.Fragment>
                    {
                      !this.props.group.group_loading && this.props.group.groups.length < this.props.group.allGroupsCount && (
                        <ArrowDownIcon className = "arrow-down-icon" onClick = {this.getMore}/>
                      )
                    }
                    <div className = "group-info-show">
                      <Trans id = "page_counter_showing_1"/> {this.props.group.groups.length} <Trans id = "pagination_of"/> {this.props.group.allGroupsCount} <Trans id = "page_counter_items_1"/>
                    </div>
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
        group:{...state.phoneBook},
        compose: {...state.compose}
      }),
     dispatch => ({
         Actions: bindActionCreators(
             { 
               showModal ,
               //group action
               getPhoneGroup,clearGroup,
               //Calcuation cost actions
              setRecipientsData, setAllContacts, calculateCost},
             dispatch
         )
     })
   )(phoneGroupsTable);;