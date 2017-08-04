const initState = {
  comments: [],
  totalCount: 0,
  token: '',
};

const article = (state = initState, action) => {
  switch (action.type) {
    case 'GET_COMMENTS':
      return { ...state, comments: action.comments, totalCount: action.totalCount, token: action.token };
    default:
      return state;
  }
};

export default article;
