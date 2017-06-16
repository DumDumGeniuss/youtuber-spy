require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import config from '../config';
import * as tinyHelper from '../libs/tinyHelper';

const getUserInfoApi = 'https://www.googleapis.com/oauth2/v1/userinfo';
const oauthApiurl = 'https://accounts.google.com/o/oauth2/v2/auth';
const clientId = config.client_id;
const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
const response_type = 'token';
const include_granted_scopes = 'true';

export const generateOauthUrl = (path) => {
  const queryString = tinyHelper.getQueryString({
    client_id: clientId,
    redirect_uri: path,
    scope: scope,
    response_type: response_type,
    include_granted_scopes: include_granted_scopes,
  });
  return oauthApiurl + queryString;
};

export const getUserInfo = (token) => {
  const queryString = tinyHelper.getQueryString({
    access_token: token,
  });
  const url = getUserInfoApi + queryString;
  return fetch(url)
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      if (result.error) {
        return null;
      }
      return result;
    });
};

export const getParamsFromCallback = (url) => {
  if (url.indexOf('#') < 0) {
    return {};
  }
  const paramPairs = url.split('#')[1].split('&');
  const params = {};
  paramPairs.forEach((paramPair) => {
    const splitPair = paramPair.split('=');
    params[splitPair[0]] = splitPair[1];
  });
  return params;
};
