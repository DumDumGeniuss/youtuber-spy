import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
      <div className={'zone'}>
        <style jsx>{`
          .zone {
            position: relative;
            display: inline-block;
            width: 200px;
            height: 250px;
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

          .hiddenZone > .description {
            height: 60%;
            overflow: scroll;
            border-bottom: 1px solid #e9ebee;
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

          .frontZone > .img {
            height: 44%;
          }

          .frontZone > .img > img {
            height: 100%
          }

          .frontZone > .data {
            height: 11%;
          }

          .frontZone > .data > small {
            font-size: 0.8em;
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
            <span>介紹</span>
            <div className={'description'}>{channelInfo.description || '沒有介紹'}</div>
            <span className={'seeDetail'}>看更多</span>
          </div>
          <div className={'frontZone'}>
            <div className={'img'}><img src={channelInfo.defaultThumbnails}/></div>
            <div className={'data'}>{channelInfo.title}</div>
            <div className={'data'}><small>訂閱 {channelInfo.subscriberCount}</small></div>
            <div className={'data'}><small>影片 {channelInfo.videoCount}</small></div>
            <div className={'data'}><small>觀看 {channelInfo.viewCount}</small></div>
            <div className={'data'}><small>成立時間 {parseInt(month/12, 10) + '年' + month%12 + '月'}</small></div>
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
