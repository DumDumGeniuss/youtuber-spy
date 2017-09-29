import * as channelApis from './channel';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

// jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test get all channels api', async function () {
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

  const result = await channelApis.getAllChannels({ dataSet: 'basic'});

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].sort).toBe('');
  expect(tinyHelper.getQueryString.mock.calls[0][0].order).toBe('');
  expect(tinyHelper.getQueryString.mock.calls[0][0].dataSet).toBe('basic');

  expect(result.datas.length).toBe(3);
  expect(result.totalCount).toBe(100);
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});

test('Test get channel api', async function () {
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          data: {
            _id: 'hey',
          },
          token: 'abcd',
        };
      },
    };  
  });

  const result = await channelApis.getChannel('aaa');

  expect(fetch.mock.calls.length).toBe(1);

  expect(result.data._id).toBe('hey');
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
});

test('Test get random channel api', async function () {
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          data: {
            _id: 'hey',
          },
          token: 'abcd',
        };
      },
    };  
  });

  const result = await channelApis.getRandomChannel();

  expect(fetch.mock.calls.length).toBe(1);

  expect(result.data._id).toBe('hey');
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
});
