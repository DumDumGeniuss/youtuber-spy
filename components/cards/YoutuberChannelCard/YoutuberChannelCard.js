import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import stylesheet from './YoutuberChannelCard.scss';

class YoutuberChannelCard extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

            // <div className={'g-ytsubscribe'} data-layout={'full'} data-channelid={channelInfo._id}></div>
  render() {
    const channelInfo = this.props.channelInfo;
    const publishedAt = new Date(this.props.channelInfo.publishedAt);
    const month = moment().diff(publishedAt, 'months');

    return (
      <div className={'YoutuberChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <style jsx>{``}</style>
        <div className={'YoutuberChannelCard-contentZone'}>
          <div className={'YoutuberChannelCard-hiddenZone'}>
            <span>介紹</span>
            <div className={'YoutuberChannelCard-description'}>{channelInfo.description || '沒有介紹'}</div>
            <span className={'YoutuberChannelCard-seeDetail'}>看更多</span>
          </div>
          <div className={'YoutuberChannelCard-frontZone'}>
            <div className={'YoutuberChannelCard-img'}><img src={channelInfo.defaultThumbnails}/></div>
            <div className={'YoutuberChannelCard-data'}>{channelInfo.title}</div>
            <div className={'YoutuberChannelCard-data'}><small>訂閱 {channelInfo.subscriberCount}</small></div>
            <div className={'YoutuberChannelCard-data'}><small>影片 {channelInfo.videoCount}</small></div>
            <div className={'YoutuberChannelCard-data'}><small>觀看 {channelInfo.viewCount}</small></div>
            <div className={'YoutuberChannelCard-data'}><small>成立時間 {parseInt(month/12, 10) + '年' + month%12 + '月'}</small></div>
          </div>
        </div>
      </div>
    );
  }
}

YoutuberChannelCard.PropTypes = {
  channelInfo: PropTypes.object,
  rank: PropTypes.number,
};

export default YoutuberChannelCard;
