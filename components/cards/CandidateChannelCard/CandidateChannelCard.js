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
            <span className={'CandidateChannelCard-authVerify'}>通過</span>
            :
            <span className={'CandidateChannelCard-authWait'}>等待</span>
          }
        </div>
        <div className={'CandidateChannelCard-userZone'}>
          <img src={candidateChannelInfo.userPicture} className={'CandidateChannelCard-userPicture'}/>
          <section className={'CandidateChannelCard-Info'}>
            <div>
              <span>{candidateChannelInfo.userName}</span>
              <span> {hours}小時前申請</span>
            </div>
            <p>{candidateChannelInfo.userDescription || '這傢伙似乎沒有留下任何介紹'}</p>
          </section>
        </div>
        <div className={'CandidateChannelCard-channelZone'}>
          <a href={'https://www.youtube.com/channel/' + candidateChannelInfo._id} target={'_blank'}>
            <h3 className={'CandidateChannelCard-channelZoneTitle'}>{candidateChannelInfo.title}</h3>
          </a>
          <figure className={'CandidateChannelCard-channelImg'}>
            <img src={candidateChannelInfo.defaultThumbnails} className={'CandidateChannelCard-userPicture'}/>
          </figure>
          <p>{candidateChannelInfo.description || '此頻道沒有介紹...'}</p>
          <div className={'CandidateChannelCard-statisticZone'}>
            <section className={'CandidateChannelCard-statistic'}>
              <h3 className={'CandidateChannelCard-statItem'}>訂閱數 {candidateChannelInfo.subscriberCount.toLocaleString()}</h3>
              <h3 className={'CandidateChannelCard-statItem'}>觀看數 {candidateChannelInfo.viewCount.toLocaleString()}</h3>
            </section>
            <section className={'CandidateChannelCard-statistic'}>
              <h3 className={'CandidateChannelCard-statItem'}>影片數 {candidateChannelInfo.videoCount.toLocaleString()}</h3>
              <h3 className={'CandidateChannelCard-statItem'}>評論數 {candidateChannelInfo.commentCount.toLocaleString()}</h3>
            </section>
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
