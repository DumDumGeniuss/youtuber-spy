const initState = {
  articles: [],
  totalCount: 0,
  token: '',
  article: {},
};

const article = (state = initState, action) => {
  switch (action.type) {
    case 'GET_ARTICLES':
      return { ...state, articles: action.articles, totalCount: action.totalCount, token: action.token };
    case 'GET_ARTICLE':
      return { ...state, article: action.article };
    default:
      return state;
  }
};

export default article;
