import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';

import MainLayout from '../components/layouts/MainLayout/MainLayout';
import YoutuberChannelCard from '../components/cards/YoutuberChannelCard/YoutuberChannelCard';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as youtubeAction from '../actions/youtube';
import * as channelApi from '../apis/channel';

class Index extends React.Component {
  static async getInitialProps({ query, store }) {
    const channels = await channelApi.getAllChannels('subscriberCount');
    store.dispatch(youtubeAction.getChannels(channels));

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

  render() {
    const channels = this.props.state.youtube.channels;

    return (
      <div>
        <style jsx>{`
          .zone {
            background-color: white;
            width: 100%;
            max-width: 800px;
            min-height: 100vh;
            margin-left: 50%;
            transform: translate(-50%, 0%);
          }
        `}</style>
        <Head>
          <meta name="og:title" content="youtuber spy" />
        </Head>
        <MainLayout>
          <div className={'zone'}>
            <div>
              <span>排序：</span>
              <select className={''}>
                <option>訂閱</option>
                <option>觀看</option>
                <option>影片</option>
              </select>
            </div>
            <div>
              {
                channels.map((item, index) => {
                  return (
                    <YoutuberChannelCard 
                      key={item.id}
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
    getChannelsAsync: bindActionCreators(youtubeAction.getChannelsAsync, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
