import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'channelStatistics';

export const getAllChannelStatistics = async function (query) {
  const finalQuery = {
    sort: query.sort || '',
    order: query.order || '',
    startTime: query.startTime || '',
    endTime: query.endTime || '',
    page: query.page || '',
    count: query.count || '',
    channelId: query.channelId || '',
  };
  const queryString = tinyHelper.getQueryString(finalQuery);
  const result = await fetch(apiUrl + queryString, {
    method: 'GET',
  });
  const resultJson = await result.json();

  return resultJson;
};
