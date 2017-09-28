import * as userApis from './user';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

// jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test add user api', async function () {
  tinyHelper.getQueryString = jest.fn();
  fetch.mockImplementation(async function () {
    return {
      status: 200,
      json: async function () {
        return {
          status: 200
        };
      },
    };  
  });

  const result = await userApis.addUser({ access_token: 'aaaa' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('aaaa');

  expect(result.status).toBe(200);

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});
