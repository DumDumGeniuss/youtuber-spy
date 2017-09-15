import * as videoAction from './video';
jest.mock('../apis/video');
import * as videoApi from '../apis/video';

test('Test action GET_VIDEOS', () => {
  const object = videoAction.getVideos([1, 2], 100, ['sport'], 'abcd');
  expect(object.type).toBe('GET_VIDEOS');
  expect(object.videos.length).toBe(2);
  expect(object.totalCount).toBe(100);
  expect(object.videoCategories.length).toBe(1);
  expect(object.token).toBe('abcd');
});

test('Test async action GET_VIDEOS', async () => {
  const object = videoAction.getVideosAsync([], {});
  videoApi.getAllVideos = async function () {
    return {
      datas: [1, 2],
      totalCount: 100,
      videoCategories: ['sport'],
      token: 'abcd',
    };
  };
  const dispatch = jest.fn();
  await object(dispatch);

  // Have been called on time
  expect(dispatch.mock.calls.length).toBe(1);

  expect(dispatch.mock.calls[0][0].type).toBe('GET_VIDEOS');
  expect(dispatch.mock.calls[0][0].videos.length).toBe(2);
  expect(dispatch.mock.calls[0][0].totalCount).toBe(100);
  expect(dispatch.mock.calls[0][0].videoCategories.length).toBe(1);
  expect(dispatch.mock.calls[0][0].token).toBe('abcd');
});
