import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import stylesheet from './YoutuberChannelCard.scss';

class YoutuberChannelCard extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const channelInfo = this.props.channelInfo;
    const publishedAt = new Date(this.props.channelInfo.publishedAt);
    const month = moment().diff(publishedAt, 'months');

    return (
      <div className={'YoutuberChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Link href={`/channels/singleChannel?channelId=${channelInfo._id}`}><a>
          <div className={'YoutuberChannelCard-frontZone'}>
            <figure className={'YoutuberChannelCard-img'}><img alt={`youtuber channel ${channelInfo.title}`} src={channelInfo.defaultThumbnails} /></figure>
            <h2 className={'YoutuberChannelCard-title'}><b>{`${channelInfo.rank}.${channelInfo.title}`}</b></h2>
            <div className={'YoutuberChannelCard-dataZone'}>
              <h2 className={'YoutuberChannelCard-data'}><small>
                訂閱 {channelInfo.subscriberCount && channelInfo.subscriberCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>
                影片 {channelInfo.videoCount && channelInfo.videoCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>
                觀看 {channelInfo.viewCount && channelInfo.viewCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>種類 {channelInfo.category || '無'}</small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>地區 {channelInfo.country || '無'}</small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>成立 {`${parseInt(month / 12, 10)}年${month % 12}個月`}</small></h2>
            </div>
          </div>
        </a></Link>
      </div>
    );
  }
}

YoutuberChannelCard.propTypes = {
  channelInfo: PropTypes.object.isRequired,
};

export default YoutuberChannelCard;
