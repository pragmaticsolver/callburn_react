import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
class Demo extends Component {
  render() {
   const { formatMessage } = this.props.intl;
   return false;
  }
}
export default injectIntl(Demo);