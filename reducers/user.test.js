import userReducer from './user';

test('Test add user', () => {
  const state = {
    userInfo: null,
    isSuperUser: false,
  };
  const action = {
    type: 'ADD_USER',
    isSuperUser: true,
    user: {
      id: 'abbccd',
      name: 'Messi',
    },
  };
  const newState = userReducer(state, action);

  expect(newState.userInfo.id).toBe('abbccd');
  expect(newState.userInfo.name).toBe('Messi');
  expect(newState.isSuperUser).toBe(true);
});
