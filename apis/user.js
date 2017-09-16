import config from '../config';

require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import * as tinyHelper from '../libs/tinyHelper';

const apiUrl = config.serverless_url + 'users';

export const addUser = async function (query) {

  const queryString = tinyHelper.getQueryString(query);
  const result = await fetch(apiUrl + queryString, {
    method: 'POST',
  });
  const resultJson = await result.json();

  return resultJson;
};
