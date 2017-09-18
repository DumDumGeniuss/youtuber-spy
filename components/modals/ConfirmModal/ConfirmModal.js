import React from 'react';
import PropTypes from 'prop-types';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import stylesheet from './ConfirmModal.scss';

class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this._onClickYes = this._onClickYes.bind(this);
    this._onClickNo = this._onClickNo.bind(this);
  }

  _onClickYes() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickYes();
  }

  _onClickNo() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickNo();
  }

  render() {
    return (
      <div className={this.props.show ? 'ConfirmModal-zone' : 'ConfirmModal-invisible'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'ConfirmModal-contentZone'}>
          <div className={'ConfirmModal-info'}>
            <span>{this.props.message}</span>
          </div>
          <div className={'ConfirmModal-func'}>
            <span onClick={this._onClickYes} role={'button'} tabIndex={0}>{this.props.isLoading ? <FaCircleONotch /> : '繼續'}</span>
            <span onClick={this._onClickNo} role={'button'} tabIndex={0}>{this.props.isLoading ? <FaCircleONotch /> : '取消'}</span>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  clickYes: PropTypes.func.isRequired,
  clickNo: PropTypes.func.isRequired,
};

export default ConfirmModal;
