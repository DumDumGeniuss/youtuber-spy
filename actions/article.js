import * as articleApi from '../apis/article';

export function getArticles(articles, totalCount, token) {
  return {
    type: 'GET_ARTICLES',
    articles,
    totalCount,
    token,
  };
}

export const getArticlesAsync = function (oldArticles, query) {
  return async function (dispatch) {
    const result = await articleApi.getAllArticles(query);
    dispatch(
      getArticles(oldArticles.concat(result.datas), result.totalCount, result.token),
    );
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
  return async function (dispatch) {
    const result = await articleApi.getArticle(articleId);
    dispatch(
      getArticle(result.data, result.token),
    );
  };
};
