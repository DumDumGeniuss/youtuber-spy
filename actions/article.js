import * as articleApi from '../apis/article';
import * as tinyHelper from '../libs/tinyHelper';


export function getArticles(articles, totalCount, token) {
  return {
    type: 'GET_ARTICLES',
    articles,
    totalCount,
    token,
  };
}

export const getArticlesAsync = function (oldArticles, query) {
  return function (dispatch) {
    articleApi.getAllArticles(query)
      .then((result) => {
        dispatch(
          getArticles(oldArticles.concat(result.datas), result.totalCount, result.token)
        );
      });
  };
};

export function getArticle(article, token) {
  return {
    type: 'GET_ARTICLE',
    article,
    token,
  };
}

export const getArticleAsync = function (articleId) {
  return function (dispatch) {
    articleApi.getArticle(articleId)
      .then((result) => {
        dispatch(
          getArticle(result.data, result.token)
        );
      });
  };
};
