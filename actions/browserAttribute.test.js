import * as browserAttributeAction from './browserAttribute';

test('Test action SET_WINDOW_SIZE', () => {
  const object = browserAttributeAction.setBrowserSize(100, 200);
  expect(object.type).toBe('SET_WINDOW_SIZE');
  expect(object.windowWidth).toBe(100);
  expect(object.windowHeight).toBe(200);
});

test('Test action CHANGE_ROUTER_STATUS', () => {
  const object = browserAttributeAction.setRouterChangingStatus(true);
  expect(object.type).toBe('CHANGE_ROUTER_STATUS');
  expect(object.isChanging).toBe(true);
});
