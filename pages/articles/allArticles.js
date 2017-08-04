import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';
import moment from 'moment';
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
  sort: 'createdAt',
  order: 'desc',
  keyword: '',
  count: 10,
};
// localStorage.setItem('state', 'off');
class AllArticles extends React.Component {
  static async getInitialProps({ query, store }) {
    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      newQuery[key] = valueFromQuery ? valueFromQuery : defaultQuery[key];
    });
    const result = await articleApi.getAllArticles(newQuery);
    store.dispatch(articleAction.getArticles(result.datas, result.totalCount, result.token));

    let oldestArticleCreatedDate;
    const articles = result.datas;
    if (articles.length === 0) {
      oldestArticleCreatedDate = moment().format();
    } else {
      oldestArticleCreatedDate = articles[articles.length - 1].createdAt;
    }

    return {
      newQuery,
      query,
      oldestArticleCreatedDate,
    };
  }

  constructor(props) {
    super(props);
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: this.props.newQuery.sort,
      order: this.props.newQuery.order,
      keyword: this.props.newQuery.keyword,
      page: this.props.newQuery.page,
      count: this.props.newQuery.count,
    };
    this.state = {
      isLoading: false,
    };
    this.oldestArticleCreatedDate = this.props.oldestArticleCreatedDate;
    this.isNoMoreData = false;
    this.lockLoading = false;
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const newArticle = newProps.article;
    const oldArticle = this.props.article;
    /* If loading successfully, set isLoading to false */
    if (newArticle.token !== oldArticle.token) {
      /* unlock loading */
      this.lockLoading = false;
      this.setState({
        isLoading: false,
      });
      this.props.setRouterChangingStatus(false);
      const newArticles = newArticle.articles;
      const oldArticles = oldArticle.articles;
      /* If no more datas, means they are equal to each other */
      if (newArticles.length === oldArticles.length) {
        this.isNoMoreData = true;
        return;
      }
      if (newArticles.length !== 0) {
        this.oldestArticleCreatedDate = newArticles[newArticles.length - 1].createdAt;
      } else {
        this.oldestArticleCreatedDate = new Date();
      }
    }
  }

  /* remember to reset tha page */
  changeKeyword(event) {
    const keyword = event.target.value;

    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    this.searchKeyword = setTimeout(() => {
      // this.toDatasLimit = false;
      this.query.endTime = moment().format();
      this.query.keyword = keyword;
      this.props.getArticlesAsync([], this.query);
    }, 1000);
  }

  doTouchBottom() {
    if (this.state.isLoading || this.lockLoading) {
      return;
    }
    if (this.isNoMoreData) {
      return;
    }
    /* lock loading */
    this.lockLoading = true;
    this.setState({
      isLoading: true,
    });
    this.query.endTime = this.oldestArticleCreatedDate;
    this.props.getArticlesAsync(this.props.article.articles, this.query);
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
        <MainLayoutContainer doTouchBottom={this.doTouchBottom.bind(this)}>
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
                <input placeholder={this.query.keyword || '輸入關鍵字'} onChange={this.changeKeyword.bind(this)} />
              </div>
            </div>
            <div className={'AllArticles-contentZone'}>
              {articles.map((item) => {
                const article = {
                  _id: item._id,
                  title: item.title,
                  rawContent: item.rawContent,
                  commentCount: item.commentCount,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  userId: item.userId,
                  userName: item.userName,
                  userPicture: item.userPicture,
                };
                return (
                  <Link
                    key={article._id}
                    href={'/articles/singleArticle?articleId=' + article._id}
                  ><a>
                    <ArticleCard
                      article={article}
                    />
                  </a></Link>
                );
              })}
            </div>
            {
              this.state.isLoading ?
                <div className={'AllArticles-loadingZone'}>
                  <FaCircleONotch />
                </div>
                :
                null
            }
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
