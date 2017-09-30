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
    const i18nWords = this.props.i18nWords;

    return (
      <div className={'YoutuberChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Link href={`/channels/singleChannel?channelId=${channelInfo._id}`}><a>
          <div className={'YoutuberChannelCard-frontZone'}>
            <figure className={'YoutuberChannelCard-img'}><img alt={`youtuber channel ${channelInfo.title}`} src={channelInfo.defaultThumbnails} /></figure>
            <h2 className={'YoutuberChannelCard-title'}><b>{`${channelInfo.rank}.${channelInfo.title}`}</b></h2>
            <div className={'YoutuberChannelCard-dataZone'}>
              <h2 className={'YoutuberChannelCard-data'}><small>
                {i18nWords.subscriber}
                &nbsp;
                {channelInfo.subscriberCount && channelInfo.subscriberCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>
                {i18nWords.video}
                &nbsp;
                {channelInfo.videoCount && channelInfo.videoCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>
                {i18nWords.view} {channelInfo.viewCount && channelInfo.viewCount.toLocaleString()}
              </small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>{i18nWords.category} {channelInfo.category || '無'}</small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>{i18nWords.country} {channelInfo.country || '無'}</small></h2>
              <h2 className={'YoutuberChannelCard-data'}><small>{i18nWords.createTime} {`${parseInt(month / 12, 10)}${i18nWords.years}${month % 12}${i18nWords.months}`}</small></h2>
            </div>
          </div>
        </a></Link>
      </div>
    );
  }
}

YoutuberChannelCard.propTypes = {
  channelInfo: PropTypes.object.isRequired,
  i18nWords: PropTypes.object.isRequired,
};

export default YoutuberChannelCard;
