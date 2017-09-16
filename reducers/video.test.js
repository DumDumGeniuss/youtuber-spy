import videoReducer from './video';

test('Test get videos', () => {
  const state = {
    videos: [],
    totalCount: 0,
    videoCategories: [],
    token: '',
    video: {},
  };
  const action = {
    type: 'GET_VIDEOS',
    videos: [0, 1, 2, 3],
    totalCount: 4,
    videoCategories: ['sport', 'music'],
    token: 'abcd',
  };
  const newState = videoReducer(state, action);

  expect(newState.videos.length).toBe(4);
  expect(newState.totalCount).toBe(4);
  expect(newState.videoCategories[0]).toBe('sport');
  expect(newState.token).toBe('abcd');
});
