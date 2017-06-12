import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import FaCircleONotch from 'react-icons/lib/fa/circle-o-notch';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
import YoutuberChannelCard from '../components/cards/YoutuberChannelCard/YoutuberChannelCard';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as channelAction from '../actions/channel';
import * as channelApi from '../apis/channel';

import stylesheet from './index.scss';

const defaultQuery = {
  sort: 'randomNumber',
  order: 'desc',
  keyword: '',
  page: 1,
  count: 20,
};

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
    this.toDatasLimit = false;
    this.query = {
      sort: defaultQuery.sort,
      order: defaultQuery.order,
      keyword: defaultQuery.keyword,
      page: defaultQuery.page,
      count: defaultQuery.count,
    };

    this.scrollHandler = this.scrollHandler.bind(this);
    this.addScrollHandler = this.addScrollHandler.bind(this);
    this.removeScrollHander = this.removeScrollHander.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    this.addScrollHandler();
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

  addScrollHandler() {
    this.scrollListener = window.addEventListener('scroll', () => {
      this.scrollHandler(
        window.pageYOffset,
        window.innerHeight,
        Math.max(
          window.innerHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight
        )
      );
    });
  }

  removeScrollHander() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  scrollHandler(scrollTop, windowHeight, realHeight) {
    /* If not touch bottom, return */
    if (scrollTop + windowHeight < realHeight || this.toDatasLimit || this.state.isLoading) {
      return;
    }

    if ((this.query.page * (this.query.count + 1)) > this.props.channel.totalCount) {
      this.toDatasLimit = true;
      /* If the number of datas now eqaul to the total count, then just skip */
      if (this.props.channel.channels.length === this.props.channel.totalCount) {
        return;
      }
    }

    this.query.page = this.query.page + 1;
    this.props.getChannelsAsync(this.props.channel.channels, this.query);
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
      this.toDatasLimit = false;
      this.query.page = 1;
      this.query.keyword = keyword;
      this.props.getChannelsAsync([], this.query);
      this.setState({
        isLoading: true,
      });
    }, 1000);
  }

  /* remember to reset tha page */
  changeOrder(event) {
    this.toDatasLimit = false;
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
    this.removeScrollHander();
  }

  render() {
    const channels = this.props.channel.channels;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <meta name="og:title" content="Youtuber Spy" />
          <meta name="og:description" content={`
            Youtuber Spy 是一個專門整理Youtubers資訊的網站，
            這裡搜集並整理了華語地區Youtubers的各項資料，你可以在這邊挖掘您沒聽過的Youtubers，
            也可以比較一下熱門Youtubers的數據，還可以在本日影片中看看有哪些新的作品出現，
            許多功能會在未來陸續推出，若有想法也可以透過我的聯絡方式向我們提出建議。`}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content="/static/logo-large-facebook.png" />
        </Head>
        <MainLayout>
          <div className={'Index-zone'}>
            <div className={'Index-functionBar'}>
              <div>{this.state.isLoading ? <FaCircleONotch /> : null}</div>
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
                  <option value={'randomNumber'}>亂數(每小時更新)</option>
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
              {this.state.isLoading ? <div className={'Index-loadingButton'}><FaCircleONotch /></div>: null}
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChannelsAsync: bindActionCreators(channelAction.getChannelsAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
