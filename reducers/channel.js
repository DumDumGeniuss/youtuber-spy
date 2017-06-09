const initState = {
  channels: [],
  channel: {},
};

const channel = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CHANNELS':
      return { ...state, channels: action.channels };
    default:
      return state;
  }
};

export default channel;
