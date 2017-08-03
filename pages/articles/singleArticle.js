import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './singleArticle.scss';

const defaultToolBar = `
  <div id="toolbar" style='background-color: #bfbfbf; border-top-left-radius: 10px; border-top-right-radius: 10px;'>
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-blockquote"></button>
    <button class="ql-link"></button>
    <select class="ql-size">
      <option value="small"></option>
      <option selected></option>
      <option value="large"></option>
      <option value="huge"></option>
    </select>
    <select class="ql-header">
      <option value="1"></option>
      <option value="2"></option>
      <option value="3"></option>
      <option value="4"></option>
      <option value="5"></option>
      <option value="6"></option>
      <option selected></option>
    </select>
    <select class="ql-color"></select>
    <select class="ql-background"></select>
    <select class="ql-font"></select>
    <select class="ql-align"></select>
    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>
    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
    <button class="ql-indent" value="-1"></button>
    <button class="ql-indent" value="+1"></button>
    <button class="ql-direction" value="rtl"></button>
    <button class="ql-clean"></button>
  </div>
`;

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
    var editor = new Quill('#editor', {
      modules: { toolbar: false },
      theme: 'snow',
      readOnly: true,
    });
    editor.setContents(this.props.article.article.deltaContent.ops);

  }

  componentWillUnmount() {
  }

  render() {
    const articleInfo = this.props.article.article;
    const userInfo = this.props.user.userInfo || {};
    console.log(articleInfo);

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-' + articleInfo.title}
          description={articleInfo.rawContent.substring(0, 300)}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'} 
          url={'https://www.youtuberspy.com/articles/singleArticle?articleId=' + articleInfo._id}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
        <MainLayoutContainer>
          <div className={'SingleArticle-zone'}>
            <div className={'SingleArticle-infoZone'}>
              <img className={'SingleArticle-userPicture'} src={articleInfo.userPicture} />
              <span className={'SingleArticle-userName'}>{articleInfo.userName}</span>
              <span className={'SingleArticle-date'}>發佈於 {moment(articleInfo.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            <h1 className={'SingleArticle-title'}>{articleInfo.title}</h1>
            <div className={'SingleArticle-editor'} dangerouslySetInnerHTML={{__html: `
              <div id="editor" style='background-color: white; min-height: 400px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;'>
              </div>
            `}}/>
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
