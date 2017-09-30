import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import stylesheet from './YoutubeVideoCard.scss';

class YoutubeVideoCard extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const videoInfo = this.props.videoInfo;
    const publishedAt = moment(new Date(videoInfo.publishedAt)).format('YYYY-MM-DD HH:mm');
    const i18nWords = this.props.i18nWords;

    return (
      <div className={'YoutubeVideoCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <style jsx>{`
        `}</style>
        <figure className={'YoutubeVideoCard-imgDiv'}>
          <img alt={`youtuberspy video ${videoInfo.title}`} src={videoInfo.mediumThumbnails} />
        </figure>
        <section className={'YoutubeVideoCard-infoDiv'}>
          <h3>
            <Link href={`/videos/singleVideo?videoId=${videoInfo._id}`}><a>
              {videoInfo.title}
            </a></Link>
          </h3>
          <h4>
            <Link href={`/channels/singleChannel?channelId=${videoInfo.channelId}`}><a>
              {videoInfo.channelTitle}
            </a></Link>
          </h4>
          <h4>{i18nWords && i18nWords.view} {videoInfo.viewCount.toLocaleString()}</h4>
          <h4>{i18nWords && i18nWords.time} {publishedAt}</h4>
          <p className={'YoutubeVideoCard-description'}>{`${videoInfo.description.substring(0, 50)}...`}</p>
        </section>
      </div>
    );
  }
}

YoutubeVideoCard.propTypes = {
  videoInfo: PropTypes.object.isRequired,
  i18nWords: PropTypes.object.isRequired,
};

export default YoutubeVideoCard;
