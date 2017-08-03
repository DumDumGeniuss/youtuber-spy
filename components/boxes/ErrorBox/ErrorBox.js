import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import stylesheet from './ErrorBox.scss';

class ErrorBox extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(newProps) {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  render() {

    return (
      <div className={'ErrorBox-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <h1 className={'ErrorBox-message'}>喔喔，發現錯誤！ {this.props.status}</h1>
        <h2 className={'ErrorBox-message'}>{this.props.message}</h2>
        <Link href={'/'}><a>
          <span className={'ErrorBox-backToHome'}>回到首頁</span>
        </a></Link>
        <div className={'ErrorBox-logoZone'}>
          <img className={'ErrorBox-logo'} src={'/static/logo.png'}/>
        </div>
      </div>
    );
  }
}

export default ErrorBox;
