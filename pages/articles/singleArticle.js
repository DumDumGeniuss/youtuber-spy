import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';

import ErrorBox from '../../components/boxes/ErrorBox/ErrorBox';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import SwitchButton from '../../components/buttons/SwitchButton/SwitchButton';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import CommentCard from '../../components/cards/CommentCard/CommentCard';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as commentApi from '../../apis/comment';
import * as youtubeApi from '../../apis/youtube';
import * as articleAction from '../../actions/article';
import * as commentAction from '../../actions/comment';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './singleArticle.scss';

class SingleArticle extends React.Component {
  static async getInitialProps({ query, store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    try {
      const articleId = query.articleId;
      const result = await articleApi.getArticle(articleId);
      store.dispatch(articleAction.getArticle(result.data, result.token));


      const commentDefaultQuery = {
        order: 'asc',
        sort: 'createdAt',
        articleId,
        count: 40,
      };

      const getCommentsResult = await commentApi.getAllComments(commentDefaultQuery);
      store.dispatch(
        commentAction.getComments(
          getCommentsResult.datas,
          getCommentsResult.totalCount,
          getCommentsResult.token,
        ),
      );

      let newestCommentCreatedDate;
      const comments = getCommentsResult.datas;
      if (comments.length === 0) {
        newestCommentCreatedDate = moment().format();
      } else {
        newestCommentCreatedDate = comments[comments.length - 1].createdAt;
      }

      return {
        query,
        newestCommentCreatedDate,
        commentDefaultQuery,
      };
    } catch (e) {
      return {
        error: {
          status: e.status,
          message: e.message,
        },
      };
    }
  }

  constructor(props) {
    super(props);
    this.commentQuery = {
      order: this.props.commentDefaultQuery.order,
      sort: this.props.commentDefaultQuery.sort,
      articleId: this.props.commentDefaultQuery.articleId,
      count: this.props.commentDefaultQuery.count,
    };
    this.state = {
      isAdding: false,
      isLoading: false,
      comment: '',
      errorMessage: '',
      anonymous: false,
    };
    this.newestCommentCreatedDate = this.props.newestCommentCreatedDate;
    this.isNoMoreData = false;
    this.lockLoading = false;

    this.doTouchBottom = this.doTouchBottom.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.changeIsAnonymous = this.changeIsAnonymous.bind(this);
    this.login = this.login.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    if (this.props.error) {
      return;
    }
    const editor = new Quill('#editor', {
      modules: { toolbar: false },
      theme: 'snow',
      readOnly: true,
    });
    editor.setContents(this.props.article.article.deltaContent.ops);
  }

  componentWillReceiveProps(newProps) {
    const newComment = newProps.comment;
    const oldComment = this.props.comment;
    /* If loading successfully, set isLoading to false */
    if (newComment.token !== oldComment.token) {
      /* unlock loading */
      this.lockLoading = false;
      this.setState({
        isLoading: false,
      });
      const newComments = newComment.comments;
      const oldComments = oldComment.comments;
      /* If no more datas, means they are equal to each other */
      if (newComments.length === oldComments.length) {
        this.isNoMoreData = true;
        return;
      }
      if (newComments.length !== 0) {
        this.newestCommentCreatedDate = newComments[newComments.length - 1].createdAt;
      } else {
        this.newestCommentCreatedDate = '';
      }
    }
  }

  handleCommentChange(event) {
    this.setState({
      comment: event.target.value.substring(0, 100),
      errorMessage: '',
    });
    if (event.target.value.length > 100) {
      this.commentInput.value = event.target.value.substring(0, 100);
    }
  }

  addComment() {
    if (this.state.isAdding) {
      return;
    }

    this.setState({ isAdding: true });

    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      content: this.state.comment,
      articleId: this.props.query.articleId,
      anonymous: this.state.anonymous,
    };
    commentApi.addComment(query, data)
      .then(() => {
        this.setState({ isAdding: false });
        this.commentQuery.startTime = '';
        this.isNoMoreData = false;
        this.props.getCommentsAsync([], this.commentQuery);
        this.commentInput.value = '';
      })
      .catch((error) => {
        this.setState({ isAdding: false });
        if (error.status === 403) {
          this.setState({
            errorMessage: '很抱歉您的登入已經過期。',
          });
        }
        if (error.status === 404) {
          this.setState({
            errorMessage: '您所要回覆的文章已不存在',
          });
        }
        if (error.status === 411) {
          this.setState({
            errorMessage: '文章不可為空或超過150字',
          });
        }
      });
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
    this.commentQuery.startTime = this.newestCommentCreatedDate;
    this.props.getCommentsAsync(this.props.comment.comments, this.commentQuery);
  }

  changeIsAnonymous() {
    this.setState({
      anonymous: !this.state.anonymous,
    });
  }

  login() {
    const rootPath = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}/`;
    const pagePath = `${rootPath}articles/singleArticle`;
    const oauthUrl = youtubeApi.generateOauthUrl(
      rootPath, { pathname: pagePath, query: { articleId: this.props.query.articleId } },
    );
    window.open(oauthUrl, '_self');
  }

  render() {
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
    const articleInfo = this.props.article.article;
    const userInfo = this.props.user.userInfo || {};
    const isArtilceOwner = articleInfo.userId === userInfo.id;
    const comments = this.props.comment.comments;
    const i18nWords = this.props.i18n.words;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={`Youtuber看門狗-${articleInfo.title}`}
          description={articleInfo.rawContent}
          type={'website'}
          image={'https://www.youtuberspy.com/static/forum-image.jpg'}
          url={`https://www.youtuberspy.com/articles/singleArticle?articleId${articleInfo._id}`}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer doTouchBottom={this.doTouchBottom} i18nWords={i18nWords}>
          <div className={'SingleArticle-zone'}>
            {
              isArtilceOwner ?
                <Link href={`/articles/updateArticle?articleId=${articleInfo._id}`}><a>
                  <div className={'SingleArticle-functionZone'}>
                    <span className={'SingleArticle-button'}>編輯</span>
                  </div>
                </a></Link>
                :
                null
            }
            <h1 className={'SingleArticle-title'}>{articleInfo.title}</h1>
            <div className={'SingleArticle-infoZone'}>
              <img alt={`user ${articleInfo.userName}`} className={'SingleArticle-userPicture'} src={articleInfo.userPicture} />
              <span className={'SingleArticle-userName'}>{ articleInfo.anonymous ? i18nWords.anonymous : articleInfo.userName}</span>
              <span className={'SingleArticle-date'}>發佈於 {moment(articleInfo.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            <div
              className={'SingleArticle-editor'}
              dangerouslySetInnerHTML={{
                __html: `
                  <div id="editor" style='background-color: white; min-height: 400px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;'>
                  </div>
                `,
              }}
            />

            {
              this.state.errorMessage ?
                <span className={'SingleArticle-errorMessage'}>{this.state.errorMessage}</span>
                :
                null
            }
            {
              userInfo.id ?
                <div className={'SingleArticle-addCommentZone'}>
                  <div className={'SingleArticle-pictureZone'}>
                    <img
                      alt={'anonymous'}
                      className={'SingleArticle-picture'}
                      src={this.state.anonymous ? '/static/anonymous.jpg' : userInfo.picture}
                    />
                  </div>
                  <span className={'SingleArticle-userName'}>{ this.state.anonymous ? i18nWords.anonymous : userInfo.name }</span>
                  <div className={'SingleArticle-textAreaZone'}>
                    <textarea
                      ref={(ref) => { this.commentInput = ref; }}
                      onChange={this.handleCommentChange}
                      rows={6}
                      className={'SingleArticle-textArea'}
                    />
                  </div>
                  <span className={'SingleArticle-lengthRestriction'}>{`${this.state.comment.length}/100`}</span>
                  <div className={'SingleArticle-addCommentButton'}>
                    {this.state.isAdding ? <FaCircleONotch /> : null}
                    <span
                      role={'button'}
                      tabIndex={0}
                      onClick={this.addComment}
                      className={'SingleArticle-addCommentButtonText'}
                    >
                      送出
                    </span>
                  </div>
                  <div className={'SingleArticle-anonymousButton'}>
                    <SwitchButton
                      isOn={this.state.anonymous}
                      text={this.state.anonymous ? '匿名' : '實名'}
                      onClick={this.changeIsAnonymous}
                    />
                  </div>
                </div>
                :
                <div className={'SingleArticle-pleaseLoginZone'}>
                  <span
                    role={'button'}
                    tabIndex={0}
                    onClick={this.login}
                    className={'SingleArticle-pleaseLogin'}
                  >
                    點此登入留言
                  </span>
                </div>
            }
            {
              comments.length !== 0 ?
                <div className={'SingleArticle-commentsZone'}>
                  {
                    comments.map((item) => {
                      const newComment = {
                        userId: item.userId,
                        userName: item.anonymous ? i18nWords.anonymous : item.userName,
                        userPicture: item.userPicture,
                        content: item.content,
                        createdAt: item.createdAt,
                      };
                      return (
                        <CommentCard
                          key={item._id}
                          comment={newComment}
                        />
                      );
                    })
                  }
                </div>
                :
                null
            }
            {
              this.state.isLoading ?
                <div className={'SingleArticle-loadingZone'}>
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

SingleArticle.defaultProps = {
  error: null,
};

SingleArticle.propTypes = {
  user: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  commentDefaultQuery: PropTypes.object.isRequired,
  newestCommentCreatedDate: PropTypes.string.isRequired,
  error: PropTypes.object,
  article: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  getCommentsAsync: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    article: state.article,
    user: state.user,
    comment: state.comment,
    i18n: state.i18n,
  }
);

const mapDispatchToProps = dispatch => (
  {
    getArticle: bindActionCreators(articleAction.getArticle, dispatch),
    getCommentsAsync: bindActionCreators(commentAction.getCommentsAsync, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SingleArticle);
