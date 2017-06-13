import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import stylesheet from './YoutuberChannelCard.scss';

import Search from 'react-icons/lib/fa/search';

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
              // <a target={'_blank'} href={'https://www.youtube.com/channel/' + channelInfo._id}>
  render() {
    const channelInfo = this.props.channelInfo;
    const publishedAt = new Date(this.props.channelInfo.publishedAt);
    const month = moment().diff(publishedAt, 'months');

    return (
      <div className={'YoutuberChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'YoutuberChannelCard-frontZone'}>
          <div className={'YoutuberChannelCard-img'}><img src={channelInfo.defaultThumbnails}/></div>
          <div className={'YoutuberChannelCard-title'}><b>{channelInfo.title}</b></div>
          <div className={'YoutuberChannelCard-data'}><small>訂閱 {channelInfo.subscriberCount.toLocaleString()}</small></div>
          <div className={'YoutuberChannelCard-data'}><small>影片 {channelInfo.videoCount.toLocaleString()}</small></div>
          <div className={'YoutuberChannelCard-data'}><small>觀看 {channelInfo.viewCount.toLocaleString()}</small></div>
          <div className={'YoutuberChannelCard-data'}><small>成立時間 {parseInt(month/12, 10) + '年' + month%12 + '個月'}</small></div>
        </div>
        <a target={'_blank'} href={'https://www.youtube.com/channel/' + channelInfo._id}>
          <div className={'YoutuberChannelCard-seeDetailIcon'}>
            <Search />
          </div>
        </a>
      </div>
    );
  }
}

YoutuberChannelCard.PropTypes = {
  channelInfo: PropTypes.object,
  rank: PropTypes.number,
};

export default YoutuberChannelCard;
