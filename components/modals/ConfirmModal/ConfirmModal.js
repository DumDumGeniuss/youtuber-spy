import React from 'react';

import stylesheet from './ConfirmModal.scss';

class ConfirmModal extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }

  componentDidMount() {
    // console.log(this.props.query);
  }

  componentWillUnmount() {
  }

  _onClickYes() {
    this.props.clickYes();
  }

  _onClickNo() {
    this.props.clickNo();
  }

  render() {
    return (
      <div className={'ConfirmModal-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'ConfirmModal-contentZone'}>
          <div className={'ConfirmModal-info'}>
            <span>{this.props.message}</span>
          </div>
          <div className={'ConfirmModal-func'}>
            <span onClick={this._onClickYes.bind(this)}>繼續</span>
            <span onClick={this._onClickNo.bind(this)}>取消</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmModal;
