import * as videoApi from '../apis/video';
import * as tinyHelper from '../libs/tinyHelper';

export function getVideos(videos, totalCount, token) {
  return {
    type: 'GET_VIDEOS',
    videos,
    totalCount,
    token,
  };
}

export const getVideosAsync = function (preVideos, query) {
  return function (dispatch) {
    videoApi.getAllVideos(query)
      .then((result) => {
        const newVideos = tinyHelper.removeDuplicated(preVideos.concat(result.datas));
        dispatch(
          getVideos(newVideos, result.totalCount, result.token)
        );
      });
  };
};
