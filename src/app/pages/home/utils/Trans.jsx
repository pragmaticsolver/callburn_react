import React from 'react';
import { FormattedMessage, injectIntl, intlShape  } from "react-intl";
export class Trans extends React.Component{
    render(){
        return(
            <FormattedMessage id = {this.props.id} name = {this.props.name} />
        )
    }
}

export default Trans;