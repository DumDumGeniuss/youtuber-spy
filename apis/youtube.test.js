import * as youtubeApi from './youtube';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test get oauthUrl', () => {
  tinyHelper.getQueryString = jest.fn();
  const url = youtubeApi.generateOauthUrl('https://xxx.xxx', { path: '/' });

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].redirect_uri).toBe('https://xxx.xxx');
  expect(tinyHelper.getQueryString.mock.calls[0][0].state).toBe('{\"path\":\"/\"}');
});

test('Test get user info', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          id: 'dddd',
          picture: 'https://ddd.ccc'
        };
      },
    };  
  });

  const userInfo = await youtubeApi.getUserInfo('abcde');

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('abcde');

  expect(fetch.mock.calls.length).toBe(1);

  expect(userInfo.id).toBe('dddd');
  expect(userInfo.picture).toBe('https://ddd.ccc');
});

test('Test get params from callback', () => {
  const params = youtubeApi.getParamsFromCallback('https://xxx.xxx#aaa=bbb&ccc=ddd');

  expect(params.aaa).toBe('bbb');
  expect(params.ccc).toBe('ddd');
});
