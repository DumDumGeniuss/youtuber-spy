import * as videoApi from '../apis/video';


export function getVideos(videos) {
  return {
    type: 'GET_VIDEOS',
    videos,
  };
}

export const getVideosAsync = function (sort, order, startTime, endTime) {
  return function (dispatch) {
    videoApi.getAllVideos(sort, order, startTime, endTime)
      .then((videos) => {
        dispatch(getVideos(videos));
      });
  };
};
