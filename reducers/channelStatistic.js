const initState = {
  channelStatistics: [],
  totalCount: 0,
  token: '',
};

const channelStatistic = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CHANNEL_STATISTICS':
      return { ...state, channelStatistics: action.channelStatistics, totalCount: action.totalCount, token: action.token };
    default:
      return state;
  }
};

export default channelStatistic;
