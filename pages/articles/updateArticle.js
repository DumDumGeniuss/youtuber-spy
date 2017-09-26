import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import ErrorBox from '../../components/boxes/ErrorBox/ErrorBox';
import ConfirmModal from '../../components/modals/ConfirmModal/ConfirmModal';
import Plus from 'react-icons/lib/fa/plus';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as articleAction from '../../actions/article';

import stylesheet from './updateArticle.scss';

class UpdateArticle extends React.Component {
  static async getInitialProps({ query, store }) {
    try {
      const articleId = query.articleId;
      const result = await articleApi.getArticle(articleId);
      store.dispatch(articleAction.getArticle(result.data, result.token));
      return {
        query,
      };
    } catch (e) {
      return {
        error: {
          status: 404,
          message: e.message,
        },
      };
    }
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
      isDoDelete: false,
      isDoUpdate: false,
    };

    this.switchModal = this.switchModal.bind(this);
    this.updateArticle = this.updateArticle.bind(this);
    this.switchModal = this.switchModal.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.error) {
      return;
    }
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
    editor.setContents(this.state.deltaContent.ops);

    /* set initial input value */
    this.titleInputRef.value = this.state.title;
  }

  handleTitleChange(event) {
    this.setState({
      title: event.target.value,
      errorMessage: '',
    });
  }
  deleteArticle() {
    if (this.state.isUpdating) {
      return;
    }
    this.switchModal('isDoDelete');
    const articleId = this.props.query.articleId;
    this.setState({
      isUpdating: true,
      errorMessage: '',
    });

    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };

    articleApi.deleteArticle(query, articleId)
      .then(() => {
        /* Jump back to single article page */
        Router.push({
          pathname: '/articles/allArticles',
        });
      })
      .catch((error) => {
        this.setState({ isUpdating: false });
        if (error.status === 403) {
          this.setState({
            errorMessage: '很抱歉您的登入已經過期或你無權做此操作。',
          });
        }
        if (error.status === 404) {
          this.setState({
            errorMessage: '您所要刪除的文章不存在',
          });
        }
      });
  }

  updateArticle() {
    if (this.state.isUpdating) {
      return;
    }
    this.switchModal('isDoUpdate');
    const articleId = this.props.query.articleId;
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
    articleApi.updateArticle(articleId, query, data)
      .then(() => {
        Router.push({
          pathname: '/articles/singleArticle',
          query: {
            articleId,
          },
        });
      })
      .catch((error) => {
        this.setState({ isUpdating: false });
        if (error.status === 403) {
          this.setState({
            errorMessage: '很抱歉您的登入已經過期或你無權做此操作。',
          });
        }
        if (error.status === 404) {
          this.setState({
            errorMessage: '您所要修改的文章不存在',
          });
        }
        if (error.status === 411) {
          this.setState({
            errorMessage: '輸入為空或者太長或太短，請修正',
          });
        }
      });
  }

  switchModal(params) {
    return () => {
      this.setState({
        [params]: !this.state[params],
      });
    };
  }

  render() {
    const articleInfo = this.props.article.article;
    // const userInfo = this.props.user.userInfo || {};
    // const i18nWords = this.props.i18n.words;

    if (this.props.error) {
      return (
        <MainLayoutContainer>
          <ErrorBox
            status={this.props.error.status}
            message={this.props.error.message}
          />
        </MainLayoutContainer>
      );
    }

    return (
      <div>
        <ConfirmModal
          show={this.state.isDoDelete}
          clickYes={this.deleteArticle}
          clickNo={this.switchModal('isDoDelete')}
          message={'確定要刪除？'}
          isLoading={this.state.isUpdating}
        />
        <ConfirmModal
          show={this.state.isDoUpdate}
          clickYes={this.updateArticle}
          clickNo={this.switchModal('isDoUpdate')}
          message={'確定要修改？'}
          isLoading={this.state.isUpdating}
        />
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={`Youtuber看門狗-${articleInfo.title}`}
          description={articleInfo.rawContent}
          type={'website'}
          image={'https://www.youtuberspy.com/static/forum-image.jpg'}
          url={`https://www.youtuberspy.com/articles/singleArticle?articleId=${articleInfo._id}`}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer>
          <div className={'UpdateArticle-zone'}>
            <div className={'UpdateArticle-functionZone'}>
              <span
                role={'button'}
                tabIndex={0}
                className={'UpdateArticle-button UpdateArticle-deleteButton'}
                onClick={this.switchModal('isDoDelete')}
              >
                {this.state.isUpdating ? <FaCircleONotch className={'UpdateArticle-spin'} /> : <Plus />}刪除
              </span>
              <span
                role={'button'}
                tabIndex={0}
                className={'UpdateArticle-button UpdateArticle-updateButton'}
                onClick={this.switchModal('isDoUpdate')}
              >
                {this.state.isUpdating ? <FaCircleONotch className={'UpdateArticle-spin'} /> : <Plus />}確認修改
              </span>
            </div>
            <div className={'UpdateArticle-infoZone'}>
              <img alt={`youtuberspy user ${articleInfo.userPicture}`} className={'UpdateArticle-userPicture'} src={articleInfo.userPicture} />
              <span className={'UpdateArticle-userName'}>{articleInfo.userName}</span>
              <span className={'UpdateArticle-date'}>發佈於 {moment(articleInfo.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            {this.state.errorMessage ? <span className={'UpdateArticle-errorMessage'}>{this.state.errorMessage}</span> : null}
            <div className={'UpdateArticle-titleZone'}>
              <span className={'UpdateArticle-titleLabel'}>標題</span>
              <input ref={(ref) => { this.titleInputRef = ref; }} className={'UpdateArticle-titleInput'} onChange={this.handleTitleChange} />
            </div>
            <div
              className={'UpdateArticle-editor'}
              dangerouslySetInnerHTML={{
                __html: `
                  <div id="toolbar" style='background-color: #83c0ff;'>
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
                  </div>` }}
            />
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

UpdateArticle.defaultProps = {
  error: null,
};

UpdateArticle.propTypes = {
  article: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  // user: PropTypes.object.isRequired,
  error: PropTypes.object,
  // i18n: PropTypes.object.isRequired,
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UpdateArticle);
