import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'videos';

export const getAllVideos = async function (sort, order, startTime, endTime) {
  const query = {
    sort: sort || '',
    order: order || '',
    startTime: startTime || '',
    endTime: endTime || '',
  };
  const queryString = tinyHelper.getQueryString(query);
  const result = await fetch(apiUrl + queryString, {
    method: 'GET',
  });
  const videos = await result.json();

  return videos;
};
