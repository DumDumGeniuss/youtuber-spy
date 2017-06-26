import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';

import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import { initStore, startClock, addCount, serverRenderClock } from '../../store/initStore';

import * as channelApi from '../../apis/channel';

import stylesheet from './pickYoutuber.scss';

class PickYoutuber extends React.Component {
  static async getInitialProps({ query, store }) {
    const randomResult = await channelApi.getRandomChannel();
    const pickedYoutuber = randomResult.data;
    return {
      query,
      pickedYoutuber,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {}

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const pickedYoutuber = this.props.pickedYoutuber;
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <Head>
          <title>{pickedYoutuber.title}</title>
          <meta name="og:title" content={pickedYoutuber.title} />
          <meta name="og:description" content={pickedYoutuber.description}
          />
          <meta name="og:type" content="website" />
          <meta name="og:image" content={pickedYoutuber.highThumbnails} />
          <meta name="og:url" content={'https://www.youtuberspy.com/channels/singleChannel?channelId=' + pickedYoutuber._id} />
          <meta property="og:site_name" content="小頻道大世界 - 在這裡發掘您喜歡的Youtubers！"/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          <div className={'PickYoutuber-zone'}>
            {pickedYoutuber.title}
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channel: state.channel,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // getArticle: bindActionCreators(articleAction.getArticle, dispatch),
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PickYoutuber)
