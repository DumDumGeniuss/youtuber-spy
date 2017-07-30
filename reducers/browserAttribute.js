const initState = {
  windowWidth: 0,
  windowHeight: 0,
  isRouterChanging: false,
};

const browserAttribute = (state = initState, action) => {
  switch (action.type) {
    case 'SET_WINDOW_SIZE':
      return { ...state, windowWidth: action.windowWidth, windowHeight: action.windowHeight };
    case 'CHANGE_ROUTER_STATUS':
      return { ...state, isRouterChanging: action.isChanging };
    default:
      return state;
  }
};

export default browserAttribute;
