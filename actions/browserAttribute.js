export function setBrowserSize(windowWidth, windowHeight) {
  return {
    type: 'SET_WINDOW_SIZE',
    windowWidth,
    windowHeight,
  };
}

export function setRouterChangingStatus(isChanging) {
  return {
    type: 'CHANGE_ROUTER_STATUS',
    isChanging,
  };
}
