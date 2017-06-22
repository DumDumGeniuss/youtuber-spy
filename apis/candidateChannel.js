import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'candidateChannels';

export const getCandidateChannels = async function (query) {
  const finalQuery = {
    sort: query.sort || '',
    order: query.order || '',
    keyword: query.keyword || '',
    page: query.page || '',
    count: query.count || '',
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + queryString, {
    method: 'GET',
  });
  const resultJson = await result.json();

  return resultJson;
};

export const addCandidateChannel = async function (query, data) {
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

  const statusCode = result.status;
  const resultJson = await result.json();

  resultJson.status = statusCode;

  return resultJson;
};

export const verifyCandidateChannel = async function (query) {
  const finalQuery = {
    access_token: query.access_token,
    action: 'verified',
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + '/' + query.channelId + queryString, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({}),
  });

  const statusCode = result.status;
  const resultJson = await result.json();

  resultJson.status = statusCode;

  return resultJson;
};
