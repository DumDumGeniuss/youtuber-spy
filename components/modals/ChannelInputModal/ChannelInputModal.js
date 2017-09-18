import React from 'react';
import PropTypes from 'prop-types';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import stylesheet from './ChannelInputModal.scss';

class ChannelInputModal extends React.Component {
  static getInitialProps({ query }) {
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.link = '';

    this.handleLinkChange = this.handleLinkChange.bind(this);
    this._onClickYes = this._onClickYes.bind(this);
    this._onClickNo = this._onClickNo.bind(this);
  }

  componentDidMount() {
    // console.log(this.props.query);
  }

  componentWillUnmount() {
  }

  handleLinkChange(event) {
    this.link = event.target.value;
  }

  _onClickYes() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickYes(this.link);
  }

  _onClickNo() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickNo();
  }

  render() {
    return (
      <div className={'ChannelInputModal-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'ChannelInputModal-contentZone'}>
          <div className={'ChannelInputModal-info'}>
            <span>{this.props.message}</span>
          </div>
          <div className={'ChannelInputModal-inputZone'}>
            <div className={'ChannelInputModal-itemTitle'}>連結</div>
            {this.props.errorMessage ?
              <div className={'ChannelInputModal-errorMessage'}>{this.props.errorMessage}</div> : null}
            <div className={'ChannelInputModal-itemInput'}>
              <input onChange={this.handleLinkChange} />
            </div>
          </div>
          <div className={'ChannelInputModal-func'}>
            <span onClick={this._onClickYes} role={'button'} tabIndex={0}>{this.props.isLoading ? <FaCircleONotch /> : '繼續'}</span>
            <span onClick={this._onClickNo} role={'button'} tabIndex={0}>{this.props.isLoading ? <FaCircleONotch /> : '取消'}</span>
          </div>
        </div>
      </div>
    );
  }
}

ChannelInputModal.propTypes = {
  message: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  clickYes: PropTypes.func.isRequired,
  clickNo: PropTypes.func.isRequired,
};

ChannelInputModal.defaultProps = {
  errorMessage: '',
};

export default ChannelInputModal;
