import React from 'react';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { TableRow } from '@material-ui/core';
//import Components;
import ActionButton from './components/actionButton/actionButton';
import './templatesTable.scss';

import {templateData} from '../../templatesData';
class TemplatesTable extends React.Component{
    constructor(props)
    {
        super(props);
        
    }
    render(){
        const Data = templateData.resource.files;   
        const count = Data.length;
        const total_templates_count = templateData.resource.total_templates_count;
        return(
            <React.Fragment>
            <div className = "templates-table-area"> 
                <div className = "wraper">
                    {
                        Data.map((file, index) =>(
                            <div className = "template-item" key = {index}>
                                <div className="des-bar">
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className = "cell strong">Type:</TableCell>
                                                <TableCell className = "cell ">{file.type}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className = "cell strong">Created:</TableCell>
                                                <TableCell className = "cell">{file.created_at}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className = "cell strong">Length:</TableCell>
                                                <TableCell className = "cell">{file.length}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className = "title-bar">
                                    {file.tts_text}
                                </div>
                                <div className = "action-bar">
                                    <ActionButton 
                                        color = "gray"
                                        hoverColor = "blue"
                                        defaultBackgroundColor = "white"
                                        hoverBackgroundColor = "#ece2e2"
                                        tooltip_title = "play"
                                        iconName = "flaticon2-phone"
                                        file = {file}
                                    />
                                     <ActionButton 
                                        color = "gray"
                                        hoverColor = "blue"
                                        defaultBackgroundColor = "white"
                                        hoverBackgroundColor = "#ece2e2"
                                        tooltip_title = "send"
                                        iconName = "flaticon2-phone"
                                        file = {file}
                                    />
                                     <ActionButton 
                                        color = "gray"
                                        hoverColor = "red"
                                        defaultBackgroundColor = "white"
                                        hoverBackgroundColor = "#ece2e2"
                                        tooltip_title = "delete"
                                        iconName = "flaticon2-rubbish-bin-delete-button"
                                        file = {file}
                                    />
                                </div>
                            </div>
                        ))
                    }
                 </div>
            </div>
            <div className = "page-info">
                    showing <strong>{count}</strong>  of  <strong>{total_templates_count}</strong> items
            </div>
            </React.Fragment>
        )
    }
}
export default TemplatesTable;