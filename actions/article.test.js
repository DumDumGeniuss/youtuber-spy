import * as articleAction from './article';

jest.mock('../apis/article');
import * as articleApi from '../apis/article';

test('Test action GET_ARTICLES', () => {
  const object = articleAction.getArticles([1, 2], 100, 'abcd');
  expect(object.type).toBe('GET_ARTICLES');
  expect(object.articles.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_ARTICLES', async () => {
  const object = articleAction.getArticlesAsync([3, 4], {});
  articleApi.getAllArticles = async function () {
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

  expect(dispatch.mock.calls[0][0].type).toBe('GET_ARTICLES');
  expect(dispatch.mock.calls[0][0].articles.length).toBe(4);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});

test('Test action GET_ARTICLE', () => {
  const object = articleAction.getArticle({ _id: 'hey' }, 'abcd');
  expect(object.type).toBe('GET_ARTICLE');
  expect(object.article._id).toBe('hey');
  expect(object.token).toBe('abcd');
});

test('Test async action GET_ARTICLE', async () => {
  const object = articleAction.getArticleAsync('aaaa');
  articleApi.getArticle = async function () {
    return {
      data: { _id: 'bbbb' },
      token: 'abcd',
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('GET_ARTICLE');
  expect(dispatch.mock.calls[0][0].article._id).toBe('bbbb');
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});
