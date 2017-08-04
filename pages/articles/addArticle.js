import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import Plus from 'react-icons/lib/fa/plus';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './addArticle.scss';

class AddArticle extends React.Component {
  static async getInitialProps({ query, store }) {
    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      rawContent: '',
      deltaContent: { ops: [] },
      isAdding: false,
      errorMessage: '',

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
    editor.setContents([{"insert":""}])
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value.substring(0, 20),
      errorMessage: '',
    });
    if (event.target.value.length > 20) {
      this.refs.titleInput.value = event.target.value.substring(0, 20);
    }
  }

  addArticle() {
    if (this.state.isAdding) {
      return;
    }

    this.setState({ isAdding: true });

    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      title: this.state.title,
      rawContent: this.state.rawContent,
      deltaContent: this.state.deltaContent,
    };
    articleApi.addArticle(query, data)
      .then((result) => {
        if (result.status !== 200) {
          this.setState({ isAdding: false });
          if (result.status === 403) {
            this.setState({
              errorMessage: '很抱歉您的登入已經過期了，請重整頁面重新登入。'
            });
          }
          if (result.status === 411) {
            this.setState({
              errorMessage: '您的內容過短或是過長，請修正後再新增'
            });
          }
        } else {
          /* Jump to all articles page */
          Router.push({
            pathname: '/articles/allArticles',
          });
        }
      });
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-新增文章'}
          description={'新增文章！'}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'} 
          url={'https://www.youtuberspy.com/articles/addArticle'}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
        <MainLayoutContainer>
          <div className={'AddArticle-zone'}>
            <TitleSection
              titleFonts={'發表文章'}
              contentFonts={`
                您可以在這邊跟大家一起在Youtuber的世界中高談闊論，也可以在這裡向大家展示自己的作品，但還是要記得為自己的言行負責任喔！
              `}
            />
            <div className={'AddArticle-functionZone'}>
              <span className={'AddArticle-button'} onClick={this.addArticle.bind(this)}>
                {this.state.isAdding ? <FaCircleONotch className={'AddArticle-spin'}/> : <Plus/>}發表文章
              </span>
            </div>
            {this.state.errorMessage ? <span className={'AddArticle-errorMessage'}>{this.state.errorMessage}</span> : null}
            <span className={'AddArticle-lengthRestriction'}>{this.state.title.length + '/20'}</span>
            <div className={'AddArticle-titleZone'}>
              <label className={'AddArticle-titleLabel'}>標題</label>
              <input ref={'titleInput'} className={'AddArticle-titleInput'} onChange={this.handleTitleChange.bind(this)}/>
            </div>
            <span className={this.state.rawContent.length < 30 || this.state.rawContent.length > 1000 ? 'AddArticle-lengthRestrictionError' : 'AddArticle-lengthRestriction'}>{ '30/' + this.state.rawContent.length } { this.state.rawContent.length + '/1000' }</span>
            <div className={'AddArticle-editor'} dangerouslySetInnerHTML={{__html: `
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AddArticle)
