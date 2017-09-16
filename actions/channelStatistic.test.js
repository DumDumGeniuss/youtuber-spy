import * as channelStatistic from './channelStatistic';

jest.mock('../apis/channelStatistic');
import * as channelStatisticApi from '../apis/channelStatistic';

test('Test action GET_CHANNEL_STATISTICS', () => {
  const object = channelStatistic.getChannelStatistics([1, 2], 100, 'abcd');
  expect(object.type).toBe('GET_CHANNEL_STATISTICS');
  expect(object.channelStatistics.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_CHANNEL_STATISTICS', async () => {
  const object = channelStatistic.getChannelStatisticsAsync({});
  channelStatisticApi.getAllChannelStatistics = async function () {
    return {
      datas: [1, 2],
      totalCount: 100,
      token: 'abcd',
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('GET_CHANNEL_STATISTICS');
  expect(dispatch.mock.calls[0][0].channelStatistics.length).toBe(2);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});
