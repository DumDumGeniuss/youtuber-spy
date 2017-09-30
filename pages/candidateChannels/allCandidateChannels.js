import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import Router from 'next/router';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import * as tinyHelper from '../../libs/tinyHelper';
import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Plus from 'react-icons/lib/fa/plus';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import CandidateChannelCard from '../../components/cards/CandidateChannelCard/CandidateChannelCard';
import PaginationBox from '../../components/boxes/PaginationBox/PaginationBox';
import ChannelInputModal from '../../components/modals/ChannelInputModal/ChannelInputModal';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore } from '../../store/initStore';
import * as candidateChannelAction from '../../actions/candidateChannel';
import * as candidateChannelApi from '../../apis/candidateChannel';
import * as browserAttributeAction from '../../actions/browserAttribute';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './allCandidateChannels.scss';

const defaultQuery = {
  sort: 'addTime',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 20,
};
// localStorage.setItem('state', 'off');
class AllCandidateChannels extends React.Component {
  static async getInitialProps({ query, store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      if (key === 'count') {
        newQuery[key] = defaultQuery[key];
      } else {
        newQuery[key] = valueFromQuery || defaultQuery[key];
      }
    });
    const result = await candidateChannelApi.getCandidateChannels(newQuery);
    store.dispatch(
      candidateChannelAction.getCandidateChannels(result.datas, result.totalCount, result.token),
    );

    return {
      newQuery,
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showAddChannel: false,
      isAddChannelLoading: false,
      addChannelErrorMsg: null,
    };
    /* 判斷是不是已經撈完所有資料 */
    // this.toDatasLimit = false;
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: this.props.newQuery.sort,
      order: this.props.newQuery.order,
      keyword: this.props.newQuery.keyword,
      page: this.props.newQuery.page,
      count: this.props.newQuery.count,
    };
    this.sendAddChannel = this.sendAddChannel.bind(this);
    this.changeKeyword = this.changeKeyword.bind(this);
    this.verifyChannel = this.verifyChannel.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.showAddChannel = this.showAddChannel.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const newChannel = newProps.candidateChannel;
    const oldChannel = this.props.candidateChannel;
    /* If loading successfully, set isLoading to false */
    if (newChannel.token !== oldChannel.token) {
      this.props.setRouterChangingStatus(false);
    }
    /* Refresh the query parameters */
    Object.keys(newProps.query).forEach((key) => {
      if (key !== 'count') {
        this.query[key] = newProps.query[key];
      }
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    // this.removeScrollHander();
  }

  changeAddChannelErrorMessage(msg) {
    this.setState({
      addChannelErrorMsg: msg,
    });
  }

  /* Switch the add channel loading icon */
  isAddChannelLoading(isLoading) {
    this.setState({
      isAddChannelLoading: isLoading,
    });
  }

  /* Switch the add channel view */
  showAddChannel(isOpen) {
    return () => {
      this.setState({
        showAddChannel: isOpen,
      });
    };
  }

  sendAddChannel(link) {
    this.changeAddChannelErrorMessage(null);
    this.isAddChannelLoading(true);
    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      link,
    };
    candidateChannelApi.addCandidateChannel(query, data)
      .then((result) => {
        if (result.status !== 200) {
          this.isAddChannelLoading(false);
          if (result.status === 403) {
            this.changeAddChannelErrorMessage('很抱歉您的登入已經過期了，請重整頁面重新登入。');
          }
          if (result.status === 404) {
            this.changeAddChannelErrorMessage('您輸入的不是有效的頻道首頁連結。');
          }
          if (result.status === 409) {
            this.changeAddChannelErrorMessage('此頻道已經登入或正在申請了。');
          }
        } else {
          this.showAddChannel(false)();
          this.isAddChannelLoading(false);
          /* Reload again*/
          Router.push({
            pathname: '/candidateChannels/allCandidateChannels',
            query: this.query,
          });
        }
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
      this.props.setRouterChangingStatus(true);
      Router.push({
        pathname: '/candidateChannels/allCandidateChannels',
        query: this.query,
      });
    }, 1000);
  }

  changeOrder(event) {
    // this.toDatasLimit = false;
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.props.setRouterChangingStatus(true);
    Router.push({
      pathname: '/candidateChannels/allCandidateChannels',
      query: this.query,
    });
  }

  verifyChannel(channelId) {
    this.props.verifyCandidateChannelAsync({
      channelId,
      access_token: localStorage.getItem('youtubeToken'),
    });
  }

  deleteChannel(channelId) {
    this.props.deleteCandidateChannelAsync(
      channelId,
      localStorage.getItem('youtubeToken'),
    );
  }
  render() {
    const candidateChannels = this.props.candidateChannel.candidateChannels;
    const totalCount = this.props.candidateChannel.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;
    let queryParam = tinyHelper.getQueryString(this.query, [], ['count']);
    queryParam = queryParam.replace(`page=${this.query.page}`, 'page=$1');
    const i18nWords = this.props.i18n.words;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-頻道新增'}
          description={'我們致力於搜集所有熱門的中文Youtuber頻道，不論是來自馬來西亞、香港、新加坡、台灣、澳門等等的頻道都歡迎加入！'}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'}
          url={'https://www.youtuberspy.com/candidateChannels/allCandidateChannels'}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        {this.state.showAddChannel ?
          <ChannelInputModal
            errorMessage={this.state.addChannelErrorMsg}
            message={`
              請將你想加入的頻道首頁或任一影片連結複製貼到連結欄位讓我們取得頻道資訊。
            `}
            clickYes={this.sendAddChannel}
            clickNo={this.showAddChannel(false)}
            isLoading={this.state.isAddChannelLoading}
          /> : null}
        <MainLayoutContainer i18nWords={i18nWords}>
          <div className={'AllCandidateChannels-zone'}>
            <TitleSection
              titleFonts={'新增頻道'}
              contentFonts={`
                我們致力於收集所有Youtuber的頻道，
                若您喜愛的頻道未出現在清單中，歡迎登入並動手新增頻道！
              `}
            />
            <div className={'AllCandidateChannels-addChannelBar'}>
              {user.userInfo ?
                <span
                  role={'button'}
                  tabIndex={0}
                  className={'AllCandidateChannels-channelFuncButton AllCandidateChannels-add'}
                  onClick={this.showAddChannel(true)}
                >
                  {i18nWords.phrases.addChannel}<Plus />
                </span>
                :
                <span className={'AllCandidateChannels-channelFuncButton AllCandidateChannels-pleasLogin'}>{i18nWords.phrases.loginToAdd}</span>}
            </div>
            <div className={'AllCandidateChannels-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>{i18nWords.words.keyword}：</span>
                <input
                  placeholder={this.query.keyword || i18nWords.words.keyword}
                  onChange={this.changeKeyword}
                />
              </div>
              <div>
                <span>{i18nWords.words.order}：</span>
                <select onChange={this.changeOrder} defaultValue={'addTime'}>
                  <option value={'subscriberCount'}>{i18nWords.words.subscriber}</option>
                  <option value={'viewCount'}>{i18nWords.words.view}</option>
                  <option value={'videoCount'}>{i18nWords.words.video}</option>
                  <option value={'addTime'}>{i18nWords.words.time}</option>
                </select>
              </div>
            </div>
            <div className={'AllCandidateChannels-contentZone'}>
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.keyword
                  + this.query.order
                  + this.query.count
                }
                initPage={this.query.page}
                pageNumber={dataPage}
                url={`/candidateChannels/allCandidateChannels${queryParam}`}
              />
              {
                candidateChannels.map(item => (
                  <CandidateChannelCard
                    key={item._id}
                    candidateChannelInfo={item}
                    isSuperUser={user.isSuperUser}
                    clickVerify={this.verifyChannel}
                    clickDelete={this.deleteChannel}
                    i18nWords={{
                      subscriber: i18nWords.abbreWords.subscriber,
                      video: i18nWords.words.video,
                      view: i18nWords.words.view,
                      comment: i18nWords.words.comment,
                      pass: i18nWords.words.pass,
                      wait: i18nWords.words.wait,
                    }}
                  />
                ))
              }
              {this.state.isLoading ? <div className={'AllCandidateChannels-loadingButton'}><FaCircleONotch /></div> : null}
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

AllCandidateChannels.propTypes = {
  i18n: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  newQuery: PropTypes.object.isRequired,
  candidateChannel: PropTypes.object.isRequired,
  setRouterChangingStatus: PropTypes.func.isRequired,
  verifyCandidateChannelAsync: PropTypes.func.isRequired,
  deleteCandidateChannelAsync: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    candidateChannel: state.candidateChannel,
    user: state.user,
    i18n: state.i18n,
  }
);

const mapDispatchToProps = dispatch => (
  {
    setRouterChangingStatus:
      bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
    getCandidateChannelsAsync:
      bindActionCreators(candidateChannelAction.getCandidateChannelsAsync, dispatch),
    verifyCandidateChannelAsync:
      bindActionCreators(candidateChannelAction.verifyCandidateChannelAsync, dispatch),
    deleteCandidateChannelAsync:
      bindActionCreators(candidateChannelAction.deleteCandidateChannelAsync, dispatch),
  }
);

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllCandidateChannels);
