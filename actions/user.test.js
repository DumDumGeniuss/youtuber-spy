import * as userAction from './user';

jest.mock('../apis/user');
jest.mock('../apis/youtube');
import * as userApi from '../apis/user';
import * as youtubeApi from '../apis/youtube';

test('Test action ADD_USER', () => {
  const object = userAction.getUser({ _id: 'ddd' }, true);
  expect(object.type).toBe('ADD_USER');
  expect(object.user._id).toBe('ddd');
  expect(object.isSuperUser).toBe(true);
});

test('Test async action ADD_USER', async () => {
  const object = userAction.getUserAsync('ddddddddd');
  youtubeApi.getUserInfo = async function () {
    return {
      id: 'aaaa',
      name: 'Mr Yang',
    };
  };
  userApi.addUser = jest.fn();
  const dispatch = jest.fn();
  await object(dispatch);

  // Make sure userApi.addUser has been called one time with parameter access_token 'ddddddddd'
  expect(userApi.addUser.mock.calls.length).toBe(1);
  expect(userApi.addUser.mock.calls[0][0].access_token).toBe('ddddddddd');

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('ADD_USER');
  expect(dispatch.mock.calls[0][0].user.id).toBe('aaaa');
  expect(dispatch.mock.calls[0][0].isSuperUser).toBe(false);
});
