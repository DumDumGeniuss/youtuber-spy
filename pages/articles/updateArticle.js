import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';

import Plus from 'react-icons/lib/fa/plus';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './updateArticle.scss';

class UpdateArticle extends React.Component {
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
    const articleInfo = this.props.article.article;
    this.state = {
      title: articleInfo.title,
      rawContent: articleInfo.rawContent,
      deltaContent: articleInfo.deltaContent,
      isUpdating: false,
      errorMessage: '',
      articleUserId: articleInfo.userId,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow',
    });
    editor.on('text-change', (delta, oldDelta, source) => {
      this.setState({
        deltaContent: editor.getContents(),
        rawContent: editor.getText(),
        errorMessage: '',
      });
    });
    editor.setContents(this.state.deltaContent.ops);

    /* set initial input value */
    this.refs['title-input'].value = this.state.title;
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
    });
  }

  updateArticle() {
    this.setState({
      isUpdating: true,
      errorMessage: '',
    });

    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      title: this.state.title,
      rawContent: this.state.rawContent,
      deltaContent: this.state.deltaContent,
    };
    articleApi.updateArticle(this.props.query.articleId, query, data)
      .then((result) => {
        if (result.status !== 200) {
          this.setState({ isUpdating: false });
          if (result.status === 403) {
            this.setState({
              errorMessage: '很抱歉您的登入已經過期了，請重整頁面重新登入。'
            });
          }
          if (result.status === 404) {
            this.setState({
              errorMessage: '您所要修改的文章不存在'
            });
          }
        } else {
          this.setState({ isUpdating: false });
          /* Reload again*/
          // Router.push({
          //   pathname: '/candidateChannels/allCandidateChannels',
          //   query: this.query,
          // });
        }
      });
  }

  componentWillUnmount() {
  }

  render() {
    const articleInfo = this.props.article.article;
    const userInfo = this.props.user.userInfo || {};

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
          <div className={'UpdateArticle-zone'}>
            <div className={'UpdateArticle-functionZone'}>
              <span className={'UpdateArticle-button'} onClick={this.updateArticle.bind(this)}>
                {this.state.isUpdating ? <FaCircleONotch className={'UpdateArticle-spin'}/> : <Plus/>}確認修改
              </span>
            </div>
            <div className={'UpdateArticle-infoZone'}>
              <img className={'UpdateArticle-userPicture'} src={articleInfo.userPicture} />
              <span className={'UpdateArticle-userName'}>{articleInfo.userName}</span>
              <span className={'UpdateArticle-date'}>發佈於 {moment(articleInfo.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            {this.state.errorMessage ? <span className={'UpdateArticle-errorMessage'}>{this.state.errorMessage}</span> : null}
            <div className={'UpdateArticle-titleZone'}>
              <label className={'UpdateArticle-titleLabel'}>標題</label>
              <input ref={'title-input'} className={'UpdateArticle-titleInput'} onChange={this.handleTitleChange.bind(this)}/>
            </div>
            <div className={'UpdateArticle-editor'} dangerouslySetInnerHTML={{__html: `
              <div id="toolbar" style='background-color: #bfbfbf;'>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UpdateArticle)
