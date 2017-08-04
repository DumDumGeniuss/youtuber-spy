import * as commentApi from '../apis/comment';
import * as tinyHelper from '../libs/tinyHelper';


export function getComments(comments, totalCount, token) {
  return {
    type: 'GET_COMMENTS',
    comments,
    totalCount,
    token,
  };
}

export const getCommentsAsync = function (oldComments, query) {
  return function (dispatch) {
    commentApi.getAllComments(query)
      .then((result) => {
        dispatch(
          getComments(oldComments.concat(result.datas), result.totalCount, result.token)
        );
      });
  };
};
