import channelStatisticReducer from './channelStatistic';

test('Test get channelStatistics', () => {
  const state = {
    channelStatistics: [],
    totalCount: 0,
    token: '',
  };
  const action = {
    type: 'GET_CHANNEL_STATISTICS',
    channelStatistics: [0, 1, 2, 3],
    totalCount: 4,
    token: 'abcd',
  };
  const newState = channelStatisticReducer(state, action);

  expect(newState.channelStatistics.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.token).toBe('abcd');
});
