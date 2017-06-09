const initState = {
  videos: [],
  video: {},
};

const video = (state = initState, action) => {
  switch (action.type) {
    case 'GET_VIDEOS':
      return { ...state, videos: action.videos };
    default:
      return state;
  }
};

export default video;
