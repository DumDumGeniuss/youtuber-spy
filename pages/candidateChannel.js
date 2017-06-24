import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Plus from 'react-icons/lib/fa/plus';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import CandidateChannelCard from '../components/cards/CandidateChannelCard/CandidateChannelCard';
import PaginationBox from '../components/boxes/PaginationBox/PaginationBox';
import ChannelInputModal from '../components/modals/ChannelInputModal/ChannelInputModal';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as candidateChannelAction from '../actions/candidateChannel';
import * as candidateChannelApi from '../apis/candidateChannel';

import stylesheet from './candidateChannel.scss';

const defaultQuery = {
  sort: 'addTime',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 10,
};
// localStorage.setItem('state', 'off');
class CandidateChannel extends React.Component {
  static async getInitialProps({ query, store }) {
    const result = await candidateChannelApi.getCandidateChannels(defaultQuery);
    store.dispatch(candidateChannelAction.getCandidateChannels(result.datas, result.totalCount, result.token));

    return {
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
      sort: defaultQuery.sort,
      order: defaultQuery.order,
      keyword: defaultQuery.keyword,
      page: defaultQuery.page,
      count: defaultQuery.count,
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
      this.setState({
        isLoading: false,
      });
    }
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

  sendAddChannel(link, userDescription) {
    this.changeAddChannelErrorMessage(null);
    this.isAddChannelLoading(true);
    const query = {
      access_token: localStorage.getItem('youtubeToken'),
    };
    const data = {
      link: link,
      userDescription: userDescription,
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
          this.changePage(1);
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

  changePage(page) {
    this.query.page = page;
    this.props.getCandidateChannelsAsync([], this.query);
    this.setState({
      isLoading: true,
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
      this.props.getCandidateChannelsAsync([], this.query);
      this.setState({
        isLoading: true,
      });
    }, 1000);
  }

  changeOrder(event) {
    // this.toDatasLimit = false;
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.props.getCandidateChannelsAsync([], this.query);
    this.setState({
      isLoading: true,
    });
  }

  verifyChannel(channelId) {
    this.props.verifyCandidateChannelAsync({
      channelId,
      access_token: localStorage.getItem('youtubeToken'),
    });
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

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>小頻道大世界-申請頻道</title>
          <meta name="og:title" content="小頻道大世界" />
          <meta name="og:description" content={`
            【小頻道大世界】是一個專門整理Youtubers資訊的網站，\n
            這裡搜集並整理了華語地區Youtubers的各項資料，你可以在這邊挖掘您沒聽過的Youtubers，\n
            也可以比較一下熱門Youtubers的數據，還可以在本日影片中看看有哪些新的作品出現，\n
            許多功能會在未來陸續推出，若有想法也可以透過我的聯絡方式向我們提出建議。`}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content="https://www.youtuberspy.com/static/logo-large-facebook.png" />
          <meta name="og:url" content="https://www.youtuberspy.com/" />
          <meta property="og:site_name" content="小頻道大世界 - 在這裡發掘您喜歡的Youtubers！"/>
        </Head>
        <MainLayoutContainer>
          {this.state.showAddChannel?
            <ChannelInputModal
              errorMessage={this.state.addChannelErrorMsg}
              message={`
                請將你想加入的頻道首頁複製貼到連結欄位，並簡短描述一下頻道的特性。
              `}
              clickYes={this.sendAddChannel.bind(this)}
              clickNo={this.showAddChannel.bind(this, false)}
              isLoading={this.state.isAddChannelLoading}
            /> : null}
          <div className={'CandidateChannel-zone'}>
            <section className={'CandidateChannel-titleSection'}>
              <h1 className={'CandidateChannel-title'}>申請頻道</h1>
              <p className={'CandidateChannel-text'}>
                我們歡迎許多各式各樣的頻道加入，剛起步的、還在摸索的、想要獲得更多關注的，
                只要你是Youtube創作者，隨時歡迎！
              </p>
            </section>
            <div className={'CandidateChannel-addChannelBar'}>
              {user.userInfo ? 
                <span className={'CandidateChannel-channelFuncButton CandidateChannel-add'} onClick={this.showAddChannel.bind(this, true)}>申請新增頻道<Plus /></span>
                : <span className={'CandidateChannel-channelFuncButton CandidateChannel-pleasLogin'}>登入以新增頻道</span>}
            </div>
            <div className={'CandidateChannel-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
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
            <div className={'CandidateChannel-contentZone'}>
              <PaginationBox
                refreshToken={
                  this.query.sort
                  + this.query.keyword
                  + this.query.order
                  + this.query.count
                }
                lockButton={this.state.isLoading}
                pageNumber={dataPage}
                onChangePage={this.changePage.bind(this)}
              />
              {
                candidateChannels.map((item, index) => {
                  return (
                    <CandidateChannelCard 
                      key={item._id}
                      candidateChannelInfo={item}
                      isSuperUser={user.isSuperUser}
                      clickVerify={this.verifyChannel.bind(this)}
                    />
                  );
                })
              }
              {this.state.isLoading ? <div className={'CandidateChannel-loadingButton'}><FaCircleONotch /></div>: null}
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
    getCandidateChannelsAsync: bindActionCreators(candidateChannelAction.getCandidateChannelsAsync, dispatch),
    verifyCandidateChannelAsync: bindActionCreators(candidateChannelAction.verifyCandidateChannelAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(CandidateChannel)
