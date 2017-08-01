import React from 'react';
import Head from 'next/head';
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
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';
import * as candidateChannelAction from '../../actions/candidateChannel';
import * as candidateChannelApi from '../../apis/candidateChannel';
import * as browserAttributeAction from '../../actions/browserAttribute';

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
  static async getInitialProps({ query, store }) {
    const newQuery = {};
    Object.keys(defaultQuery).forEach((key) => {
      const valueFromQuery = query[key];
      if (key === 'count') {
        newQuery[key] = defaultQuery[key];
      } else {
        newQuery[key] = valueFromQuery ? valueFromQuery : defaultQuery[key];
      }
    });
    const result = await candidateChannelApi.getCandidateChannels(newQuery);
    store.dispatch(candidateChannelAction.getCandidateChannels(result.datas, result.totalCount, result.token));

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

    // this.scrollHandler = this.scrollHandler.bind(this);
    // this.addScrollHandler = this.addScrollHandler.bind(this);
    // this.removeScrollHander = this.removeScrollHander.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    // this.addScrollHandler();
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
    this.setState({
      showAddChannel: isOpen,
    });
  }

  sendAddChannel(link) {
    this.changeAddChannelErrorMessage(null);
    this.isAddChannelLoading(true);
    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      link: link,
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
          this.showAddChannel(false);
          this.isAddChannelLoading(false);
          /* Reload again*/
          Router.push({
            pathname: '/candidateChannels/allCandidateChannels',
            query: this.query,
          });
        }
      });
  }

  // addScrollHandler() {
  //   this.scrollListener = window.addEventListener('scroll', () => {
  //     this.scrollHandler(
  //       window.pageYOffset,
  //       window.innerHeight,
  //       Math.max(
  //         window.innerHeight,
  //         document.body.offsetHeight,
  //         document.documentElement.clientHeight
  //       )
  //     );
  //   });
  // }

  // removeScrollHander() {
  //   if (this.scrollListener) {
  //     window.removeEventListener('scroll', this.scrollListener);
  //   }
  // }

  // scrollHandler(scrollTop, windowHeight, realHeight) {
  //   /* If not touch bottom, return */
  //   if (scrollTop + windowHeight < realHeight || this.toDatasLimit || this.state.isLoading) {
  //     return;
  //   }

  //   if ((this.query.page * (this.query.count + 1)) > this.props.candidateChannel.totalCount) {
  //     this.toDatasLimit = true;
  //     /* If the number of datas now eqaul to the total count, then just skip */
  //     if (this.props.candidateChannel.candidateChannels.length === this.props.candidateChannel.totalCount) {
  //       return;
  //     }
  //   }

  //   this.query.page = this.query.page + 1;
  //   this.props.getCandidateChannelsAsync(this.props.candidateChannel.candidateChannels, this.query);
  //   this.setState({
  //     isLoading: true,
  //   });
  // }

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
      localStorage.getItem('youtubeToken')
    );
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
    // this.removeScrollHander();
  }

  render() {
    const candidateChannels = this.props.candidateChannel.candidateChannels;
    const totalCount = this.props.candidateChannel.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;
    let queryParam = tinyHelper.getQueryString(this.query, [], ['count']);
    queryParam = queryParam.replace('page=' + this.query.page, 'page=$1');

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={'Youtuber看門狗-頻道新增'}
          description={`我們致力於搜集所有熱門的中文Youtuber頻道，不論是來自馬來西亞、香港、新加坡、台灣、澳門等等的頻道都歡迎加入！`}
          type={'website'}
          image={'https://www.youtuberspy.com/static/logo-facebook.png'}
          url={'https://www.youtuberspy.com/candidateChannels/allCandidateChannels'} 
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
        <MainLayoutContainer>
          {this.state.showAddChannel?
            <ChannelInputModal
              errorMessage={this.state.addChannelErrorMsg}
              message={`
                請將你想加入的頻道首頁或任一影片連結複製貼到連結欄位讓我們取得頻道資訊。
              `}
              clickYes={this.sendAddChannel.bind(this)}
              clickNo={this.showAddChannel.bind(this, false)}
              isLoading={this.state.isAddChannelLoading}
            /> : null}
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
                <span className={'AllCandidateChannels-channelFuncButton AllCandidateChannels-add'} onClick={this.showAddChannel.bind(this, true)}>新增頻道<Plus /></span>
                : <span className={'AllCandidateChannels-channelFuncButton AllCandidateChannels-pleasLogin'}>登入以新增頻道</span>}
            </div>
            <div className={'AllCandidateChannels-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={this.query.keyword || '輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={'addTime'}>
                  <option value={'subscriberCount'}>訂閱</option>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'videoCount'}>影片</option>
                  <option value={'addTime'}>申請時間</option>
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
                pageNumber={dataPage}
                url={'/candidateChannels/allCandidateChannels' + queryParam}
              />
              {
                candidateChannels.map((item, index) => {
                  return (
                    <CandidateChannelCard 
                      key={item._id}
                      candidateChannelInfo={item}
                      isSuperUser={user.isSuperUser}
                      clickVerify={this.verifyChannel.bind(this)}
                      clickDelete={this.deleteChannel.bind(this)}
                    />
                  );
                })
              }
              {this.state.isLoading ? <div className={'AllCandidateChannels-loadingButton'}><FaCircleONotch /></div>: null}
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    candidateChannel: state.candidateChannel,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRouterChangingStatus: bindActionCreators(browserAttributeAction.setRouterChangingStatus, dispatch),
    getCandidateChannelsAsync: bindActionCreators(candidateChannelAction.getCandidateChannelsAsync, dispatch),
    verifyCandidateChannelAsync: bindActionCreators(candidateChannelAction.verifyCandidateChannelAsync, dispatch),
    deleteCandidateChannelAsync: bindActionCreators(candidateChannelAction.deleteCandidateChannelAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(AllCandidateChannels)
