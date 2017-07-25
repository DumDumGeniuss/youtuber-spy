const initState = {
  candidateChannels: [],
  totalCount: 0,
  token: '',
};

const candidateChannel = (state = initState, action) => {
  let channelId;
  switch (action.type) {
    case 'GET_CANDIDATE_CHANNELS':
      return { ...state, candidateChannels: action.candidateChannels, totalCount: action.totalCount, token: action.token };
    case 'VERIFY_CANDIDATE_CHANNEL':
      channelId = action.channelId;
      state.candidateChannels.forEach((candidateChannel) => {
        if (candidateChannel._id === channelId) {
          candidateChannel.isVerified = true;
        }
      });
      return { ...state, candidateChannels: state.candidateChannels };
    case 'DELETE_CANDIDATE_CHANNEL':
      channelId = action.channelId;
      const candidateChannelsSize = state.candidateChannels.length;
      for (let i = 0; i < candidateChannelsSize; i++) {
        if (state.candidateChannels[i]._id === channelId) {
          state.candidateChannels.splice(i, 1);
          break;
        }
      }
      return { ...state, candidateChannels: state.candidateChannels };
    default:
      return state;
  }
};

export default candidateChannel;
