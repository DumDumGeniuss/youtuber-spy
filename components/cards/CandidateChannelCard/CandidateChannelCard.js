import React from 'react';
import PropTypes from 'prop-types';

import stylesheet from './CandidateChannelCard.scss';

class YoutuberChannelCard extends React.Component {
  constructor(props) {
    super(props);

    this.onVerifyClick = this.onVerifyClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onVerifyClick(channelId) {
    return () => {
      this.props.clickVerify(channelId);
    };
  }

  onDeleteClick(channelId) {
    return () => {
      this.props.clickDelete(channelId);
    };
  }

  render() {
    const candidateChannelInfo = this.props.candidateChannelInfo;

    return (
      <div className={'CandidateChannelCard-zone'}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <div className={'CandidateChannelCard-authInfoZone'}>
          {
            this.props.isSuperUser && !candidateChannelInfo.isVerified ?
              <button onClick={this.onVerifyClick(candidateChannelInfo._id)}>確認</button>
              :
              null
          }
          {
            this.props.isSuperUser && !candidateChannelInfo.isVerified ?
              <button onClick={this.onDeleteClick(candidateChannelInfo._id)}>刪除</button>
              :
              null
          }
          {
            candidateChannelInfo.isVerified ?
              <span className={'CandidateChannelCard-authVerify'}>通過</span>
              :
              <span className={'CandidateChannelCard-authWait'}>等待</span>
          }
        </div>
        <div className={'CandidateChannelCard-channelZone'}>
          <a href={`https://www.youtube.com/channel/${candidateChannelInfo._id}`} target={'_blank'}>
            <h3 className={'CandidateChannelCard-channelZoneTitle'}>{candidateChannelInfo.title}</h3>
          </a>
          <figure className={'CandidateChannelCard-channelImg'}>
            <img alt={`youtuberspy channel ${candidateChannelInfo.title}`} src={candidateChannelInfo.defaultThumbnails} className={'CandidateChannelCard-userPicture'} />
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

YoutuberChannelCard.defaultProps = {
  isSuperUser: null,
};

YoutuberChannelCard.propTypes = {
  candidateChannelInfo: PropTypes.object.isRequired,
  isSuperUser: PropTypes.bool,
  clickVerify: PropTypes.func.isRequired,
  clickDelete: PropTypes.func.isRequired,
};

export default YoutuberChannelCard;
