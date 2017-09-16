import browserAttributeReducer from './browserAttribute';

test('Test set window size', () => {
  const state = {
    windowWidth: 0,
    windowHeight: 0,
    isRouterChanging: false,
  };
  const action = {
    type: 'SET_WINDOW_SIZE',
    windowWidth: 200,
    windowHeight: 400,
  };
  const newState = browserAttributeReducer(state, action);

  expect(newState.windowWidth).toBe(200);
  expect(newState.windowHeight).toBe(400);
});

test('Test change router status', () => {
  const state = {
    windowWidth: 0,
    windowHeight: 0,
    isRouterChanging: false,
  };
  const action = {
    type: 'CHANGE_ROUTER_STATUS',
    isChanging: true,
  };
  const newState = browserAttributeReducer(state, action);

  expect(newState.isRouterChanging).toBe(true);
});
