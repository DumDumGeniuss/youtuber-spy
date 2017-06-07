import React from 'react';
import PropTypes from 'prop-types';

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

  render() {
    const channelInfo = this.props.channelInfo;
    return (
      <div className={'zone'}>
        <style jsx>{`
          .zone {
            position: relative;
            display: inline-block;
            width: 200px;
            height: 300px;
            border: 1px solid #e9ebee;
            margin-bottom: -6px;
            overflow: hidden;
          }

          .contentZone {
            display: flex;
            margin-left: -100%;
            width: 200%;
            height: 100%;
            transition: all 1s;
          }

          .contentZone:hover {
            margin-left: 0;
          }

          .hiddenZone {
            display: flex;
            width: 50%;
            height: 100%;
            justify-content: space-around;
            flex-direction: column;
            overflow: hidden;
          }

          .hiddenZone > .seeDetail {
            display: inline-block;
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #b31217;
            color: white;
            transition: all 0.2s;
          }

          .hiddenZone > .seeDetail:hover {
            background-color: #e62117;
            cursor: pointer;
          }

          .frontZone {
            width: 50%;
            height: 100%;
            padding: 10px;
          }

          .frontZone > div {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
          }

          .frontZone > .rank {
            height: 14%;
            font-size: 1.2em;
          }

          .frontZone > .img {
            height: 30%;
          }

          .frontZone > .img > img {
            height: 100%
          }

          .frontZone > .data {
            height: 14%;
          }

          @media (max-width: 800px) {
            .zone {
              width: 50vw;
              height: 50vw;
            }
          }
        `}</style>
        <div className={'contentZone'}>
          <div className={'hiddenZone'}>
            <div className={'g-ytsubscribe'} data-layout={'full'} data-channelid={channelInfo.id}></div>
            <span className={'seeDetail'}>看更多</span>
          </div>
          <div className={'frontZone'}>
            <div className={'rank'}><b>{this.props.rank}</b></div>
            <div className={'data'}>{channelInfo.title}</div>
            <div className={'img'}><img src={channelInfo.defaultThumbnails}/></div>
            <div className={'data'}>訂閱 {channelInfo.subscriberCount}</div>
            <div className={'data'}>影片 {channelInfo.videoCount}</div>
            <div className={'data'}>觀看 {channelInfo.viewCount}</div>
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
