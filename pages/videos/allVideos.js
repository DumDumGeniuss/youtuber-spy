import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';
import Router from 'next/router';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import * as tinyHelper from '../../libs/tinyHelper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import PaginationBox from '../../components/boxes/PaginationBox/PaginationBox';
import { initStore } from '../../store/initStore';
import * as videoAction from '../../actions/video';
import * as videoApi from '../../apis/video';
import * as browserAttributeAction from '../../actions/browserAttribute';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './allVideos.scss';

const defaultQuery = {
  sort: 'viewCount',
  order: 'desc',
  keyword: '',
  category: '',
  page: 1,
  count: 30,
  startTime: moment().utc().add(-5, 'days').format(),
  endTime: '',
};

class AllVideos extends React.Component {
  static async getInitialProps({ query, store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      if (key === 'count') {
        newQuery[key] = defaultQuery[key];
      } else {
        newQuery[key] = valueFromQuery || defaultQuery[key];
      }
    });
    const result = await videoApi.getAllVideos(newQuery);
    store.dispatch(
      videoAction.getVideos(result.datas, result.totalCount, result.videoCategories, result.token),
    );
    return {
      newQuery,
      query,
    };
  }

  constructor(props) {
    super(props);
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

    this.changeOrder = this.changeOrder.bind(this);
    this.changeKeyword = this.changeKeyword.bind(this);
    this.changeQuery = this.changeQuery.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const newVideo = newProps.video;
    const oldVideo = this.props.video;
    /* If loading successfully, set isLoading to false */
    if (newVideo.token !== oldVideo.token) {
      this.props.setRouterChangingStatus(false);
    }
    /* Refresh the query parameters */
    Object.keys(newProps.query).forEach((key) => {
      if (key !== 'count') {
        this.query[key] = newProps.query[key];
      }
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
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
      this.props.setRouterChangingStatus(true);
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
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/videos/allVideos',
      query: this.query,
    });
  }

  changeCategory(event) {
    this.query.page = 1;
    this.query.category = event.target.value;
    // this.props.getVideosAsync([], this.query);
    this.props.setRouterChangingStatus(true);
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
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/videos/allVideos',
      query: this.query,
    });
  }

  render() {
    const videos = this.props.video.videos;
    const videoCategories = this.props.video.videoCategories;
    const totalCount = this.props.video.totalCount;
    const dataPage = parseInt((totalCount - 1) / this.query.count, 10) + 1;
    const i18nWords = this.props.i18n.words;
    let queryParam = tinyHelper.getQueryString(this.query, ['startTime', 'endTime'], ['count']);
    queryParam = queryParam.replace(`page=${this.query.page}`, 'page=$1');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-近期影片'}
          description={`
            想知道最新的影片資訊嗎？想看看最近大家都在流行什麼樣的影片嗎？
            Youtuber看門狗提供您方便的搜尋服務，讓你可以看到本日，本週甚至本月的流行影片！`}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'}
          url={'https://www.youtuberspy.com/videos/allVideos'}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer i18nWords={i18nWords}>
          <div className={'AllVideos-zone'}>
            <div className={'AllVideos-functionBar'}>
              <div>
                <span>{i18nWords.words.keyword}：</span>
                <input
                  placeholder={this.query.keyword || i18nWords.sentences.enterKeyword}
                  onChange={this.changeKeyword}
                />
              </div>
              <div>
                <span>{i18nWords.words.category}：</span>
                <select onChange={this.changeCategory} defaultValue={this.query.category}>
                  {videoCategories.map(item =>
                    <option key={item} value={item}>{i18nWords.videoCategory[item]}</option>)}
                  <option value={''}>{i18nWords.words.all}</option>
                </select>
              </div>
              <div>
                <span>{i18nWords.words.order}：</span>
                <select onChange={this.changeOrder} defaultValue={this.query.sort}>
                  <option value={'viewCount'}>{i18nWords.words.view}</option>
                  <option value={'publishedAt'}>{i18nWords.words.publishTime}</option>
                  <option value={'randomNumber'}>{i18nWords.words.recommendation}</option>
                </select>
              </div>
              <div>
                <span>{i18nWords.words.publishTime}：</span>
                <select onChange={this.changeQuery} defaultValue={this.daysAgo}>
                  <option value={5}>5 {i18nWords.words.days}</option>
                  <option value={7}>7 {i18nWords.words.days}</option>
                  <option value={10}>10 {i18nWords.words.days}</option>
                  <option value={15}>15 {i18nWords.words.days}</option>
                  <option value={30}>30 {i18nWords.words.days}</option>
                </select>
              </div>
            </div>
            <div className={'AllVideos-contentZone'}>
              {
                videos.map(item => (
                  <YoutubeVideoCard
                    key={item._id}
                    videoInfo={item}
                    i18nWords={{
                      time: i18nWords.words.time,
                      view: i18nWords.words.view,
                    }}
                  />
                ))
              }
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.keyword
                  + this.query.category
                  + this.query.order
                  + this.query.count
                  + this.query.startTime
                  + this.query.endTime
                }
                initPage={this.query.page}
                pageNumber={dataPage}
                url={`/videos/allVideos${queryParam}`}
              />
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

AllVideos.propTypes = {
  newQuery: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  setRouterChangingStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    video: state.video,
    i18n: state.i18n,
  }
);

const mapDispatchToProps = dispatch => (
  {
    setRouterChangingStatus: bindActionCreators(
      browserAttributeAction.setRouterChangingStatus,
      dispatch,
    ),
    getVideosAsync: bindActionCreators(videoAction.getVideosAsync, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllVideos);
