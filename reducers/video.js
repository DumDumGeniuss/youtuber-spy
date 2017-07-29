const initState = {
  videos: [],
  totalCount: 0,
  videoCategories: [],
  token: '',
  video: {},
};

const video = (state = initState, action) => {
  switch (action.type) {
    case 'GET_VIDEOS':
      return { ...state, videos: action.videos, totalCount: action.totalCount, videoCategories: action.videoCategories, token: action.token };
    case 'GET_VIDEO':
      return { ...state, video: action.video };
    default:
      return state;
  }
};

export default video;
