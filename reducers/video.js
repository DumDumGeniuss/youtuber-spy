const initState = {
  videos: [],
  totalCount: 0,
  token: '',
  video: {},
};

const video = (state = initState, action) => {
  switch (action.type) {
    case 'GET_VIDEOS':
      return { ...state, videos: action.videos, totalCount: action.totalCount, token: action.token };
    default:
      return state;
  }
};

export default video;
