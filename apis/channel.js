import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'channels';

export const getAllChannels = async function (query) {
  const finalQuery = {
    sort: query.sort || '',
    order: query.order || '',
    keyword: query.keyword || '',
    category: query.category || '',
    country: query.country || '',
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

export const getChannel = async function (channelId) {
  const result = await fetch(apiUrl + '/' + channelId, {
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

export const getRandomChannel = async function () {
  const result = await fetch(apiUrl + '/xxx?random=true', {
    method: 'GET',
  });
  const resultJson = await result.json();

  return resultJson;
};
