const initState = {
  candidateChannels: [],
  totalCount: 0,
  token: '',
};

const candidateChannel = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CANDIDATE_CHANNELS':
      return { ...state, candidateChannels: action.candidateChannels, totalCount: action.totalCount, token: action.token };
    case 'VERIFY_CANDIDATE_CHANNEL':
      const channelId = action.channelId;
      state.candidateChannels.forEach((candidateChannel) => {
        if (candidateChannel._id === channelId) {
          candidateChannel.isVerified = true;
        }
      });
      return { ...state, candidateChannels: state.candidateChannels };
    default:
      return state;
  }
};

export default candidateChannel;
