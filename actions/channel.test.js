import * as channelAction from './channel';

jest.mock('../apis/channel');
import * as channelApi from '../apis/channel';

test('Test action GET_CHANNELS', () => {
  const object = channelAction.getChannels([1, 2], 100, ['sport'], ['Taiwan'], 'abcd');
  expect(object.type).toBe('GET_CHANNELS');
  expect(object.channels.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.channelCategories.length).toBe(1);
  expect(object.countryCategories.length).toBe(1);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_CHANNELS', async () => {
  const object = channelAction.getChannelsAsync([], {});
  channelApi.getAllChannels = async function () {
    return {
      datas: [1, 2],
      totalCount: 100,
      channelCategories: ['sport'],
      countryCategories: ['Taiwan'],
      token: 'abcd',
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('GET_CHANNELS');
  expect(dispatch.mock.calls[0][0].channels.length).toBe(2);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].channelCategories.length).toBe(1);
  expect(dispatch.mock.calls[0][0].countryCategories.length).toBe(1);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});

test('Test action GET_CHANNEL', () => {
  const object = channelAction.getChannel({ _id: 'hey' }, 'abcd');
  expect(object.type).toBe('GET_CHANNEL');
  expect(object.channel._id).toBe('hey');
  expect(object.token).toBe('abcd');
});

test('Test async action GET_CHANNEL', async () => {
  const object = channelAction.getChannelAsync('aaaa');
  channelApi.getChannel = async function () {
    return {
      data: { _id: 'bbbb' },
      token: 'abcd',
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('GET_CHANNEL');
  expect(dispatch.mock.calls[0][0].channel._id).toBe('bbbb');
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});
