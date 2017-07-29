const initState = {
  windowWidth: 0,
  windowHeight: 0,
};

const browserAttribute = (state = initState, action) => {
  switch (action.type) {
    case 'SET_WINDOW_SIZE':
      return { ...state, windowWidth: action.windowWidth, windowHeight: action.windowHeight };
    default:
      return state;
  }
};

export default browserAttribute;
