import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import { initStore } from '../store/initStore';
import * as channelAction from '../actions/channel';
import * as channelApi from '../apis/channel';
import * as videoApi from '../apis/video';


import stylesheet from './channel.scss';

// localStorage.setItem('state', 'off');
class Index extends React.Component {
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
          <title>小頻道大世界-頻道精選</title>
          <meta name="og:title" content="小頻道大世界" />
          <meta name="og:description" content={`
            【小頻道大世界】是一個專門整理Youtubers資訊的網站，\n
            這裡搜集並整理了華語地區Youtubers的各項資料，你可以在這邊挖掘您沒聽過的Youtubers，\n
            也可以比較一下熱門Youtubers的數據，還可以在本日影片中看看有哪些新的作品出現，\n
            許多功能會在未來陸續推出，若有想法也可以透過我的聯絡方式向我們提出建議。`}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content="https://www.youtuberspy.com/static/logo-large-facebook.png" />
          <meta name="og:url" content="https://www.youtuberspy.com/" />
          <meta property="og:site_name" content="小頻道大世界- 在這裡發掘您喜歡的Youtubers！"/>
        </Head>
        <MainLayoutContainer>
          <div className={'Channel-zone'}>
            <div className={'Channel-titleZone'}>
              <figure className={'Channel-backgroundImage'}>
                <img src={channelInfo.bannerTvImageUrl}/>
              </figure>
              <figure className={'Channel-photoImage'}>
                <img src={channelInfo.defaultThumbnails}/>
              </figure>
              <div className={'Channel-decorateZone'}>
              </div>
              <div className={'Channel-subscriber'}>
                <div
                  className={'g-ytsubscribe'}
                  data-channelid={channelInfo._id} data-layout="default" data-count="default"></div>
              </div>
            </div>
            <h1 className={'Channel-title'}>{channelInfo.title}</h1>
            <div className={'Channel-statisticZone'}>
              <div className={'Channel-statistic'}>
                <span>訂閱 {channelInfo.subscriberCount.toLocaleString()}</span>
              </div>
              <div className={'Channel-statistic'}>
                <span>觀看 {channelInfo.viewCount.toLocaleString()}</span>
              </div>
              <div className={'Channel-statistic'}>
                <span>影片 {channelInfo.videoCount.toLocaleString()}</span>
              </div>
              <div className={'Channel-statistic'}>
                <span>評論 {channelInfo.commentCount.toLocaleString()}</span>
              </div>
            </div>
            <p className={'Channel-description'}>{channelInfo.description || '這個頻道沒有任何的介紹'}</p>
            <h1 className={'Channel-videosZoneTitle'}>最新影片</h1>
            <div className={'Channel-videosZone'}>
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
            <h1 className={'Channel-videosZoneTitle'}>熱門影片</h1>
            <div className={'Channel-videosZone'}>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
