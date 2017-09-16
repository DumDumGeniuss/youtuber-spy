import config from '../config';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'comments';

export const getAllComments = async function (query) {
  const finalQuery = {
    sort: query.sort || 'createdAt',
    order: query.order || '',
    count: query.count || '',
    startTime: query.startTime || '',
    endTime: query.endTime || '',
    articleId: query.articleId || '',
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + queryString, {
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

export const addComment = async function (query, data) {
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
    throw {
      status: result.status,
      message: resultJson.message, 
    }
  }

  return resultJson;
};

export const deleteComment = async function (query, commentId) {
  const finalQuery = {
    access_token: query.access_token,
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + '/' + commentId + queryString, {
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
