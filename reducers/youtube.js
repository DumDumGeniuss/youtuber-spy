const initState = {
  channels: [],
};

const youtube = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CHANNELS':
      return { ...state, channels: action.channels };
    default:
      return state;
  }
};

export default youtube;
