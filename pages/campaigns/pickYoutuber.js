import React from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import Link from 'next/link';

import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import TitleSection from '../../components/sections/TitleSection/TitleSection';
import { initStore } from '../../store/initStore';

import * as channelApi from '../../apis/channel';

import stylesheet from './pickYoutuber.scss';

class PickYoutuber extends React.Component {
  static async getInitialProps({ query }) {
    const randomResult = await channelApi.getRandomChannel();
    const pickedYoutuber = randomResult.data;
    return {
      query,
      pickedYoutuber,
    };
  }

  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const pickedYoutuber = this.props.pickedYoutuber;
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={`Youtuber看門狗-${pickedYoutuber.title}`}
          description={pickedYoutuber.description}
          type={'website'}
          image={pickedYoutuber.mediumThumbnails}
          url={'https://www.youtuberspy.com/campaigns/pickYoutuber'}
          site_name={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fb_app_id={'158925374651334'}
        />
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
              <Link href={`/channels/singleChannel?channelId=${pickedYoutuber._id}`}><a>
                <span className={'PickYoutuber-channelTitle'}>{pickedYoutuber.title}</span>
              </a></Link>
              <figure className={'PickYoutuber-image'} >
                <img alt={'youtuber random youtuber'} src={pickedYoutuber.highThumbnails} />
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

PickYoutuber.propTypes = {
  query: PropTypes.object.isRequired,
  pickedYoutuber: PropTypes.object.isRequired,
};

const mapStateToProps = state => (
  {
    channel: state.channel,
    user: state.user,
  }
);

const mapDispatchToProps = () => ({});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PickYoutuber);
