const initState = {
  channels: [],
  totalCount: 0,
  channelCategories: [],
  countryCategories: [],
  token: '',
  channel: {},
};

const channel = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CHANNELS':
      return {
        ...state,
        channels: action.channels,
        channelCategories: action.channelCategories,
        countryCategories: action.countryCategories,
        totalCount: action.totalCount,
        token: action.token };
    case 'GET_CHANNEL':
      return { ...state, channel: action.channel };
    default:
      return state;
  }
};

export default channel;
