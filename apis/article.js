import config from '../config';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'articles';

export const getAllArticles = async function (query) {
  const finalQuery = {
    sort: query.sort || 'createdAt',
    order: query.order || '',
    keyword: query.keyword || '',
    count: query.count || '',
    startTime: query.startTime || '',
    endTime: query.endTime || '',
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + queryString, {
    method: 'GET',
  });
  const resultJson = await result.json();

  return resultJson;
};

export const getArticle = async function (articleId) {
  const result = await fetch(apiUrl + '/' + articleId, {
    method: 'GET',
  });
  const resultJson = await result.json();
  if (result.status !== 200) {
    throw {
      status: result.status,
      message: resultJson.message, 
    }
  }

  return resultJson;
};

export const addArticle = async function (query, data) {
  const finalQuery = {
    access_token: query.access_token,
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + queryString, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
  const resultJson = await result.json();

  if (result.status !== 200) {
    return {
      status: result.status,
      message: resultJson.message, 
    }
  }

  return resultJson;
};

export const updateArticle = async function (articleId, query, data) {
  const finalQuery = {
    access_token: query.access_token,
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + '/' + articleId + queryString, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const resultJson = await result.json();

  if (result.status !== 200) {
    throw {
      status: result.status,
      message: resultJson.message, 
    }
  }

  return resultJson;
};

export const deleteArticle = async function (query, articleId) {
  const finalQuery = {
    access_token: query.access_token,
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + '/' + articleId + queryString, {
    method: 'DELETE',
  });
  const resultJson = await result.json();
  if (result.status !== 200) {
    throw {
      status: result.status,
      message: resultJson.message,
    };
  }

  return resultJson;
};
