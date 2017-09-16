import * as candidateChannelApis from './candidateChannel';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test get all candidateChannels api', async function () {
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

  const result = await candidateChannelApis.getCandidateChannels({});

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].sort).toBe('');
  expect(tinyHelper.getQueryString.mock.calls[0][0].order).toBe('');

  expect(result.datas.length).toBe(3);
  expect(result.totalCount).toBe(100);
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});

test('Test add candidateChannel api', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          status: 200,
        };
      },
    };  
  });

  const result = await candidateChannelApis.addCandidateChannel({ access_token: 'aabbcc' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('aabbcc');

  expect(result.status).toBe(200);

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});

test('Test update article api', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          status: 200,
        };
      },
    };  
  });

  const result = await candidateChannelApis.verifyCandidateChannel({ access_token: 'aabbcc' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('aabbcc');
  expect(tinyHelper.getQueryString.mock.calls[0][0].action).toBe('verified');

  expect(result.status).toBe(200);

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});

test('Test delete article api', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          status: 200,
        };
      },
    };  
  });

  const result = await candidateChannelApis.deleteCandidateChannel(null, 'aabbcc');

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('aabbcc');

  expect(result.status).toBe(200);

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});
