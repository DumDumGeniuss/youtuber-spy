import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Plus from 'react-icons/lib/fa/plus';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import PaginationBox from '../../components/boxes/PaginationBox/PaginationBox';
import ArticleInputModal from '../../components/modals/ArticleInputModal/ArticleInputModal';
import ArticleCard from '../../components/cards/ArticleCard/ArticleCard';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

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
    const result = await articleApi.getAllArticles(defaultQuery);
    store.dispatch(articleAction.getArticles(result.datas, result.totalCount, result.token));
    return {
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
      sort: defaultQuery.sort,
      order: defaultQuery.order,
      keyword: defaultQuery.keyword,
      page: defaultQuery.page,
      count: defaultQuery.count,
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
      this.setState({
        isLoading: false,
      });
    }
  }

  changeAddArticleErrorMessage(msg) {
    this.setState({
      addArticleErrorMsg: msg,
    });

  }

  /* Switch the add article loading icon */
  isAddArticleLoading(isLoading) {
    this.setState({
      isAddArticleLoading: isLoading,
    });
  }

  /* Switch the add article view */
  showAddArticle(isOpen) {
    this.setState({
      showAddArticle: isOpen,
    });
  }

  sendAddArticle(title, titleImage, content) {
    this.changeAddArticleErrorMessage(null);
    this.isAddArticleLoading(true);
    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      title,
      titleImage,
      content,
    };
    articleApi.addArticle(query, data)
      .then((result) => {
        if (result.status !== 200) {
          this.isAddArticleLoading(false);
          if (result.status === 403) {
            this.changeAddArticleErrorMessage('很抱歉您的登入已經過期了，請重整頁面重新登入。');
          }
        } else {
          this.showAddArticle(false);
          this.isAddArticleLoading(false);
          /* Reload again*/
          this.changePage(1);
        }
      });
  }

  changePage(page) {
    this.query.page = page;
    this.props.getArticlesAsync([], this.query);
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
      // this.toDatasLimit = false;
      this.query.page = 1;
      this.query.keyword = keyword;
      this.props.getArticlesAsync([], this.query);
      this.setState({
        isLoading: true,
      });
    }, 1000);
  }

  changeOrder(event) {
    // this.toDatasLimit = false;
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.props.getArticlesAsync([], this.query);
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
    const articles = this.props.article.articles;
    const totalCount = this.props.article.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>小頻道大世界-新聞</title>
          <meta property="og:title" content="小頻道大世界" />
          <meta property="og:description" content={`
            【小頻道大世界】我們會將一些近期的有趣數據與新聞張貼在精彩新聞，
            若您對Youtubers的世界充滿好奇，那麼歡迎你來到這裡！`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.youtuberspy.com/static/logo-large-facebook.png" />
          <meta property="og:url" content="https://www.youtuberspy.com/articles/allArticles" />
          <meta property="og:site_name" content="小頻道大世界 - 在這裡發掘您喜歡的Youtubers！"/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          {this.state.showAddArticle?
            <ArticleInputModal
              errorMessage={this.state.addArticleErrorMsg}
              message={`
                請將你想加入的頻道首頁複製貼到連結欄位，並簡短描述一下頻道的特性。
              `}
              clickYes={this.sendAddArticle.bind(this)}
              clickNo={this.showAddArticle.bind(this, false)}
              isLoading={this.state.isAddArticleLoading}
            /> : null}
          <div className={'AllArticles-zone'}>
            <TitleSection
              titleFonts={'精彩新聞'}
              contentFonts={`
                我們會將一些近期的有趣數據與新聞張貼在精彩新聞，
                若您對Youtubers的世界充滿好奇，那麼歡迎你來到這裡！
              `}
            />
            {user.isSuperUser ? 
              <div className={'AllArticles-addArticleBar'}>
                <span className={'AllArticles-articleFuncButton AllArticles-add'} onClick={this.showAddArticle.bind(this, true)}>新增文章<Plus /></span>
              </div> : null}
            <div className={'AllArticles-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
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
    article: state.article,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArticlesAsync: bindActionCreators(articleAction.getArticlesAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllArticles)
