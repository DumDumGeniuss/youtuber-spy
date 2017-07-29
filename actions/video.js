import * as videoApi from '../apis/video';
import * as tinyHelper from '../libs/tinyHelper';

export function getVideos(videos, totalCount, videoCategories, token) {
  return {
    type: 'GET_VIDEOS',
    videos,
    totalCount,
    videoCategories,
    token,
  };
}

export const getVideosAsync = function (preVideos, query) {
  return function (dispatch) {
    videoApi.getAllVideos(query)
      .then((result) => {
        const newVideos = tinyHelper.removeDuplicated(preVideos.concat(result.datas));
        dispatch(
          getVideos(newVideos, result.totalCount, result.videoCategories, result.token)
        );
      });
  };
};

export function getVideo(video) {
  return {
    type: 'GET_VIDEO',
    video,
  };
}
