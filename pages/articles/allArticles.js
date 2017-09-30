import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';
import moment from 'moment';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Plus from 'react-icons/lib/fa/plus';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import ArticleCard from '../../components/cards/ArticleCard/ArticleCard';
import { initStore } from '../../store/initStore';
import * as browserAttributeAction from '../../actions/browserAttribute';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';
import * as youtubeApi from '../../apis/youtube';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './allArticles.scss';

const defaultQuery = {
  sort: 'createdAt',
  order: 'desc',
  keyword: '',
  count: 10,
};

const login = () => {
  const rootPath = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/`;
  const pagePath = `${rootPath}articles/allArticles`;
  const oauthUrl = youtubeApi.generateOauthUrl(
    rootPath, { pathname: pagePath },
  );
  window.open(oauthUrl, '_self');
};

// localStorage.setItem('state', 'off');
class AllArticles extends React.Component {
  static async getInitialProps({ query, store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      newQuery[key] = valueFromQuery || defaultQuery[key];
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

    this.changeKeyword = this.changeKeyword.bind(this);
    this.doTouchBottom = this.doTouchBottom.bind(this);
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

  render() {
    const articles = this.props.article.articles;
    const user = this.props.user;
    const i18nWords = this.props.i18n.words;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-討論區'}
          description={`
            全台第一個專屬Youtuber的討論平台「Youtuber看門狗」正式上線，想知道大家在紅什麼嗎？想知道更多你不知道的Youtuber嗎？快來加入討論吧！
          `}
          type={'website'}
          image={'https://www.youtuberspy.com/static/forum-image.jpg'}
          url={'https://www.youtuberspy.com/articles/allArticles'}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer doTouchBottom={this.doTouchBottom} i18nWords={i18nWords}>
          <div className={'AllArticles-zone'}>
            <div className={'AllArticles-addArticleBar'}>
              {
                user.userInfo ?
                  <Link href='/articles/addArticle'><a>
                    <span className={'AllArticles-articleFuncButton AllArticles-add'}>新增文章<Plus /></span>
                  </a></Link>
                  :
                  <span
                    role={'button'}
                    tabIndex={0}
                    onClick={login}
                    className={'AllArticles-articleFuncButton AllArticles-pleasLogin'}
                  >
                    {i18nWords.phrases.clickToLogin}
                  </span>
              }
            </div>
            <div className={'AllArticles-functionBar'}>
              <div>
                <span>{i18nWords.words.keyword}：</span>
                <input
                  placeholder={this.query.keyword || i18nWords.words.keyword}
                  onChange={this.changeKeyword}
                />
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
                  userName: item.anonymous ? i18nWords.anonymous : item.userName,
                  userPicture: item.userPicture,
                };
                return (
                  <Link
                    key={article._id}
                    href={`/articles/singleArticle?articleId=${article._id}`}
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

AllArticles.propTypes = {
  user: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  article: PropTypes.object.isRequired,
  newQuery: PropTypes.object.isRequired,
  oldestArticleCreatedDate: PropTypes.string.isRequired,
  setRouterChangingStatus: PropTypes.func.isRequired,
  getArticlesAsync: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    article: state.article,
    user: state.user,
    i18n: state.i18n,
  }
);

const mapDispatchToProps = dispatch => (
  {
    setRouterChangingStatus:
      bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
    getArticlesAsync:
      bindActionCreators(articleAction.getArticlesAsync, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllArticles);
