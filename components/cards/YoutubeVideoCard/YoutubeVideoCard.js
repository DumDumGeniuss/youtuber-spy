import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
        <div className={'YoutubeVideoCard-imgDiv'}>
            <img src={videoInfo.mediumThumbnails} />
        </div>
        <div className={'YoutubeVideoCard-infoDiv'}>
          <h3><a target="_blank" href={`https://www.youtube.com/watch?v=${videoInfo._id}`}>{videoInfo.title}</a></h3>
          <div><a target="_blank" href={`https://www.youtube.com/channel/${videoInfo.channelId}`}>{videoInfo.channelTitle}</a></div>
          <div>觀看 {videoInfo.viewCount.toLocaleString()}</div>
          <div>時間 {publishedAt}</div>
          <div className={'YoutubeVideoCard-description'}>{videoInfo.description.substring(0, 50) + '...'}</div>
        </div>
      </div>
    );
  }
}

YoutubeVideoCard.PropTypes = {
  videoInfo: PropTypes.object,
};

export default YoutubeVideoCard;
