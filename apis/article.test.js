import * as articleApis from './article';

jest.mock('../libs/tinyHelper');
import * as tinyHelper from '../libs/tinyHelper';

// jest.mock('isomorphic-fetch');
import fetch from 'isomorphic-fetch';

test('Test get all articles api', async function () {
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

  const result = await articleApis.getAllArticles({});

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

test('Test get article api', async function () {
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

  const result = await articleApis.getArticle({});

  expect(fetch.mock.calls.length).toBe(1);

  expect(result.data._id).toBe('hey');
  expect(result.token).toBe('abcd');

  //restore
  fetch.mockClear();
});

test('Test post article api', async function () {
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

  const result = await articleApis.addArticle({ access_token: 'aabbcc' });

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

  const result = await articleApis.updateArticle(null, { access_token: 'aabbcc' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('aabbcc');

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

  const result = await articleApis.deleteArticle({ access_token: 'cde' });

  expect(fetch.mock.calls.length).toBe(1);

  expect(tinyHelper.getQueryString.mock.calls.length).toBe(1);
  expect(tinyHelper.getQueryString.mock.calls[0][0].access_token).toBe('cde');

  expect(result.status).toBe(200);

  //restore
  fetch.mockClear();
  tinyHelper.getQueryString.mockClear();
});
