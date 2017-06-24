import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import PaginationBox from '../components/boxes/PaginationBox/PaginationBox';
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
  }

  componentDidMount() {
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

  changePage(page) {
    this.query.page = page;
    this.props.getVideosAsync([], this.query);
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
    this.query.sort = event.target.value;
    this.props.getVideosAsync([], this.query);
    this.setState({
      isLoading: true,
    });
  }

  /* remember to reset tha page */
  changeQuery(event) {
    this.query.page = 1;
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
  }

  render() {
    const videos = this.props.video.videos;
    const totalCount = this.props.video.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;

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
            <section className={'Videos-titleSection'}>
              <h1 className={'Videos-title'}>精選影片</h1>
              <p className={'Videos-text'}>
                您可以在這邊看到本日發布的影片，也可以瀏覽一週內或一個月內的熱門影片，
                或許也能順便發現您喜歡的Youtuber並按下訂閱喔～
              </p>
            </section>
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
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.keyword
                  + this.query.order
                  + this.query.count
                  + this.query.startTime
                  + this.query.endTime
                }
                lockButton={this.state.isLoading}
                pageNumber={dataPage}
                onChangePage={this.changePage.bind(this)}
              />
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
