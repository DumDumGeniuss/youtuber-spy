import * as candidateChannelAction from './candidateChannel';
jest.mock('../apis/candidateChannel');
import * as candidateChannelApi from '../apis/candidateChannel';

test('Test action GET_CANDIDATE_CHANNELS', () => {
  const object = candidateChannelAction.getCandidateChannels([1, 2], 100, 'abcd');
  expect(object.type).toBe('GET_CANDIDATE_CHANNELS');
  expect(object.candidateChannels.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_CANDIDATE_CHANNELS', async () => {
  const object = candidateChannelAction.getCandidateChannelsAsync([3, 4], {});
  candidateChannelApi.getCandidateChannels = async function () {
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

  expect(dispatch.mock.calls[0][0].type).toBe('GET_CANDIDATE_CHANNELS');
  expect(dispatch.mock.calls[0][0].candidateChannels.length).toBe(2);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});

test('Test action VERIFY_CANDIDATE_CHANNEL', () => {
  const object = candidateChannelAction.verifyCandidateChannel('aaa');
  expect(object.type).toBe('VERIFY_CANDIDATE_CHANNEL');
  expect(object.channelId).toBe('aaa');
});

test('Test async action VERIFY_CANDIDATE_CHANNEL', async () => {
  const object = candidateChannelAction.verifyCandidateChannelAsync({ channelId: 'aaa' });
  candidateChannelApi.verifyCandidateChannel = async function () {
    return {
      status: 200,
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('VERIFY_CANDIDATE_CHANNEL');
  expect(dispatch.mock.calls[0][0].channelId).toBe('aaa');
});

test('Test action DELETE_CANDIDATE_CHANNEL', () => {
  const object = candidateChannelAction.deleteCandidateChannel('aaa');
  expect(object.type).toBe('DELETE_CANDIDATE_CHANNEL');
  expect(object.channelId).toBe('aaa');
});

test('Test async action DELETE_CANDIDATE_CHANNEL', async () => {
  const object = candidateChannelAction.deleteCandidateChannelAsync('aaa', 'abcde');
  candidateChannelApi.deleteCandidateChannel = async function () {
    return {
      status: 200,
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('DELETE_CANDIDATE_CHANNEL');
  expect(dispatch.mock.calls[0][0].channelId).toBe('aaa');
});


