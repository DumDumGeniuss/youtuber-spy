import channelReducer from './channel';

test('Test get channels', () => {
  const state = {
    channels: [],
    totalCount: 0,
    channelCategories: [],
    countryCategories: [],
    token: '',
    channel: {},
  };
  const action = {
    type: 'GET_CHANNELS',
    channels: [0, 1, 2, 3],
    totalCount: 4,
    channelCategories: ['sport', 'music'],
    countryCategories: ['Taiwan', 'Malaysia'],
    token: 'abcd',
  };
  const newState = channelReducer(state, action);

  expect(newState.channels.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.channelCategories[0]).toBe('sport');
  expect(newState.countryCategories[1]).toBe('Malaysia');
  expect(newState.token).toBe('abcd');
});

test('Test get channel', () => {
  const state = {
    channels: [],
    totalCount: 0,
    channelCategories: [],
    countryCategories: [],
    token: '',
    channel: {},
  };
  const action = {
    type: 'GET_CHANNEL',
    channel: {
      _id: 'aaa',
      title: 'hello',
    },
  };
  const newState = channelReducer(state, action);

  expect(newState.channel._id).toBe('aaa');
  expect(newState.channel.title).toBe('hello');
});
