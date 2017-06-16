import React from 'react';
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
    this.userDescription = '';
  }

  componentDidMount() {
    // console.log(this.props.query);
  }

  componentWillUnmount() {
  }

  handleLinkChange(event) {
    this.link = event.target.value;
  }

  handleDescriptionChange(event) {
    this.userDescription = event.target.value;
  }

  _onClickYes() {
    if (this.props.isLoading) {
      return;
    }
    this.props.clickYes(this.link, this.userDescription);
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
              <input onChange={this.handleLinkChange.bind(this)}/>
            </div>
            <div className={'ChannelInputModal-itemTitle'}>描述</div>
            <div className={'ChannelInputModal-itemInput'}>
              <textarea onChange={this.handleDescriptionChange.bind(this)} rows={'3'}/>
            </div>
          </div>
          <div className={'ChannelInputModal-func'}>
            <span onClick={this._onClickYes.bind(this)}>{this.props.isLoading ? <FaCircleONotch/> : '繼續'}</span>
            <span onClick={this._onClickNo.bind(this)}>{this.props.isLoading ? <FaCircleONotch/> : '取消'}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ChannelInputModal;
