import commentReducer from './comment';

test('Test get comments', () => {
  const state = {
    comments: [],
    totalCount: 0,
    token: '',
  };
  const action = {
    type: 'GET_COMMENTS',
    comments: [0, 1, 2, 3],
    totalCount: 4,
    token: 'abcd',
  };
  const newState = commentReducer(state, action);

  expect(newState.comments.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.token).toBe('abcd');
});
