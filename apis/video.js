import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'videos';

export const getAllVideos = async function (query) {
  const finalQuery = {
    sort: query.sort || '',
    order: query.order || '',
    keyword: query.keyword || '',
    startTime: query.startTime || '',
    endTime: query.endTime || '',
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
