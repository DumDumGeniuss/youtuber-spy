import * as userApi from '../apis/user';
import * as youtubeApi from '../apis/youtube';
import config from '../config';

/* Check if the user is admin */
const superUserList = config.super_users.split(',');

export function getUser(user, isSuperUser) {
  return {
    type: 'ADD_USER',
    user,
    isSuperUser,
  };
}

export const getUserAsync = function (token) {
  return async function (dispatch) {
    const result = await youtubeApi.getUserInfo(token);
    /* If error occurs, put null, means login fail */
    if (!result) {
      dispatch(getUser(null, null));
    } else {
      let isSuperUser = false;
      if (superUserList.indexOf(result.id) >= 0) {
        isSuperUser = true;
      }
      userApi.addUser({
        access_token: token,
      });
      dispatch(getUser(result, isSuperUser));
    }
  };
};
