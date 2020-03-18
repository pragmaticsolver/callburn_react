import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import material ui components;
import {Table , Checkbox, TableHead, TableBody, TableRow,TableCell, Button} from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
//import react-bootstrap components;
import {DropdownButton,  Dropdown, Spinner } from 'react-bootstrap';
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//import style
import './showGroupInfoModal.scss';
//import actions;
import {getContacts, clearContacts} from '../../../../../../store/app_services/phoneBook/phoneBookAction';
import {hideModal} from '../../../modalConductorActions';
//import tralsation component
import Trans from '../../../../utils/Trans';
class ShowGroupInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moreMenu:false,
      selectedPhonIds:new Set()
    }
    this.setContactsIds  = this.setContactsIds.bind(this);
    this.pageScrollEvent = this.pageScrollEvent.bind(this);
    this.getMore         = this.getMore.bind(this);
    this.table_wrapper    = null;
  }
  setContactsIds = (event, contact_id) =>{
      if(contact_id == "all")
      {
          var temp = new Set();
          if(event.target.checked){
            for(var i = 0 ; i < this.props.contacts.length; i++)
            {
              temp.add(this.props.contacts[i]._id);
            }
          }
          this.setState({
            selectedPhonIds:temp
          })
      } else {
        var temp = this.state.selectedPhonIds;
        if(event.target.checked)
        {
          if(!temp.has(contact_id))
          {
            temp.add(contact_id)
          }
        } else {
          if(temp.has(contact_id))
          {
            temp.delete(contact_id)
          }
        }
        this.setState({
          selectedPhonIds:temp
        })
      }
     
  }
  pageScrollEvent = () => {
    if(this.table_wrapper.scrollHeight - this.table_wrapper.scrollTop == 400 && !this.props.loading && this.props.contacts.length < this.props.allContactsOfGroupCount)
    {
        const params = {
          page: this.props.currentContactPageIndex,
          group_id: this.props.modal.params.group_id
        }
        this.props.Actions.getContacts(params);
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
            page: this.props.currentContactPageIndex,
            group_id: this.props.modal.params.group_id
          }
          this.props.Actions.getContacts(params);
       }
    }, 10);
    
  }
 componentDidMount(){
    // this.table_wrapper.addEventListener("wheel", this.pageScrollEvent);
    this.props.Actions.clearContacts();
    const params = {
      page: this.props.currentContactPageIndex,
      group_id: this.props.modal.params.group_id
    }
    this.props.Actions.getContacts(params);
 }
  render() {
    return (
      <Modal
        isOpen={true}
        toggle={null}
        className="modal-dialog-centered"
        style = {{maxWidth:"700px"}}
      >
          <ModalHeader> Group Info</ModalHeader>
          <ModalBody>
              <div>
                <span><strong><Trans id = "contacts_group_name"/>: </strong>{this.props.modal.params.groupName}</span>
              </div>
              <div>
                <span><strong><Trans id = "campaign_statistics_created_on"/>: </strong>{this.props.modal.params.createdOn}</span>
              </div>
              <div>
                  <DropdownButton
                  title= "...More"
                  id="dropdown-more-action-button"
                  variant="success"
                  onClick = {(event) => {
                    //  event.preventDefault();event.stopPropagation();
                  }}
                  disabled = {this.state.selectedPhonIds.size == 0?true:false}
                >
                  <Dropdown.Item><Trans id = "contacts_send_message_1"/></Dropdown.Item>
                  <Dropdown.Item style = {{color:"red"}}><Trans id = "address_book_groups_delete_selected"/></Dropdown.Item>

                </DropdownButton>
              </div>
              <div className = "contacts-table-area" ref={(input) => (this.table_wrapper = input)}>
                < Table stickyHeader aria-label="sticky table"  size="small">
                    <TableHead>
                        <TableRow>
                          <TableCell><Checkbox onChange = {(e) =>{this.setContactsIds(e, "all")} }></Checkbox></TableCell>              
                          <TableCell> <Trans id = "addressbook_import_contact_phonenumber"/> </TableCell>              
                          <TableCell> <Trans id = "contacts_name"/> </TableCell>              
                          <TableCell> <Trans id = "created_on"/> </TableCell>              
                          <TableCell> <Trans id = "status__2"/> </TableCell>              
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        this.props.contacts.length > 0 && this.props.contacts.map((contact, index) => (
                          <TableRow key = {index} >
                              <TableCell>
                                <Checkbox 
                                    onChange = {(e)=>{this.setContactsIds(e, contact._id)}}
                                    checked = {this.state.selectedPhonIds.has(contact._id)?true:false}
                                >
                                </Checkbox>
                              </TableCell>
                              <TableCell>
                                <img src={"/media/flag1/"+ contact.tariff.country.code +".svg"} alt="image"  />
                                {
                                  "+" + contact.phone_number
                                }
                              </TableCell>
                              <TableCell>
                               {
                                 contact.name?contact.name:"--"
                               }
                              </TableCell>
                              <TableCell>
                                {
                                  contact.created_at
                                }
                              </TableCell>
                              <TableCell>
                                {
                                  contact.phonenumber && contact.phonenumber.campaign.campaign_name && contact.phonenumber.last_called_at && (
                                    <React.Fragment>
                                     <Trans id = "called_on"/>
                                     <span>{" "+contact.phonenumber.campaign.campaign_name+" "}</span>
                                      <Trans id = "compose_step_3_on" />
                                      <span>{" "+ contact.phonenumber.last_called_at}</span>
                                    </React.Fragment>
                                  )
                                }
                                {
                                   !contact.phonenumber && (
                                      <div>---</div>
                                   )
                                }
                              </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                </Table>
              </div>  
              <div className = "contacts-table-loading-spider-view">
              {
                this.props.contact_loading==true?(
                  <Spinner animation="border" variant="primary" size = "lg"/>
                ):(
                  null
                )
              }
              {
                this.props.contact_loading == true && this.props.currentContactPageIndex == 0? (
                   null
                ):(
                  <React.Fragment>
                    {
                      !this.props.contact_loading && this.props.contacts.length < this.props.allContactsOfGroupCount && (
                        <ArrowDownIcon className = "arrow-down-icon" onClick = {this.getMore}/>
                      )
                    }
                    <div className = "contacts-info-show">
                      <Trans id = "page_counter_showing_1"/> {this.props.contacts.length} <Trans id = "pagination_of"/> {this.props.allContactsOfGroupCount} <Trans id = "page_counter_items_1"/>
                    </div>
                  </React.Fragment>
                )
              }
              
            </div>  
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant = "contained" onClick={()=>{
                this.props.Actions.clearContacts();
                this.props.Actions.hideModal();
              }}>
                <Trans id = "close"/>
            </Button>
          </ModalFooter>
      </Modal>
    
    );
  }
}

export default connect(
  state => ({
      ...state.phoneBook
    }),
   dispatch => ({
       Actions: bindActionCreators(
           { getContacts,clearContacts, hideModal },
           dispatch
       )
   })
 )(ShowGroupInfoModal);;
