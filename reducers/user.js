const initState = {
  userInfo: null,
  isSuperUser: false,
};

const user = (state = initState, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return { ...state, userInfo: action.user, isSuperUser: action.isSuperUser };
    default:
      return state;
  }
};

export default user;
