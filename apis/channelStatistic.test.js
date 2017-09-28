import * as channelStatisticApis from './channelStatistic';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

// jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test get all channelStatistics api', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          datas: [0, 1, 2],
          totalCount: 100,
          token: 'abcd',
        };
      },
    };  
  });

  const result = await channelStatisticApis.getAllChannelStatistics({ sort: 'createdAt' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].sort).toBe('createdAt');
  expect(tinyHelper.getQueryString.mock.calls[0][0].order).toBe('');

  expect(result.datas.length).toBe(3);
  expect(result.totalCount).toBe(100);
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});
