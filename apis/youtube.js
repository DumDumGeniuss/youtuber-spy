import config from '../config';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

const youtubeApi = 'https://www.googleapis.com/youtube/v3/';
const apiKey = config.youtube_app_key;

export const getChannels = (parts, ids) => {
  let idParam = '';
  let partParam = '';
  let queryString;
  idParam = encodeURIComponent(ids.toString());
  partParam = encodeURIComponent(parts.toString());
  queryString = '?part=' + partParam + '&id=' + idParam + '&key=' + apiKey;

  return fetch('https://www.googleapis.com/youtube/v3/channels' + queryString, {
    method: 'GET',
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    return res.items;
  });
};
