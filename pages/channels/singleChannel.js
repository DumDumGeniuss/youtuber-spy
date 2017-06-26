import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import { initStore } from '../../store/initStore';
import * as channelAction from '../../actions/channel';
import * as channelApi from '../../apis/channel';
import * as videoApi from '../../apis/video';


import stylesheet from './singleChannel.scss';

// localStorage.setItem('state', 'off');
class SingleChannel extends React.Component {
  static async getInitialProps({ query, store }) {
    const videoQueryNewest = {
      page: 1,
      count: 5,
      sort: 'publishedAt',
      channelId: query.channelId,
    };
    const videoQueryHottest = {
      page: 1,
      count: 5,
      sort: 'viewCount',
      channelId: query.channelId,
    };

    const results = await Promise.all([
      channelApi.getChannel(query.channelId),
      videoApi.getAllVideos(videoQueryNewest),
      videoApi.getAllVideos(videoQueryHottest)
    ]);
    const channelResult = results[0];
    store.dispatch(channelAction.getChannel(channelResult.data, channelResult.token));

    const videoNewestResult = results[1];
    const videoHottestResult = results[2];

    return {
      hottestVideos: videoHottestResult.datas,
      newestVideos: videoNewestResult.datas,
      query, 
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const fullSiteUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
    console.log(fullSiteUrl, window.location.href);
    // this.props.getChannelAsync(this.props.query.channelId);
  }

  componentWillReceiveProps(newProps) {
  }

// <div class="g-ytsubscribe" data-channel="GoogleDevelopers" data-layout="full" data-count="default"></div>
  render() {
    const channelInfo = this.props.channel.channel;
    const hottestVideos = this.props.hottestVideos;
    const newestVideos = this.props.newestVideos;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>{channelInfo.title}</title>
          <meta name="description" content={channelInfo.description} />
          <meta name="og:title" content={'小頻道大世界-' + channelInfo.title} />
          <meta name="og:description" content={`
            【小頻道大世界】${channelInfo.description}`}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content={channelInfo.bannerTvImageUrl} />
          <meta name="og:url" content={'https://www.youtuberspy.com/channel?channelId=' + this.props.query.channelId} />
          <meta property="og:site_name" content={'小頻道大世界- 在這裡發掘您喜歡的Youtubers！'}/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          <div className={'SingleChannel-zone'}>
            <div className={'SingleChannel-titleZone'}>
              <figure className={'SingleChannel-backgroundImage'}>
                <img src={channelInfo.bannerTvImageUrl}/>
              </figure>
              <figure className={'SingleChannel-photoImage'}>
                <img src={channelInfo.defaultThumbnails}/>
              </figure>
              <div className={'SingleChannel-decorateZone'}>
              </div>
              <div className={'SingleChannel-subscriber'}>
                <script src="https://apis.google.com/js/platform.js"></script>
                <div
                  className={'g-ytsubscribe'}
                  data-channelid={channelInfo._id} data-layout="default" data-count="default"></div>
              </div>
            </div>
            <h1 className={'SingleChannel-title'}>{channelInfo.title}</h1>
            <div className={'SingleChannel-statisticZone'}>
              <div className={'SingleChannel-statistic'}>
                <span>訂閱 {channelInfo.subscriberCount.toLocaleString()}</span>
              </div>
              <div className={'SingleChannel-statistic'}>
                <span>觀看 {channelInfo.viewCount.toLocaleString()}</span>
              </div>
              <div className={'SingleChannel-statistic'}>
                <span>影片 {channelInfo.videoCount.toLocaleString()}</span>
              </div>
              <div className={'SingleChannel-statistic'}>
                <span>評論 {channelInfo.commentCount.toLocaleString()}</span>
              </div>
            </div>
            <p className={'SingleChannel-description'}>{channelInfo.description || '這個頻道沒有任何的介紹'}</p>
            <h1 className={'SingleChannel-videosZoneTitle'}>最新影片</h1>
            <div className={'SingleChannel-videosZone'}>
              {
                newestVideos.map((item) => {
                  return (
                    <YoutubeVideoCard
                      key={item._id}
                      videoInfo={item}
                    />
                  );
                })
              }
            </div>
            <h1 className={'SingleChannel-videosZoneTitle'}>熱門影片</h1>
            <div className={'SingleChannel-videosZone'}>
              {
                hottestVideos.map((item) => {
                  return (
                    <YoutubeVideoCard
                      key={item._id}
                      videoInfo={item}
                    />
                  );
                })
              }
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // video: state.video,
    channel: state.channel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChannelAsync: bindActionCreators(channelAction.getChannelAsync, dispatch),
    // getVideosAsync: bindActionCreators(videoAction.getVideosAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SingleChannel);
