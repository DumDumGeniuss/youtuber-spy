import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';

import ErrorBox from '../../components/boxes/ErrorBox/ErrorBox'
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';;
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import CommentCard from '../../components/cards/CommentCard/CommentCard';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as articleApi from '../../apis/article';
import * as commentApi from '../../apis/comment';
import * as articleAction from '../../actions/article';
import * as commentAction from '../../actions/comment';

import stylesheet from './singleArticle.scss';

class SingleArticle extends React.Component {
  static async getInitialProps({ query, store }) {

    try {
      const articleId = query.articleId;
      const result = await articleApi.getArticle(articleId);
      store.dispatch(articleAction.getArticle(result.data, result.token));


      const commentDefaultQuery = {
        order: 'asc',
        sort: 'createdAt',
        articleId: articleId,
        count: 40,
      };

      const getCommentsResult = await commentApi.getAllComments(commentDefaultQuery);
      store.dispatch(commentAction.getComments(getCommentsResult.datas, getCommentsResult.totalCount, getCommentsResult.token));

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
      }
    }
  }

  constructor(props) {
    super(props);
    this.newestCommentCreatedDate = props.newestCommentCreatedDate;
    this.isNoMoreData = false;
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
    };
  }

  componentWillMount() {}

  componentDidMount() {
    if (!this.props.error) {
      var editor = new Quill('#editor', {
        modules: { toolbar: false },
        theme: 'snow',
        readOnly: true,
      });
      editor.setContents(this.props.article.article.deltaContent.ops);
    }
  }

  componentWillReceiveProps(newProps) {
    const newComment = newProps.comment;
    const oldComment = this.props.comment;
    /* If loading successfully, set isLoading to false */
    if (newComment.token !== oldComment.token) {
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
      this.newestCommentCreatedDate = newComments[newComments.length - 1].createdAt;
    }
  }

  handleCommentChange(event) {
    this.setState({
      comment: event.target.value,
      errorMessage: '',
    });
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
    };
    commentApi.addComment(query, data)
      .then((result) => {
        this.setState({ isAdding: false });
        this.commentQuery.startTime = '';
        this.isNoMoreData = false;
        this.props.getCommentsAsync([], this.commentQuery);
      })
      .catch((error) => {
        this.setState({ isAdding: false });
        if (error.status === 403) {
          this.setState({
            errorMessage: '很抱歉您的登入已經過期。'
          });
        }
        if (error.status === 404) {
          this.setState({
            errorMessage: '您所要回覆的文章已不存在'
          });
        }
        if (error.status === 411) {
          this.setState({
            errorMessage: '文章不可為空或超過150字'
          });
        }
      });
  }

  doTouchBottom() {
    if (this.state.isLoading) {
      return;
    }
    if (this.isNoMoreData) {
      return;
    }
    console.log('hey');
    this.setState({
      isLoading: true,
    });
    this.commentQuery.startTime = this.newestCommentCreatedDate;
    this.props.getCommentsAsync(this.props.comment.comments, this.commentQuery);
  }

  componentWillUnmount() {
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

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-' + articleInfo.title}
          description={articleInfo.rawContent}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'} 
          url={'https://www.youtuberspy.com/articles/singleArticle?articleId=' + articleInfo._id}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
        <MainLayoutContainer doTouchBottom={this.doTouchBottom.bind(this)}>
          <div className={'SingleArticle-zone'}>
            {
              isArtilceOwner ?
                <Link href={'/articles/updateArticle?articleId=' + articleInfo._id}><a>
                  <div className={'SingleArticle-functionZone'}>
                    <span className={'SingleArticle-button'}>編輯</span>
                  </div>
                </a></Link>
                :
                null
            }
            <h1 className={'SingleArticle-title'}>{articleInfo.title}</h1>
            <div className={'SingleArticle-infoZone'}>
              <img className={'SingleArticle-userPicture'} src={articleInfo.userPicture} />
              <span className={'SingleArticle-userName'}>{articleInfo.userName}</span>
              <span className={'SingleArticle-date'}>發佈於 {moment(articleInfo.createdAt).format('YYYY-MM-DD')}</span>
            </div>
            <div className={'SingleArticle-editor'} dangerouslySetInnerHTML={{__html: `
              <div id="editor" style='background-color: white; min-height: 400px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;'>
              </div>
            `}}/>

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
                    <img className={'SingleArticle-picture'} src={userInfo.picture}/>
                  </div>
                  <span className={'SingleArticle-userName'}>{userInfo.name}</span>
                  <div className={'SingleArticle-textAreaZone'}>
                    <textarea onChange={this.handleCommentChange.bind(this)} rows={6} className={'SingleArticle-textArea'}/>
                  </div>
                  <div className={'SingleArticle-addCommentButton'}>
                    {this.state.isAdding ? <FaCircleONotch/> : null}
                    <span onClick={this.addComment.bind(this)} className={'SingleArticle-addCommentButtonText'}>送出</span>
                  </div>
                </div>
                :
                null
            }
            <div className={'SingleArticle-commentsZone'}>
              {
                comments.map((item) => {
                  const newComment = {
                    userId: item.userId,
                    userName: item.userName,
                    userPicture: item.userPicture,
                    content: item.content,
                    createdAt: item.createdAt,
                  }
                  return (
                    <CommentCard
                      key={item._id}
                      comment={newComment}
                    />
                  );
                })
              }
            </div>
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

const mapStateToProps = (state) => {
  return {
    article: state.article,
    user: state.user,
    comment: state.comment,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArticle: bindActionCreators(articleAction.getArticle, dispatch),
    getCommentsAsync: bindActionCreators(commentAction.getCommentsAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SingleArticle)
