import articleReducer from './article';

test('Test get articles', () => {
  const state = {
    articles: [],
    totalCount: 0,
    token: '',
    article: {},
  };
  const action = {
    type: 'GET_ARTICLES',
    articles: [0, 1, 2, 3],
    totalCount: 4,
    token: 'abcd',
  };
  const newState = articleReducer(state, action);

  expect(newState.articles.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.token).toBe('abcd');
});

test('Test get article', () => {
  const state = {
    articles: [],
    totalCount: 0,
    token: '',
    article: {},
  };
  const action = {
    type: 'GET_ARTICLE',
    article: {
      id: 'aaaa',
      title: 'hello',
    },
  };
  const newState = articleReducer(state, action);

  expect(newState.article.id).toBe('aaaa');
  expect(newState.article.title).toBe('hello');
});
