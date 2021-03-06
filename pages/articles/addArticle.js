import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import Plus from 'react-icons/lib/fa/plus';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import SwitchButton from '../../components/buttons/SwitchButton/SwitchButton';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './addArticle.scss';

class AddArticle extends React.Component {
  static async getInitialProps({ query, req, store }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

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
      anonymous: false,
    };

    this.changeIsAnonymous = this.changeIsAnonymous.bind(this);
    this.addArticle = this.addArticle.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  componentDidMount() {
    const editor = new Quill('#editor', {
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: () => {
              const range = editor.getSelection();
              const value = prompt('輸入圖片網址');
              editor.insertEmbed(range.index, 'image', value, Quill.sources.USER);
            },
          },
        },
      },
      theme: 'snow',
    });
    editor.on('text-change', () => {
      this.setState({
        deltaContent: editor.getContents(),
        rawContent: editor.getText(),
        errorMessage: '',
      });
    });
    editor.setContents([{ insert: '' }]);
  }

  changeIsAnonymous() {
    this.setState({
      anonymous: !this.state.anonymous,
    });
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value.substring(0, 20),
      errorMessage: '',
    });
    if (event.target.value.length > 20) {
      this.titleInput.value = event.target.value.substring(0, 20);
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
      anonymous: this.state.anonymous,
    };
    articleApi.addArticle(query, data)
      .then((result) => {
        if (result.status !== 200) {
          this.setState({ isAdding: false });
          if (result.status === 403) {
            this.setState({
              errorMessage: '很抱歉您的登入已經過期了，請重整頁面重新登入。',
            });
          }
          if (result.status === 411) {
            this.setState({
              errorMessage: '您的內容過短或是過長，請修正後再新增',
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

  render() {
    const i18nWords = this.props.i18n.words;
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-新增文章'}
          description={'新增文章！'}
          type={'website'}
          image={'https://www.youtuberspy.com/static/forum-image.jpg'}
          url={'https://www.youtuberspy.com/articles/addArticle'}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer i18nWords={i18nWords}>
          <div className={'AddArticle-zone'}>
            <TitleSection
              titleFonts={'發表文章'}
              contentFonts={`
                您可以在這邊跟大家一起在Youtuber的世界中高談闊論，也可以在這裡向大家展示自己的作品，但還是要記得為自己的言行負責任喔！
              `}
            />
            <div className={'AddArticle-functionZone'}>
              <SwitchButton
                role={'button'}
                tabIndex={0}
                className={'AddArticle-SwitchButton'}
                isOn={this.state.anonymous}
                text={this.state.anonymous ? '匿名' : '實名'}
                onClick={this.changeIsAnonymous}
              />
              <span
                role={'button'}
                tabIndex={0}
                className={'AddArticle-button'}
                onClick={this.addArticle}
              >
                {this.state.isAdding ? <FaCircleONotch className={'AddArticle-spin'} /> : <Plus />}發表文章
              </span>
            </div>
            {this.state.errorMessage ? <span className={'AddArticle-errorMessage'}>{this.state.errorMessage}</span> : null}
            <span className={'AddArticle-lengthRestriction'}>{`${this.state.title.length}/20`}</span>
            <div className={'AddArticle-titleZone'}>
              <span className={'AddArticle-titleLabel'}>標題</span>
              <input
                ref={(ref) => { this.titleInput = ref; }}
                className={'AddArticle-titleInput'}
                onChange={this.handleTitleChange}
              />
            </div>
            <span
              className={this.state.rawContent.length < 30 || this.state.rawContent.length > 1000 ?
                'AddArticle-lengthRestrictionError'
                :
                'AddArticle-lengthRestriction'}
            >
              { `30/${this.state.rawContent.length}` } { `${this.state.rawContent.length}/1000` }
            </span>
            <div
              className={'AddArticle-editor'}
              dangerouslySetInnerHTML={{
                __html: `
                  <div id="toolbar" style='background-color: #83c0ff; border-top-left-radius: 10px; border-top-right-radius: 10px;'>
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-underline"></button>
                    <button class="ql-blockquote"></button>
                    <button class="ql-link"></button>
                    <button class="ql-image"></button>
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
                `,
              }}
            />
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

AddArticle.propTypes = {
  i18n: PropTypes.object.isRequired,
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
    getArticle: bindActionCreators(articleAction.getArticle, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AddArticle);
