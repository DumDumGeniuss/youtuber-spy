const initState = {
  candidateChannels: [],
  totalCount: 0,
  token: '',
};

const candidateChannel = (state = initState, action) => {
  switch (action.type) {
    case 'GET_CANDIDATE_CHANNELS':
      return { ...state, candidateChannels: action.candidateChannels, totalCount: action.totalCount, token: action.token };
    default:
      return state;
  }
};

export default candidateChannel;
