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
    default:
      return state;
  }
};

export default channel;
