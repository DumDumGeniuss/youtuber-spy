export function setBrowserSize(windowWidth, windowHeight) {
  return {
    type: 'SET_WINDOW_SIZE',
    windowWidth,
    windowHeight,
  };
}
