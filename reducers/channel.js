const initState = {
  channels: [],
  totalCount: 0,
  token: '',
  channel: {},
};

const channel = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CHANNELS':
      return { ...state, channels: action.channels, totalCount: action.totalCount, token: action.token };
    case 'GET_CHANNEL':
      return { ...state, channel: action.channel };
    default:
      return state;
  }
};

export default channel;
