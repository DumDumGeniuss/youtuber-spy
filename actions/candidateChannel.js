import * as candidateChannelApi from '../apis/candidateChannel';
import * as tinyHelper from '../libs/tinyHelper';


export function getCandidateChannels(candidateChannels, totalCount, token) {
  return {
    type: 'GET_CANDIDATE_CHANNELS',
    candidateChannels,
    totalCount,
    token,
  };
}

export const getCandidateChannelsAsync = function (preCandidateChannels, query) {
  return function (dispatch) {
    candidateChannelApi.getCandidateChannels(query)
      .then((result) => {
        const newCandidateChannels = tinyHelper.removeDuplicated(preCandidateChannels.concat(result.datas));
        dispatch(
          getCandidateChannels(newCandidateChannels, result.totalCount, result.token)
        );
      });
  };
};
