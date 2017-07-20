import React from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';

import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
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
          <title>{'【Youtuber看門狗】' + pickedYoutuber.title}</title>
          <meta property="og:title" content={'【Youtuber看門狗】' + pickedYoutuber.title} />
          <meta property="og:description" content={pickedYoutuber.description}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="400" />
          <meta property="og:image" content={pickedYoutuber.mediumThumbnails} />
          <meta property="og:url" content={'https://www.youtuberspy.com/campaigns/pickYoutuber'} />
          <meta property="og:site_name" content="【Youtuber看門狗】在這裡發掘您喜歡的Youtubers！"/>
          <meta property="fb:app_id" content={'158925374651334'} />
        </Head>
        <MainLayoutContainer>
          <div className={'PickYoutuber-zone'}>
            <TitleSection
              titleFonts={'Youtuber許願池'}
              contentFonts={`
                還不知道您喜歡的頻道類型嗎？
                或者有太多的選擇讓你無從挑選呢？
                來看看最適合您的Youtuber是誰吧！
              `}
            />
            <section className={'PickYoutuber-titleSection'}>
              <h1 className={'PickYoutuber-title'}>最適合您的Youtuber是</h1>
              <Link href={'/channels/singleChannel?channelId=' + pickedYoutuber._id}><a>
                <span className={'PickYoutuber-channelTitle'}>{pickedYoutuber.title}</span>
              </a></Link>
              <figure className={'PickYoutuber-image'} >
                <img src={pickedYoutuber.highThumbnails} />
              </figure>
              <p className={'PickYoutuber-description'}>
                {pickedYoutuber.description}
              </p>
            </section>
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
