import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import ReactMarkdown from 'react-markdown';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
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
        <HeadWrapper
          title={'Youtuber看門狗-' + articleInfo.title}
          description={articleInfo.content.substring(0, 300)}
          type={'website'}
          image={articleInfo.titleImage} 
          url={'https://www.youtuberspy.com/articles/singleArticle?articleId=' + articleInfo._id}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
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
