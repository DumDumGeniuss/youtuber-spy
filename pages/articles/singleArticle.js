import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import ReactMarkdown from 'react-markdown';

import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './singleArticle.scss';

class SingleArticle extends React.Component {
  static async getInitialProps({ query, store }) {
    const articleId = query.articleId;
    const result = await articleApi.getArticle(articleId);
    store.dispatch(articleAction.getArticle(result.data, result.token));
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const articleInfo = this.props.article.article;
    const addTime = new Date(articleInfo.addTime);
    const timeString = moment(addTime).format('YYYY/MM/DD HH:mm');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>{'Youtuber看門狗-' + articleInfo.title}</title>
          <meta name="og:title" content={'Youtuber看門狗-' + articleInfo.title} />
          <meta name="og:description" content={articleInfo.content.substring(0, 300)}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content={articleInfo.titleImage} />
          <meta name="og:url" content={'https://www.youtuberspy.com/articles/singleArticle?articleId=' + articleInfo._id} />
          <meta property="og:site_name" content="Youtuber看門狗-在這裡發掘您喜歡的Youtubers！"/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          <div className={'SingleArticle-zone'}>
            <div className={'SingleArticle-markdownZone'}>
              <ReactMarkdown source={articleInfo.content}/>
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
    getArticle: bindActionCreators(articleAction.getArticle, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SingleArticle)
