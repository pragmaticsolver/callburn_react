import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {toastr} from 'react-redux-toastr';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Radio} from '@material-ui/core';
import {DropdownButton, Dropdown, Form, Spinner} from 'react-bootstrap';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { uploadNumbersFirst ,phoneNumberText, validateNumbers, uploadPhoneNumbers, getAllGroups} from '../../../../../../../store/app_services/phoneBook/phoneBookApi';
import Trans from '../../../../../utils/Trans';
import './importStepper.scss';
const transIds = {
  "name":"addressbook_import_contact_name",
  "phone": "addressbook_import_contact_phonenumber",
  "group": "addressbook_import_contact_group"
}
const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    // marginTop: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
  },
  
});
function range(start, end) {
  var ans = [];
  for (let i = start; i <= end; i++) {
      ans.push(i);
  }
  return ans;
}
function getSteps() {
  return ['<b>Choose import method</b>',
          '<b>Preview and data setup</b>',
          '<b>Complete the import</b>',
        ];
}
function getStepContent(step, selectedMethod, _that) {
  switch (step) {
    case 0:
      return(
        <Typography className = "import-step-area" component={'div'}>
            <Typography className = "import-step-title" component={'div'}>
            </Typography>
            <br/>
            <Typography className = "import-step-body" component={'div'}>
                <div className = "select-method-section">
                    <div className = "select-buttons">
                        <RadioGroup
                            aria-label="selectedMethod"
                            name="selectedMethod"
                            value={selectedMethod}
                            onChange={(event)=>{
                                _that.setState({
                                    selectedMethod:event.target.value,
                                    contact: [],
                                    contacts1: []
                                })
                            }}
                            style = {{width:"100%"}}
                        >
                            <div className = "item"> <FormControlLabel disabled value="a" control={<Radio />} label={(<Trans id = "mobile_upload_title"/>)} /></div>
                            <div className = "item"><FormControlLabel value="fileUpload" control={<Radio />} label={(<Trans id = "file_upload_title"/>)} /></div>
                            <div className = "item"><FormControlLabel value="manually" control={<Radio />} label={(<Trans id = "manually_title"/>)}  /></div>
                        </RadioGroup>
                    </div>
                    <div className = "import-content">
                        <div style = {{width:"100%"}}>
                            {selectedMethod === "fileUpload"?(
                                <div>
                                    <p>
                                        <Trans id = "addressbook_import_you_can_batch_add_your_contacts"/>
                                        <Trans id = "addressbook_import_phonenumber_should_contain"/> . , : | 
                                    </p>
                                    <h4>
                                        (.XLS, .XLSX, .CSV, .TXT) <br/>
                                    <Trans id = "addressbook_import_contact_drag_and_drop_feature"/>
                                    </h4>
                                    <input type = "file" style = {{display:"inline-block"}} onChange = {_that.uploadFun} ref = {input => _that.uploadInputRef = input} style = {{display:"none"}}/>
                                    <Button variant = "contained" color="default" onClick = {_that.trigerUpload}>
                                    {
                                      _that.state.uploadLoading === true ? (
                                        <Spinner animation = "border"/>
                                      ):( <Trans id = "addressbook_import_contact_choose_file"/>)
                                    }
                                    </Button>
                                    &nbsp;
                                    {
                                      _that.state.originalFileName ? _that.state.originalFileName : ""
                                    }
                                    
                                </div>
                            ):(
                                <div>
                                    <p>
                                    <Trans id = "addressbook_import_contact_recipients_or_past"/>
                                    </p>
                                    <h4>
                                        <Trans id = "campaign_compose_compose_step_2_phonenumbers"/>
                                    </h4>
                                    <textarea style = {{width:"100%"}}
                                      onChange = {_that.changePhoneNumberText}
                                      value = {_that.state.text}
                                    />
                                </div>
                            )}
                            <div>

                            </div>
                        </div>

                    </div>
                    <div className = "delimiter-area">
                        <strong>DELIMITER:</strong> &nbsp;&nbsp;
                        <div onClick = {()=>_that.setDelimiter("automatic")} className = {_that.state.selectDelimiter === "automatic" ? "delimiter-button-item selected" : "delimiter-button-item"}><Trans id = "automatic"/></div>
                        <div onClick = {()=>_that.setDelimiter(",")}         className = {_that.state.selectDelimiter === "," ? "delimiter-button-item selected" : "delimiter-button-item"}>,</div>
                        <div onClick = {()=>_that.setDelimiter(";")}         className = {_that.state.selectDelimiter === ";" ? "delimiter-button-item selected" : "delimiter-button-item"}>;</div>
                        <div onClick = {()=>_that.setDelimiter("|")}         className = {_that.state.selectDelimiter === "|" ? "delimiter-button-item selected" : "delimiter-button-item"}>|</div>
                    </div>          
                </div>
            </Typography>
        </Typography>
      );
    case 1:
        return(
            <Typography className = "import-step-area" component={'div'}>
                <Typography className = "import-step-title" component={'div'}>
                </Typography>
                <br/>
                <Typography className = "import-step-body" component={'div'}>
                   <Table size = "small">
                     <TableHead>
                      <TableRow>
                      {
                          range(0, _that.state.columnCount - 1).map((column, index) => (
                            <TableCell align = "center" key = {index}>
                               <DropdownButton
                                  alignRight
                                  title= {
                                      _that.state.columns[index].id === "" ? "--" : <Trans id = {transIds[_that.state.columns[index].id]}/>
                                  }
                                  variant="success"
                              >
                                   <Dropdown.Item  onClick = {()=>_that.changeColumns(index, "")}  >--</Dropdown.Item>
                                   <Dropdown.Item  onClick = {()=>_that.changeColumns(index, "name")} ><Trans id = "addressbook_import_contact_name"/></Dropdown.Item>
                                   <Dropdown.Item  onClick = {()=>_that.changeColumns(index, "phone")}  ><Trans id = "addressbook_import_contact_phonenumber"/></Dropdown.Item>
                                   <Dropdown.Item  onClick = {()=>_that.changeColumns(index, "group")}  ><Trans id = "addressbook_import_contact_group"/></Dropdown.Item>
                              </DropdownButton>
                            </TableCell>
                          ))
                      }
                      </TableRow>
                     </TableHead>
                     <TableBody>
                       {
                          _that.state.contacts.map((row, index) => (
                            <TableRow key = {`contacts-numbers-${index}`} className = {_that.state.ignoreFirstLine === true ? "firstLineIgnorded" : ""}>
                              {
                                 range(0,_that.state.columnCount-1).map((col, index1) => (
                                   <TableCell align = "center" key = {`contacts-number-column-${index}-${index1}`}>
                                      {
                                        row[index1]
                                      }
                                   </TableCell>
                                 ))
                              }
                            </TableRow>
                          ))
                       }
                     </TableBody>
                   </Table>
                   <div style = {{display:"flex", justifyContent:"center", alignItems:"center", padding:"20px"}}>
                     {
                        _that.state.contactsCount > _that.state.contacts.length ? (
                          <React.Fragment>
                           <span>{_that.state.contactsCount - _that.state.contacts.length}&nbsp;</span>
                           <Trans id = "more_contacts_hidden"/>
                           </React.Fragment>
                        ) : ( null )
                     }
                   </div>
                   <Form.Row style = {{display:"flex", alignItems:"center"}}>
                      <Checkbox checked = {_that.state.ignoreFirstLine} 
                          onChange = {(e)=>{
                              _that.setState({
                                ignoreFirstLine: e.target.checked,
                                contacts1: []
                              })
                      }}/>
                          <Form.Label style = {{marginBottom:"0"}} ><Trans id = "ignore_first_line"/></Form.Label>
                  </Form.Row>
                </Typography>
            </Typography>
    );
    case 2:
        return(
            <Typography className = "import-step-area" component={'div'}>
                <Typography className = "import-step-title" component={'div'}>
                </Typography>
                <br/>
                <Typography className = "import-step-body" component={'div'}>
                  {
                    _that.state.validateLoading === true ? (
                      <Spinner animation = "border"/>
                    ):(
                      <div>
                        <Table size = "small">
                            <TableHead>
                              <TableRow>
                                <TableCell align = "center"><Trans id = "addressbook_import_contact_phonenumber"/></TableCell>
                                <TableCell align = "center"><Trans id = "addressbook_import_contact_name"/></TableCell>
                                <TableCell align = "center"><Trans id = "addressbook_import_contact_group"/></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                _that.state.contacts1.map((contact, index) => (
                                  <TableRow key = {index}>
                                    <TableCell align = "left"> <img src={"/media/flag1/"+ contact.flag_code +".svg"} alt="image"  />+{contact.phone}</TableCell>
                                    <TableCell align = "center">{contact.name}</TableCell>
                                    <TableCell align = "center">{contact.group}</TableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                        </Table>
                        <div style = {{padding:"30px"}}>
                          <div style = {{textAlign:"center"}}>
                              <h4>Group Name:</h4>
                          </div>
                          <div>
                          <Form.Group controlId="exampleForm.ControlSelect1" style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <Radio
                                checked = {_that.state.selectedMethod === "selected_group"}
                                onChange = {(e)=>{
                                  _that.setState({
                                     selectedMethod: e.target.checked === true ? "selected_group" : _that.state.selectedMethod
                                  })
                                }}
                            />
                            <Form.Control as="select" style = {{width:"300px"}}
                              disabled = {_that.state.selectedMethod !== "selected_group"}
                              onChange = {(e)=>{
                                  _that.setState({
                                    selectedGroup:{
                                      id: e.target.value,
                                    }
                                  })
                              }}
                            >
                              {
                                _that.state.allGroups && _that.state.allGroups.map((group, index) => (
                                <option key = {`group-id-${index}`} value = {group.id} name = {group.label}>{group.label}</option>
                                ))
                              }
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="exampleForm.ControlSelect1" style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                            <Radio
                                checked = {_that.state.selectedMethod === "new_group"}
                                onChange = {(e)=>{
                                  _that.setState({
                                     selectedMethod: e.target.checked === true ? "new_group" : _that.state.selectedMethod
                                  })
                                }}
                            />
                            <Form.Control  style = {{width:"300px"}}
                              disabled = {_that.state.selectedMethod !== "new_group"}
                              type = "text"
                              placeholder = "or type the name of a new group"
                              onChange = {(e)=>{
                                _that.setState({
                                  groupName: e.target.value
                                })
                              }}
                              value = {_that.state.groupName}
                            >
                            </Form.Control>
                          </Form.Group>
                          </div>
                         
                        </div>
                      </div>
                    )
                  }
                </Typography>
            </Typography>
    );
    default:
      return 'Unknown step';
  }
}

class VerticalLinearStepper extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
        activeStep: 0,
        selectedMethod: "importSelect",
        selectDelimiter: "automatic",
        selectedMethod: "fileUpload",
        text: "",
        contacts: [],
        contacts1:[],
        uploadLoading: false,
        validateLoading: false,
        contactsCount: 0,
        columnCount: 0,
        originalFileName: "",
        fileName: "",
        delimiter: "",
        columns: [],
        ignoreFirstLine: false,
        allGroups: [],
        selectedGroup: {},
        groupName:""
      };
      this.typeSelect = this.typeSelect.bind(this);
      this.uploadInputRef = null;
  }
  changePhoneNumberText = (e) => {
    this.setState({
      text: e.target.value,
      contacts1: []
    })
  }
  async componentDidMount(){
     await getAllGroups().then(data=>{
       this.setState({
         allGroups: data.resource.groups,
         selectedGroup:{
           id: data.resource.groups[0].id
         }
       })
     })
  }
  uploadFun = (e) => {
     var formData = new FormData();
     formData.append('file', e.target.files[0]);
     var _columns = [];
     this.setState({
       uploadLoading: true
     })
     uploadNumbersFirst(formData).then((data) => {

       range(0, data.resource.columnsCount - 1).map((index) => {
          _columns.push(
            {
              id: '',
              name: '--'
            }
          )
       })
       this.setState({
         contacts: data.resource.rows,
         contactsCount:data.resource.total,
         columnCount: data.resource.columnsCount,
         originalFileName: data.resource.originalFileName,
         columns: _columns,
         fileName: data.resource.fileName,
         delimiter: data.resource.delimiter,
         uploadLoading: false
       })
     }).catch((error) => {
         this.setState({
           uploadLoading: false
         })
     }) 
  }
  setDelimiter = (_delimiter) => {
    this.setState({
      selectDelimiter: _delimiter
    })
  }
  changeColumns = (index, column) => {
    var _columns = this.state.columns;
    _columns[index].id = column;
    this.setState({
      columns: _columns
    })
  }
  
  handleNext = () => {
    if(this.state.validateLoading === true) return;
    if(this.state.activeStep === 0 && this.state.contacts.length === 0 && this.state.selectedMethod === "fileUpload") {
      toastr.warning("Please select file or type data manually")
      return;
    }
    if(this.state.selectedMethod === "manually" && this.state.text === "") {
      toastr.warning("Please type data manually")
      return;
    }
    if(this.state.activeStep === 0 && this.state.selectedMethod === "manually"){
      var params = {
        selectDelimiter: this.state.selectDelimiter,
        selector: "importSelect",
        selectGroup: "indicated_in_a_column",
        selectedGroup: {},
        groupName: "",
        columns: [],
        text: this.state.text,
        ignoreFirstLine: false,
        fileName: null,
        originalFileName: null,
      }
      var _columns = [];
      phoneNumberText(params).then(data => {
        range(0, data.resource.columnsCount - 1).map((index) => {
          _columns.push(
            {
              id: '',
              name: '--'
            }
          )
       })
        this.setState({
          contacts: data.resource.rows,
          contactsCount:data.resource.total,
          columnCount: data.resource.columnsCount,
          originalFileName: data.resource.originalFileName,
          columns: _columns,
          fileName: data.resource.fileName,
          delimiter: data.resource.delimiter
        })
      })
    }
    if( this.state.activeStep === 1 && this.state.contacts.length > 0 && this.state.contacts1.length === 0)
    {
      var _nameArray = this.state.columns.filter((column)=>column.id === "name");
      var _phoneArray = this.state.columns.filter((column)=>column.id === "phone");
      var _groupArray = this.state.columns.filter((column)=>column.id === "group");
      if(_phoneArray.length === 0 ) { toastr.warning('You have to select a "Phone Number" column'); return;}
      // if(_nameArray.length === 0 ) { toastr.warning('You have to select a "Name" column'); return;}
      if(this.state.contacts && this.state.contacts[0] && this.state.contacts[0].length > 2 && _groupArray.length === 0){
        toastr.warning('You have to select a "Group" column'); return;
      }
      if(_groupArray.length > 1 ) { toastr.warning('You selected  "Group" column too much times'); return;}
      if(_phoneArray.length > 1 ) { toastr.warning('You selected  "Phone Number" column too much times'); return;}
      if(_nameArray.length > 1 ) { toastr.warning('You selected  "Name" column too much times'); return;}
       this.setState({
         validateLoading: true
       }, ()=>{
         var params = {
          ignoreFirstLine: this.state.ignoreFirstLine,
          columns: this.state.columns,
          contacts: this.state.contacts
         }
         validateNumbers(params).then((data) => {
           this.setState({
             validateLoading: false,
             contacts1: data.resource.contacts
           })
         }).catch(error => {
           this.setState({
             validateLoading: false,
             contacts1: []
           })
         })
       })
    }
    if(this.state.activeStep === 2)
    {
      var _groupArray = this.state.columns.filter((column)=>column.id === "group");
      var selectGroup = ""
      if(_groupArray.length === 0 )
      {
        if( (this.state.selectedMethod === "selected_group" && this.state.selectedGroup === {}) ||
            (this.state.selectedMethod === "new_group" && this.state.groupName === "")){
              toastr.warning('You have to select a Group');
              return;
        } else {
          selectGroup = this.state.selectedMethod
        }
      } else {
        selectGroup = "indicated_in_a_column"
      }
       var params = {
        selectDelimiter: this.state.selectDelimiter,
        selector: "importSelect",
        selectGroup: selectGroup,
        selectedGroup: this.state.selectedGroup,
        groupName: this.state.groupName,
        columns: this.state.columns,
        text: this.state.text,
        ignoreFirstLine: this.state.ignoreFirstLine,
        fileName: this.state.fileName,
        originalFileName: this.state.originalFileName,
        delimiter: this.state.delimiter
       }
       uploadPhoneNumbers(params).then(data => {
         this.props.history.push('/phonebook/group')
       })
    }
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    if(this.state.validateLoading === true) return;
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  typeSelect = (event) => {
  }
  checkDisable = () => {
    if(this.state.activeStep === 2 && this.props.validateLoading === true) return true;
    else return false;
  }
  stepLabel = (index) => {
    if( index === 0 )
    {
      return(
        <Trans id = "choose_file_or_text"/>
      )
    } else if (index === 1)
    {
      return (
      <Trans id = "choose_columns"/>
      )
    } else {
      return (
      <Trans id = "batch_import"/>
      )
    }
  }
  trigerUpload = () => {
     if(this.uploadInputRef)
     {
       this.uploadInputRef.click();
     }
  }
  render() {
    const { classes } = this.props;
    const   steps = getSteps();
    const { activeStep } = this.state;
    const _that = this;
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel >
              <span className = "import-step-label">{
                  this.stepLabel(index)
              }</span>
              </StepLabel>
              <StepContent style = {{overflowX:'auto'}}>
                <Typography  component = "div"            
                >{getStepContent(index, this.state.selectedMethod, _that)}
                </Typography>
                <div >
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      <Trans id = "back"/>
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                      disabled = {this.checkDisable()}
                    >
                      {activeStep === steps.length - 1 ? <Trans id = "import"/> : <Trans id = "next"/>}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} >
            {/* <Typography component={'div'}>All steps completed - you&apos;re finished</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button> */}
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

export default withRouter( withStyles(styles)(VerticalLinearStepper) );