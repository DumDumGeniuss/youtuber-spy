import * as videoApi from '../apis/video';

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
  return async function (dispatch) {
    const result = await videoApi.getAllVideos(query);
    dispatch(
      getVideos(result.datas, result.totalCount, result.videoCategories, result.token),
    );
  };
};

export function getVideo(video) {
  return {
    type: 'GET_VIDEO',
    video,
  };
}
