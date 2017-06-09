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

import stylesheet from './videos.scss';

class Videos extends React.Component {
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
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <meta name="og:title" content="youtuber spy" />
        </Head>
        <MainLayout>
          <div className={'Videos-zone'}>
            <div className={'Videos-functionBar'}>
              <div>
                <span>排序：</span>
                <select onChange={this.changeQuery.bind(this)} defaultValue={7}>
                  <option value={1}>本日新片</option>
                  <option value={7}>本週新片</option>
                  <option value={30}>本月新片</option>
                </select>
              </div>
            </div>
            <div className={'Videos-contentZone'}>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Videos)
