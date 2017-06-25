import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Link from 'next/link';

import stylesheet from './YoutubeVideoCard.scss';

class YoutubeVideoCard extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const videoInfo = this.props.videoInfo;
    const publishedAt = moment(new Date(videoInfo.publishedAt)).format('YYYY-MM-DD HH:mm');

    return (
      <div className={'YoutubeVideoCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <style jsx>{`
        `}</style>
        <figure className={'YoutubeVideoCard-imgDiv'}>
            <img src={videoInfo.mediumThumbnails} />
        </figure>
        <section className={'YoutubeVideoCard-infoDiv'}>
          <h3><a target="_blank" href={`https://www.youtube.com/watch?v=${videoInfo._id}`}>{videoInfo.title}</a></h3>
          <h4>
            <Link href={'/channel?channelId=' + videoInfo.channelId}>
              <a>{videoInfo.channelTitle}</a>
            </Link>
          </h4>
          <h4>觀看 {videoInfo.viewCount.toLocaleString()}</h4>
          <h4>時間 {publishedAt}</h4>
          <p className={'YoutubeVideoCard-description'}>{videoInfo.description.substring(0, 50) + '...'}</p>
        </section>
      </div>
    );
  }
}

YoutubeVideoCard.PropTypes = {
  videoInfo: PropTypes.object,
};

export default YoutubeVideoCard;
