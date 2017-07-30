import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import * as tinyHelper from '../libs/tinyHelper';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Search from 'react-icons/lib/fa/search';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import YoutuberChannelCard from '../components/cards/YoutuberChannelCard/YoutuberChannelCard';
import PaginationBox from '../components/boxes/PaginationBox/PaginationBox';
import { initStore } from '../store/initStore';
import * as userAction from '../actions/user';
import * as channelAction from '../actions/channel';
import * as channelApi from '../apis/channel';
import * as candidateChannelApi from '../apis/candidateChannel';
import * as youtubeApi from '../apis/youtube';
import * as browserAttributeAction from '../actions/browserAttribute';

import stylesheet from './index.scss';

const defaultQuery = {
  sort: 'subscriberCount',
  order: 'desc',
  keyword: '',
  category: '',
  country: '',
  page: 1,
  count: 40,
};
// localStorage.setItem('state', 'off');
class Index extends React.Component {
  static async getInitialProps({ query, store }) {
    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      newQuery[key] = valueFromQuery ? valueFromQuery : defaultQuery[key];
    });

    const result = await channelApi.getAllChannels(newQuery);
    store.dispatch(channelAction.getChannels(result.datas, result.totalCount, result.channelCategories, result.countryCategories, result.token));

    return {
      newQuery,
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
      country: this.props.newQuery.country,
      page: this.props.newQuery.page,
      count: this.props.newQuery.count,
    };
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const newChannel = newProps.channel;
    const oldChannel = this.props.channel;
    /* If loading successfully, set isLoading to false */
    if (newChannel.token !== oldChannel.token) {
      this.props.setRouterChangingStatus(false);
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
        pathname: '/',
        query: this.query,
      });
    }, 1000);
  }

  changeOrder(event) {
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.query.order = this.query.sort === 'publishedAt' ? 'asc' : 'desc';
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/',
      query: this.query,
    });
  }

  changeCategory(event) {
    this.query.page = 1;
    this.query.category = event.target.value;
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/',
      query: this.query,
    });
  }

  changeCountry(event) {
    this.query.page = 1;
    this.query.country = event.target.value;
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/',
      query: this.query,
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
  }

  render() {
    const channels = this.props.channel.channels;
    const channelCategories = this.props.channel.channelCategories;
    const countryCategories = this.props.channel.countryCategories;
    const totalCount = this.props.channel.totalCount;
    const user = this.props.user;
    const dataPage = parseInt((totalCount - 1) / this.query.count, 10) + 1;
    const i18nWords = this.props.i18n.words;
    let queryParam = tinyHelper.getQueryString(this.query, ['startTime', 'endTime'], ['count']);
    queryParam = queryParam.replace('page=' + this.query.page, 'page=$1');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>Youtuber看門狗</title>
          <meta property="og:title" content="Youtuber看門狗" />
          <meta property="og:description" content={`
            Youtuber看門狗是一個專門整理中文Youtuber資訊的網站，
            這裡搜集並整理了華語地區的Youtuber，您將可以在這邊發掘各式Youtuber資訊，
            也可以比較一下熱門Youtuber的數據，還可以在近期影片中看看有哪些新的作品出現，
            許多功能會在未來陸續推出，若有想法也可以透過我的聯絡方式向我們提出建議。`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.youtuberspy.com/static/logo-facebook.png" />
          <meta property="og:url" content="https://www.youtuberspy.com/" />
          <meta property="og:site_name" content="Youtuber看門狗-在這裡發掘您喜歡的Youtubers！"/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          <div className={'Index-zone'}>
            <div className={'Index-fbLikeZone'} dangerouslySetInnerHTML={{__html: `
                <div class='fb-page'
                  data-href='https://www.facebook.com/U2berSpy/'
                  data-small-header=false
                  data-adapt-container-width=false
                  data-hide-cover=false
                  data-show-facepile=true
                  data-width='320'
                >
                </div>
              `}}
            />
            <div className={'Index-addChannelBar'}>
              <Link href='/candidateChannels/allCandidateChannels'><a>
                <span className={'Index-channelFuncButton Index-search'}>
                  查看新增頻道<Search />
                </span>
              </a></Link>
            </div>
            <div className={'Index-functionBar'}>
              <div>
                <span>關鍵字：</span>
                <input placeholder={this.query.keyword || '輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
              </div>
              <div>
                <span>分類：</span>
                <select onChange={this.changeCategory.bind(this)} defaultValue={this.query.category}>
                  {
                    channelCategories.map((item) => {
                      return (
                        <option key={item} value={item}>{i18nWords.channelCategory[item]}</option>
                      );
                    })
                  }
                  <option value={''}>所有</option>
                </select>
              </div>
              <div>
                <span>國家：</span>
                <select onChange={this.changeCountry.bind(this)} defaultValue={this.query.country}>
                  {
                    countryCategories.map((item) => {
                      return (
                        <option key={item} value={item}>{i18nWords.country[item]}</option>
                      );
                    })
                  }
                  <option value={''}>所有</option>
                </select>
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={this.query.sort}>
                  <option value={'subscriberCount'}>訂閱</option>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'videoCount'}>影片</option>
                  <option value={'publishedAt'}>成立時間</option>
                  <option value={'randomNumber'}>推薦(每小時更新)</option>
                </select>
              </div>
            </div>
            <div className={'Index-contentZone'}>
              {
                channels.map((item, index) => {
                  let channelInfo = {
                    _id: item._id,
                    defaultThumbnails: item.defaultThumbnails,
                    title: item.title,
                    subscriberCount: item.subscriberCount,
                    videoCount: item.videoCount,
                    viewCount: item.viewCount,
                    category: i18nWords.channelCategory[item.category],
                    country: i18nWords.country[item.country],
                    publishedAt: item.publishedAt,
                  }
                  return (
                    <YoutuberChannelCard 
                      key={item._id}
                      channelInfo={channelInfo}
                      rank={index + 1}
                    />
                  );
                })
              }
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.category
                  + this.query.country
                  + this.query.keyword
                  + this.query.keyword
                  + this.query.order
                  + this.query.count
                }
                pageNumber={dataPage}
                url={'/' + queryParam}
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
    user: state.user,
    channel: state.channel,
    i18n: state.i18n,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRouterChangingStatus: bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
    getUser: bindActionCreators(userAction.getUser, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
