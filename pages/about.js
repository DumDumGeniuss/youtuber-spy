import React from 'react';
import Head from 'next/head';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
// import initStore from '../store/initStore';
// import withRedux from 'next-redux-wrapper';

import { bindActionCreators } from 'redux';
import { initStore, startClock, addCount, serverRenderClock } from '../store/initStore';
import * as youtubeAction from '../actions/youtube';
import withRedux from 'next-redux-wrapper';

import * as channelApi from '../apis/channel';

class About extends React.Component {
  static async getInitialProps({ query, store }) {
    const channels = await channelApi.getAllChannels('subscriberCount');
    store.dispatch(youtubeAction.getChannels(channels));

    return {
      query,
    };
  }

  componentDidMount() {
    // this.props.getChannelsAsync('subscriberCount');
  }

  componentWillUnmount() {
  }

  render() {
    const channels = this.props.state.youtube.channels;

    return (
      <MainLayout>
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
        <div className={'zone'}>
          {
            channels.map((item) => {
              return (
                <span>{item.subscriberCount}<br/></span>
              );
            })
          }
        </div>
      </MainLayout>
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

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(About)
