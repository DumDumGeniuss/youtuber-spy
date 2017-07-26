import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';
import Router from 'next/router';

import * as tinyHelper from '../../libs/tinyHelper';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import PaginationBox from '../../components/boxes/PaginationBox/PaginationBox';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';
import * as videoAction from '../../actions/video';
import * as videoApi from '../../apis/video';

import stylesheet from './allVideos.scss';

const defaultQuery = {
  sort: 'viewCount',
  order: 'desc',
  keyword: '',
  category: '',
  page: 1,
  count: 30,
  startTime: moment().utc().add(-7, 'days').format(),
  endTime: '',
};

class AllVideos extends React.Component {
  static async getInitialProps({ query, store }) {
    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      newQuery[key] = valueFromQuery ? valueFromQuery : defaultQuery[key];
    });
    const result = await videoApi.getAllVideos(newQuery);
    store.dispatch(videoAction.getVideos(result.datas, result.totalCount, result.videoCategories, result.token));
    return {
      newQuery,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: this.props.newQuery.sort,
      order: this.props.newQuery.order,
      keyword: this.props.newQuery.keyword,
      category: this.props.newQuery.category,
      page: this.props.newQuery.page,
      count: this.props.newQuery.count,
      startTime: this.props.newQuery.startTime,
      endTime: this.props.newQuery.endTime,
    };
    const now = moment(new Date());
    this.daysAgo = now.diff(this.query.startTime, 'days');
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

  /* remember to reset tha page */
  changeKeyword(event) {
    const keyword = event.target.value;

    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    this.searchKeyword = setTimeout(() => {
      this.query.page = 1;
      this.query.keyword = keyword;
      this.setState({
        isLoading: true,
      });
      Router.push({
        pathname: '/videos/allVideos',
        query: this.query,
      });
    }, 1000);
  }

  /* remember to reset tha page */
  changeOrder(event) {
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.setState({
      isLoading: true,
    });
    Router.push({
      pathname: '/videos/allVideos',
      query: this.query,
    });
  }

  changeCategory(event) {
    this.query.page = 1;
    this.query.category = event.target.value;
    // this.props.getVideosAsync([], this.query);
    this.setState({
      isLoading: true,
    });
    Router.push({
      pathname: '/videos/allVideos',
      query: this.query,
    });
  }

  /* remember to reset tha page */
  changeQuery(event) {
    this.query.page = 1;
    this.daysAgo = event.target.value;
    this.query.startTime = moment().utc().add(-this.daysAgo, 'days').format();
    this.setState({
      isLoading: true,
    });
    Router.push({
      pathname: '/videos/allVideos',
      query: this.query,
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
  }

  render() {
    const videos = this.props.video.videos;
    const videoCategories = this.props.video.videoCategories;
    const totalCount = this.props.video.totalCount;
    const user = this.props.user;
    const dataPage = parseInt((totalCount - 1) / this.query.count, 10) + 1;
    const i18nWords = this.props.i18n.words;
    let queryParam = tinyHelper.getQueryString(this.query, ['startTime', 'endTime']);
    queryParam = queryParam.replace('page=' + this.query.page, 'page=$1');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>【Youtuber看門狗】影片精選</title>
          <meta property="og:title" content="【Youtuber看門狗】精選影片" />
          <meta property="og:description" content={`
            想知道最新的影片資訊嗎？想看看最近大家都在流行什麼樣的影片嗎？
            Youtuber看門狗提供您方便的搜尋服務，讓你可以看到本日，本週甚至本月的流行影片！`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.youtuberspy.com/static/logo-facebook.png" />
          <meta property="og:url" content="https://www.youtuberspy.com/videos/allVideos" />
          <meta property="og:site_name" content="【Youtuber看門狗】在這裡發掘您喜歡的Youtubers！"/>
        </Head>
        <MainLayoutContainer>
          <div className={'AllVideos-zone'}>
            <TitleSection
              titleFonts={'精選影片'}
              contentFonts={`
                我們每天都會自動收錄最新的影片，
                您可以在這邊看到最新發布的影片，也可以選擇想搜尋的日期，
                或許也能順便發現您喜歡的Youtuber並按下訂閱喔～
              `}
            />
            <div className={'AllVideos-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)} />
              </div>
              <div>
                <span>分類：</span>
                <select onChange={this.changeCategory.bind(this)} defaultValue={this.query.category}>
                  {
                    videoCategories.map((item) => {
                      return (
                        <option key={item} value={item}>{i18nWords.videoCategory[item]}</option>
                      );
                    })
                  }
                  <option value={''}>所有</option>
                </select>
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={this.query.sort}>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'publishedAt'}>時間</option>
                  <option value={'randomNumber'}>推薦(每小時更新)</option>
                </select>
              </div>
              <div>
                <span>時間：</span>
                <select onChange={this.changeQuery.bind(this)} defaultValue={this.daysAgo}>
                  <option value={5}>五天內</option>
                  <option value={7}>七天內</option>
                  <option value={10}>十天內</option>
                  <option value={15}>十五天內</option>
                  <option value={30}>三十天內</option>
                </select>
              </div>
            </div>
            <div className={'AllVideos-contentZone'}>
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
                pageNumber={dataPage}
                url={'/videos/allVideos' + queryParam}
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
    i18n: state.i18n,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getVideosAsync: bindActionCreators(videoAction.getVideosAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllVideos)
