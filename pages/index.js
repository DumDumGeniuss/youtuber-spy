import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import MainLayout from '../components/layouts/MainLayout/MainLayout';
import YoutuberChannelCard from '../components/cards/YoutuberChannelCard/YoutuberChannelCard';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as channelAction from '../actions/channel';
import * as channelApi from '../apis/channel';

import stylesheet from './index.scss';

class Index extends React.Component {
  static async getInitialProps({ query, store }) {
    const channels = await channelApi.getAllChannels('subscriberCount');
    store.dispatch(channelAction.getChannels(channels));

    return {
      query,
    };
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  changeOrder(event) {
    const sort = event.target.value;
    const order = sort === 'publishedAt' ? 'asc' : 'desc';
    this.props.getChannelsAsync(sort, order);
  }

  render() {
    const channels = this.props.state.channel.channels;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <meta name="og:title" content="youtuber spy" />
        </Head>
        <MainLayout>
          <div className={'Index-zone'}>
            <div className={'Index-functionBar'}>
              <div>
                <span>排序：</span>
                <select onChange={this.changeOrder.bind(this)}>
                  <option value={'subscriberCount'}>訂閱</option>
                  <option value={'viewCount'}>觀看</option>
                  <option value={'videoCount'}>影片</option>
                  <option value={'publishedAt'}>成立時間</option>
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
            </div>
          </div>
        </MainLayout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getChannelsAsync: bindActionCreators(channelAction.getChannelsAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
