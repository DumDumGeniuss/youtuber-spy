import * as commentAction from './comment';

jest.mock('../apis/comment');
import * as commentApi from '../apis/comment';

test('Test action GET_COMMENTS', () => {
  const object = commentAction.getComments([1, 2], 100, 'abcd');
  expect(object.type).toBe('GET_COMMENTS');
  expect(object.comments.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_COMMENTS', async () => {
  const object = commentAction.getCommentsAsync([3, 4], {});
  commentApi.getAllComments = async function () {
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

  expect(dispatch.mock.calls[0][0].type).toBe('GET_COMMENTS');
  expect(dispatch.mock.calls[0][0].comments.length).toBe(4);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});
