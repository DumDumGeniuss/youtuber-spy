import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';

import MainLayout from '../components/layouts/MainLayout/MainLayout';
import YoutubeVideoCard from '../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as videoAction from '../actions/video';
import * as videoApi from '../apis/video';

class Index extends React.Component {
  static async getInitialProps({ query, store }) {
    const videos = await videoApi.getAllVideos(null, null, moment().utc().add(-7, 'days').format(), null);
    store.dispatch(videoAction.getVideos(videos));
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.daysAgo = 7;
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  changeQuery(event) {
    this.daysAgo = event.target.value;
    const startTime = moment().utc().add(-this.daysAgo, 'days').format();
    this.props.getVideosAsync(null, null, startTime);
  }

  render() {
    const videos = this.props.state.video.videos;

    return (
      <div>
        <style jsx>{`
          .zone {
            width: 100%;
            max-width: 800px;
            min-height: 100vh;
            margin-left: 50%;
            transform: translate(-50%, 0%);
          }

          .contentZone {
            background-color: white;
          }

          .functionBar {
            position: relative;
            height: 40px;
          }

          .functionBar > div {
            position: absolute;
            display: inline-block;
            top: 5px;
            right: 10px;
          }

          .functionBar select {
            height: 30px;
          }

        `}</style>
        <Head>
          <meta name="og:title" content="youtuber spy" />
        </Head>
        <MainLayout>
          <div className={'zone'}>
            <div className={'functionBar'}>
              <div>
                <span>排序：</span>
                <select onChange={this.changeQuery.bind(this)} defaultValue={7}>
                  <option value={1}>本日新片</option>
                  <option value={7}>本週新片</option>
                  <option value={30}>本月新片</option>
                </select>
              </div>
            </div>
            <div className={'contentZone'}>
              {
                videos.map((item) => {
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
        </MainLayout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVideosAsync: bindActionCreators(videoAction.getVideosAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
