import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
      <div className={'zone'}>
        <style jsx>{`
          .zone {
            position: relative;
            width: 100%;
            height: 150px;
            border: 1px solid #e9ebee;
          }

          .imgDiv {
            display: inline-flex;
            width: 35%;
            height: 100%;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            vertical-align: text-top;
          }

          .imgDiv > img {
            height: 90%;
          }

          .infoDiv {
            padding: 10px;
            display: inline-block;
            width: 65%;
            height: 100%;
            vertical-align: text-top;
          }

          @media (max-width: 800px) {
            .zone {
              height: 120px;
            }

            .imgDiv {
              width: 30%;
            }

            .infoDiv {
              width: 60%;
            }

            .infoDiv > .description {
              display: none;
            }
          }
        `}</style>
        <div className={'imgDiv'}>
          <img src={videoInfo.mediumThumbnails} />
        </div>
        <div className={'infoDiv'}>
          <h1><a target="_blank" href={`https://www.youtube.com/watch?v=${videoInfo._id}`}>{videoInfo.title}</a></h1>
          <div><a target="_blank" href={`https://www.youtube.com/channel/${videoInfo.channelId}`}>{videoInfo.channelTitle}</a></div>
          <div>觀看 {videoInfo.viewCount}</div>
          <div>時間 {publishedAt}</div>
          <div className={'description'}>{videoInfo.description.substring(0, 50) + '...'}</div>
        </div>
      </div>
    );
  }
}

YoutubeVideoCard.PropTypes = {
  videoInfo: PropTypes.object,
};

export default YoutubeVideoCard;
