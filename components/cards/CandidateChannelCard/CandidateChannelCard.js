import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import stylesheet from './CandidateChannelCard.scss';

import Search from 'react-icons/lib/fa/search';

class YoutuberChannelCard extends React.Component {
  static getInitialProps({ isServer }) {
    return {
      isServer,
    };
  }

  componentDidMount() {
  }

  onVerifyClick(channelId) {
    this.props.clickVerify(channelId);
  }

  componentWillUnmount() {
  }

  render() {
    const candidateChannelInfo = this.props.candidateChannelInfo;
    const addTime = new Date(this.props.candidateChannelInfo.addTime);
    const hours = moment().diff(addTime, 'hours');

    return (
      <div className={'CandidateChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'CandidateChannelCard-authInfoZone'}>
          {this.props.isSuperUser && !candidateChannelInfo.isVerified ? <button onClick={this.onVerifyClick.bind(this, candidateChannelInfo._id)}>確認</button> : null}
          {candidateChannelInfo.isVerified ? 
            <span className={'CandidateChannelCard-authVerify'}>審核通過</span>
            :
            <span className={'CandidateChannelCard-authWait'}>等待審核</span>
          }
        </div>
        <div className={'CandidateChannelCard-userZone'}>
          <img src={candidateChannelInfo.userPicture} className={'CandidateChannelCard-userPicture'}/>
          <div className={'CandidateChannelCard-Info'}>
            <div>
              <span>{candidateChannelInfo.userName}</span>
              <span> {hours}小時前申請</span>
            </div>
            <p>{candidateChannelInfo.userDescription || '這傢伙似乎沒有留下任何介紹'}</p>
          </div>
        </div>
        <div className={'CandidateChannelCard-channelZone'}>
          <h3>{candidateChannelInfo.title}</h3>
          <div className={'CandidateChannelCard-channelImg'}>
            <img src={candidateChannelInfo.defaultThumbnails} className={'CandidateChannelCard-userPicture'}/>
          </div>
          <p>{candidateChannelInfo.description || '此頻道沒有介紹...'}</p>
          <div className={'CandidateChannelCard-statisticZone'}>
            <div className={'CandidateChannelCard-statistic'}>
              <div>訂閱數 {candidateChannelInfo.subscriberCount}</div>
              <div>觀看數 {candidateChannelInfo.viewCount}</div>
            </div>
            <div className={'CandidateChannelCard-statistic'}>
              <div>影片數 {candidateChannelInfo.videoCount}</div>
              <div>評論數 {candidateChannelInfo.commentCount}</div>
            </div>
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
