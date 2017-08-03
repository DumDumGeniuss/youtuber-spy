import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';
import Router from 'next/router';

import * as tinyHelper from '../../libs/tinyHelper';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Plus from 'react-icons/lib/fa/plus';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import PaginationBox from '../../components/boxes/PaginationBox/PaginationBox';
import ArticleInputModal from '../../components/modals/ArticleInputModal/ArticleInputModal';
import ArticleCard from '../../components/cards/ArticleCard/ArticleCard';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';
import * as browserAttributeAction from '../../actions/browserAttribute';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './allArticles.scss';

const defaultQuery = {
  sort: 'addTime',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 10,
};
// localStorage.setItem('state', 'off');
class AllArticles extends React.Component {
  static async getInitialProps({ query, store }) {
    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      if (key === 'count') {
        newQuery[key] = defaultQuery[key];
      } else {
        newQuery[key] = valueFromQuery ? valueFromQuery : defaultQuery[key];
      }
    });
    const result = await articleApi.getAllArticles(newQuery);
    store.dispatch(articleAction.getArticles(result.datas, result.totalCount, result.token));
    return {
      newQuery,
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showAddArticle: false,
      isAddArticleLoading: false,
      addArticleErrorMsg: null,
    };
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: this.props.newQuery.sort,
      order: this.props.newQuery.order,
      keyword: this.props.newQuery.keyword,
      page: this.props.newQuery.page,
      count: this.props.newQuery.count,
    };
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const newArticle = newProps.article;
    const oldArticle = this.props.article;
    /* If loading successfully, set isLoading to false */
    if (newArticle.token !== oldArticle.token) {
      this.props.setRouterChangingStatus(false);
    }
    /* Refresh the query parameters */
    Object.keys(newProps.query).forEach((key) => {
      if (key !== 'count') {
        this.query[key] = newProps.query[key];
      }
    });
  }

  changePage(page) {
    this.query.page = page;
    this.props.getArticlesAsync(this.query);
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/articles/allArticles',
      query: this.query,
    });
  }

  /* remember to reset tha page */
  changeKeyword(event) {
    const keyword = event.target.value;

    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    this.searchKeyword = setTimeout(() => {
      // this.toDatasLimit = false;
      this.query.page = 1;
      this.query.keyword = keyword;
      this.props.getArticlesAsync(this.query);
      this.props.setRouterChangingStatus(true);
      Router.push({
        pathname: '/articles/allArticles',
        query: this.query,
      });
    }, 1000);
  }

  changeOrder(event) {
    // this.toDatasLimit = false;
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.props.getArticlesAsync(this.query);
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/articles/allArticles',
      query: this.query,
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
  }

  render() {
    const articles = this.props.article.articles;
    const totalCount = this.props.article.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;
    let queryParam = tinyHelper.getQueryString(this.query, ['createdAt', 'updatedAt'], ['count']);
    queryParam = queryParam.replace('page=' + this.query.page, 'page=$1');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-討論區'}
          description={`
            全台第一個專屬Youtuber的討論平台「Youtuber看門狗」正式上線，想知道大家在紅什麼嗎？想知道更多你不知道的Youtuber嗎？快來加入討論吧！
          `}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'} 
          url={'https://www.youtuberspy.com/articles/allArticles'}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
        <MainLayoutContainer>
          <div className={'AllArticles-zone'}>
            <div className={'AllArticles-addArticleBar'}>
              {
                user.userInfo ? 
                  <Link href='/articles/addArticle'><a>
                    <span className={'AllArticles-articleFuncButton AllArticles-add'}>新增文章<Plus /></span>
                  </a></Link>
                  :
                  <span className={'AllArticles-articleFuncButton AllArticles-pleasLogin'}>登入以新增文章</span>
              }
            </div>
            <div className={'AllArticles-functionBar'}>
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={this.query.sort}>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'publishedAt'}>時間</option>
                  <option value={'randomNumber'}>推薦(每小時更新)</option>
                </select>
              </div>
            </div>
            <div className={'AllArticles-contentZone'}>
              {articles.map((item) => {
                return (
                  <ArticleCard
                    key={item._id}
                    article={item}
                  />
                );
              })}
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.keyword
                  + this.query.order
                  + this.query.count
                }
                pageNumber={dataPage}
                url={'/articles/allArticles' + queryParam}
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
    article: state.article,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRouterChangingStatus: bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
    getArticlesAsync: bindActionCreators(articleAction.getArticlesAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllArticles)
