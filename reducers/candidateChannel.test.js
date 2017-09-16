import candidateChannelReducer from './candidateChannel';

test('Test get candidateChannels', () => {
  const state = {
    candidateChannels: [],
    totalCount: 0,
    token: '',
  };
  const action = {
    type: 'GET_CANDIDATE_CHANNELS',
    candidateChannels: [0, 1, 2, 3],
    totalCount: 4,
    token: 'abcd',
  };
  const newState = candidateChannelReducer(state, action);

  expect(newState.candidateChannels.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.token).toBe('abcd');
});

test('Test verify candidateChannel', () => {
  const state = {
    candidateChannels: [{
      _id: 'abcd',
      isVerified: false,
    }],
    totalCount: 0,
    token: '',
  };
  const action = {
    type: 'VERIFY_CANDIDATE_CHANNEL',
    channelId: 'abcd',
  };
  const newState = candidateChannelReducer(state, action);

  expect(newState.candidateChannels[0].isVerified).toBe(true);
});

test('Test delete candidateChannel', () => {
  const state = {
    candidateChannels: [{
      _id: 'abcd',
      isVerified: false,
    }],
    totalCount: 0,
    token: '',
  };
  const action = {
    type: 'DELETE_CANDIDATE_CHANNEL',
    channelId: 'abcd',
  };
  const newState = candidateChannelReducer(state, action);

  expect(newState.candidateChannels.length).toBe(0);
});
