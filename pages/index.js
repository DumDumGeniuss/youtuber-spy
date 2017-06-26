import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import Search from 'react-icons/lib/fa/search';
import MainLayoutContainer from '../containers/layouts/MainLayout/MainLayoutContainer';
import YoutuberChannelCard from '../components/cards/YoutuberChannelCard/YoutuberChannelCard';
import PaginationBox from '../components/boxes/PaginationBox/PaginationBox';
import TitleSection from '../components/sections/TitleSection/TitleSection';
import { initStore } from '../store/initStore';
import * as userAction from '../actions/user';
import * as channelAction from '../actions/channel';
import * as channelApi from '../apis/channel';
import * as candidateChannelApi from '../apis/candidateChannel';
import * as youtubeApi from '../apis/youtube';

import stylesheet from './index.scss';

const defaultQuery = {
  sort: 'randomNumber',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 20,
};
// localStorage.setItem('state', 'off');
class Index extends React.Component {
  static async getInitialProps({ query, store }) {
    const result = await channelApi.getAllChannels(defaultQuery);
    store.dispatch(channelAction.getChannels(result.datas, result.totalCount, result.token));

    return {
      query,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    /* 每次query API時所需要用到的參數 */
    this.query = {
      sort: defaultQuery.sort,
      order: defaultQuery.order,
      keyword: defaultQuery.keyword,
      page: defaultQuery.page,
      count: defaultQuery.count,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // this.addScrollHandler();
  }

  componentWillReceiveProps(newProps) {
    const newChannel = newProps.channel;
    const oldChannel = this.props.channel;
    /* If loading successfully, set isLoading to false */
    if (newChannel.token !== oldChannel.token) {
      this.setState({
        isLoading: false,
      });
    }
  }

  changePage(page) {
    this.query.page = page;
    this.props.getChannelsAsync([], this.query);
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
      this.query.page = 1;
      this.query.keyword = keyword;
      this.props.getChannelsAsync([], this.query);
      this.setState({
        isLoading: true,
      });
    }, 1000);
  }

  changeOrder(event) {
    this.query.page = 1;
    this.query.sort = event.target.value;
    this.query.order = this.query.sort === 'publishedAt' ? 'asc' : 'desc';
    this.props.getChannelsAsync([], this.query);
    this.setState({
      isLoading: true,
    });
  }

  componentWillUnmount() {
    if (this.searchKeyword) {
      clearTimeout(this.searchKeyword);
    }
  }

  render() {
    const channels = this.props.channel.channels;
    const totalCount = this.props.channel.totalCount;
    const user = this.props.user;
    const dataPage = parseInt(totalCount / this.query.count, 10) + 1;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>小頻道大世界-頻道精選</title>
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
          <meta property="og:site_name" content="小頻道大世界- 在這裡發掘您喜歡的Youtubers！"/>
        </Head>
        <MainLayoutContainer>
          <div className={'Index-zone'}>
            <TitleSection
              titleFonts={'精選頻道'}
              contentFonts={`
                你可以在這邊看到許多熱門Youtuber的資訊，也可以在這裡發掘您喜歡的頻道，
                我們會定時更新推薦的頻道排序，讓更多優質的創作者被發現。
              `}
            />
            <div className={'Index-addChannelBar'}>
              <Link href='/candidateChannels/allCandidateChannels'><a>
                <span className={'Index-channelFuncButton Index-search'}>
                  查看申請頻道<Search />
                </span>
              </a></Link>
            </div>
            <div className={'Index-functionBar'}>
              {this.state.isLoading ? <div><FaCircleONotch /></div> : null}
              <div>
                <span>關鍵字：</span>
                <input placeholder={'輸入關鍵字'} onChange={this.changeKeyword.bind(this)}/>
              </div>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)} defaultValue={'randomNumber'}>
                  <option value={'subscriberCount'}>訂閱</option>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'videoCount'}>影片</option>
                  <option value={'publishedAt'}>成立時間</option>
                  <option value={'randomNumber'}>推薦(每小時更新)</option>
                </select>
              </div>
            </div>
            <div className={'Index-contentZone'}>
              {
                channels.map((item, index) => {
                  return (
                    <YoutuberChannelCard 
                      key={item._id}
                      channelInfo={item}
                      rank={index + 1}
                    />
                  );
                })
              }
              <PaginationBox
                refreshToken={this.query.sort + this.query.keyword + this.query.order + this.query.count}
                lockButton={this.state.isLoading}
                pageNumber={dataPage}
                onChangePage={this.changePage.bind(this)}
              />
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    channel: state.channel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChannelsAsync: bindActionCreators(channelAction.getChannelsAsync, dispatch),
    getUser: bindActionCreators(userAction.getUser, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
