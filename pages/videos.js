import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as videoAction from '../actions/video';
import * as videoApi from '../apis/video';

import stylesheet from './videos.scss';

const defaultQuery = {
  sort: 'publishedAt',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 30,
  startTime: moment().utc().add(-1, 'days').format(),
  endTime: null,
};

class Videos extends React.Component {
  static async getInitialProps({ query, store }) {
    const result = await videoApi.getAllVideos(defaultQuery);
    store.dispatch(videoAction.getVideos(result.datas, result.totalCount, result.token));
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.daysAgo = 7;
    /* 判斷是不是已經撈完所有資料 */
    this.toDatasLimit = false;
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: defaultQuery.sort,
      order: defaultQuery.order,
      keyword: defaultQuery.keyword,
      page: defaultQuery.page,
      count: defaultQuery.count,
      startTime: defaultQuery.startTime,
      endTime: defaultQuery.endTime,
    };

    this.scrollHandler = this.scrollHandler.bind(this);
    this.addScrollHandler = this.addScrollHandler.bind(this);
    this.removeScrollHander = this.removeScrollHander.bind(this);
  }

  componentDidMount() {
    this.addScrollHandler();
  }

  componentWillReceiveProps(newProps) {
    const newVideo = newProps.video;
    const oldVideo = this.props.video;
    /* If loading successfully, set isLoading to false */
    if (newVideo.token !== oldVideo.token) {
      this.setState({
        isLoading: false,
      });
    }
  }

  componentWillUnmount() {
  }

  addScrollHandler() {
    this.scrollListener = window.addEventListener('scroll', () => {
      this.scrollHandler(
        window.pageYOffset,
        window.innerHeight,
        Math.max(
          window.innerHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight
        )
      );
    });
  }

  removeScrollHander() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  scrollHandler(scrollTop, windowHeight, realHeight) {
    /* If not touch bottom, return */
    if (scrollTop + windowHeight < realHeight || this.toDatasLimit || this.state.isLoading) {
      return;
    }

    if ((this.query.page * (this.query.count + 1)) > this.props.video.totalCount) {
      this.toDatasLimit = true;
      /* If the number of datas now eqaul to the total count, then just skip */
      if (this.props.video.videos.length === this.props.video.totalCount) {
        return;
      }
    }

    this.query.page += 1;
    this.props.getVideosAsync(this.props.video.videos, this.query);
    this.setState({
      isLoading: true,
    });
  }

  /* remember to reset tha page */
  changeKeyword(event) {
    const keyword = event.target.value;

    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    this.searchKeyword = setTimeout(() => {
      this.query.page = 1;
      this.toDatasLimit = false;
      this.query.keyword = keyword;
      this.props.getVideosAsync([], this.query);
      this.setState({
        isLoading: true,
      });
    }, 1000);
  }

  /* remember to reset tha page */
  changeOrder(event) {
    this.query.page = 1;
    this.toDatasLimit = false;
    this.query.sort = event.target.value;
    this.props.getVideosAsync([], this.query);
    this.setState({
      isLoading: true,
    });
  }

  /* remember to reset tha page */
  changeQuery(event) {
    this.query.page = 1;
    this.toDatasLimit = false;
    this.daysAgo = event.target.value;
    this.query.startTime = moment().utc().add(-this.daysAgo, 'days').format();
    this.props.getVideosAsync([], this.query);
    this.setState({
      isLoading: true,
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    this.removeScrollHander();
  }

  render() {
    const videos = this.props.video.videos;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>小頻道大世界-影片精選</title>
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
          <meta property="og:site_name" content="小頻道大世界 - 在這裡發掘您喜歡的Youtubers！"/>
        </Head>
        <MainLayoutContainer>
          <div className={'Videos-zone'}>
            <div className={'Videos-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)} />
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={'publishedAt'}>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'publishedAt'}>時間</option>
                  <option value={'randomNumber'}>推薦(每小時更新)</option>
                </select>
              </div>
              <div>
                <span>時間：</span>
                <select onChange={this.changeQuery.bind(this)} defaultValue={1}>
                  <option value={1}>本日新片</option>
                  <option value={7}>本週新片</option>
                  <option value={30}>本月新片</option>
                  <option value={9000}>無限制</option>
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
              {this.state.isLoading ? <div className={'Videos-loadingButton'}><FaCircleONotch /></div>: null}
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    video: state.video,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVideosAsync: bindActionCreators(videoAction.getVideosAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Videos)
