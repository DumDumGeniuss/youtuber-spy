const initState = {
  candidateChannels: [],
  totalCount: 0,
  token: '',
};

const candidateChannel = (state = initState, action) => {
  let newCandidateChannels;
  let candidateChannelsSize;
  switch (action.type) {
    case 'GET_CANDIDATE_CHANNELS':
      return {
        ...state,
        candidateChannels: action.candidateChannels,
        totalCount: action.totalCount,
        token: action.token,
      };
    case 'VERIFY_CANDIDATE_CHANNEL':
      newCandidateChannels = [];

      state.candidateChannels.forEach((item) => {
        const newCandidateChannel = item;
        if (newCandidateChannel._id === action.channelId) {
          newCandidateChannel.isVerified = true;
        }
        newCandidateChannels.push(newCandidateChannel);
      });
      return { ...state, candidateChannels: state.candidateChannels };
    case 'DELETE_CANDIDATE_CHANNEL':
      candidateChannelsSize = state.candidateChannels.length;
      for (let i = 0; i < candidateChannelsSize; i += 1) {
        if (state.candidateChannels[i]._id === action.channelId) {
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
