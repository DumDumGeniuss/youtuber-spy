import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import moment from 'moment';

import ErrorBox from '../../components/boxes/ErrorBox/ErrorBox';
import HeadWrapper from '../../components/tags/HeadWrapper/HeadWrapper';
import MainLayoutContainer from '../../containers/layouts/MainLayout/MainLayoutContainer';
import YoutubeVideoCard from '../../components/cards/YoutubeVideoCard/YoutubeVideoCard';
import { initStore } from '../../store/initStore';
import * as videoAction from '../../actions/video';
import * as videoApi from '../../apis/video';
import * as i18nAction from '../../actions/i18n';

import stylesheet from './singleVideo.scss';

// localStorage.setItem('state', 'off');
class SingleVideo extends React.Component {
  static async getInitialProps({ query, store, req }) {
    if (req) {
      store.dispatch(i18nAction.changeLanguage(req.headers['accept-language']));
    }

    let video;

    try {
      const videoResult = await videoApi.getVideo(query.videoId);
      video = videoResult.data;
      store.dispatch(videoAction.getVideo(video));
    } catch (e) {
      return {
        error: {
          status: 404,
          message: e.message,
        },
      };
    }

    try {
      const randomSameCategoryVideosQuery = {
        category: video.category,
        count: 5,
        random: true,
      };

      const randomSameCategoryVideosResult =
        await videoApi.getAllVideos(randomSameCategoryVideosQuery);
      const randomSameCategoryVideos = randomSameCategoryVideosResult.datas;

      /* Success */
      return {
        randomSameCategoryVideos,
        query,
      };
    } catch (e) {
      return {
        error: {
          status: 500,
          message: 'server error',
        },
      };
    }
  }

  render() {
    if (this.props.error) {
      return (
        <MainLayoutContainer>
          <ErrorBox
            status={this.props.error.status}
            message={this.props.error.message}
          />
        </MainLayoutContainer>
      );
    }

    const videoInfo = this.props.video.video;
    const browserAttribute = this.props.browserAttribute;
    const randomSameCategoryVideos = this.props.randomSameCategoryVideos;
    const i18nWords = this.props.i18n.words;

    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        <HeadWrapper
          title={`Youtuber看門狗-${videoInfo.title}`}
          description={videoInfo.description}
          type={'website'}
          image={videoInfo.highThumbnails}
          url={`https://www.youtuberspy.com/videos/singleVideo?videoId=${this.props.query.videoId}`}
          siteName={'Youtuber看門狗-在這裡發掘您喜歡的Youtubers！'}
          fbAppId={'158925374651334'}
        />
        <MainLayoutContainer i18nWords={i18nWords}>
          <div className={'SingleVideo-zone'}>
            <h1 className={'SingleVideo-title'}>{videoInfo.title}</h1>
            <div className={'SingleVideo-playVideoZone'}>
              <iframe
                title={videoInfo._id}
                frameBorder={'0'}
                allowFullScreen
                width={
                  browserAttribute.windowWidth < 800 ?
                    browserAttribute.windowWidth
                    :
                    640
                }
                height={
                  browserAttribute.windowWidth < 800 ?
                    (browserAttribute.windowWidth * 4.5) / 8
                    :
                    360
                }
                src={`https://www.youtube.com/embed/${videoInfo._id}`}
              />
            </div>
            <Link href={`/channels/singleChannel?channelId=${videoInfo.channelId}`}><a>
              <h2 className={'SingleVideo-smallTitle'}>
                {videoInfo.channelTitle}
              </h2>
            </a></Link>
            <h2 className={'SingleVideo-smallTitle'}>
              {i18nWords.videoCategory[videoInfo.category] || videoInfo.category}
            </h2>
            <div className={'SingleVideo-statisticZone'}>
              <div className={'SingleVideo-statistic'}>
                <span>{i18nWords.words.view} {videoInfo.viewCount.toLocaleString()}</span>
              </div>
              <div className={'SingleVideo-statistic'}>
                <span>{i18nWords.words.time} {moment(new Date(videoInfo.publishedAt)).format('YYYY-MM-DD')}</span>
              </div>
              <div className={'SingleVideo-statistic'}>
                <span>{i18nWords.words.like} {videoInfo.likeCount.toLocaleString()}</span>
              </div>
              <div className={'SingleVideo-statistic'}>
                <span>{i18nWords.words.dislike} {videoInfo.dislikeCount.toLocaleString()}</span>
              </div>
            </div>
            <p className={'SingleVideo-description'}>{videoInfo.description || '這個影片沒有任何的介紹'}</p>
            <h1 className={'SingleVideo-zoneTitle'}>{i18nWords.phrases.relativeVideos}</h1>
            <div className={'SingleVideo-videosZone'}>
              {
                randomSameCategoryVideos.length === 0 ?
                  <h3 className={'SingleVideo-noDatasText'}>由於此頻道最近新增，目前沒有熱門影片數據</h3>
                  :
                  randomSameCategoryVideos.map(item => (
                    <YoutubeVideoCard
                      key={item._id}
                      videoInfo={item}
                    />
                  ))
                }
            </div>
          </div>
        </MainLayoutContainer>
      </div>
    );
  }
}

SingleVideo.defaultProps = {
  error: null,
};

SingleVideo.propTypes = {
  error: PropTypes.object,
  video: PropTypes.object.isRequired,
  browserAttribute: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  randomSameCategoryVideos: PropTypes.array.isRequired,
};

const mapStateToProps = state => (
  {
    video: state.video,
    i18n: state.i18n,
    browserAttribute: state.browserAttribute,
  }
);

const mapDispatchToProps = () => {};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(SingleVideo);
