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

export function verifyCandidateChannel(channelId) {
  return {
    type: 'VERIFY_CANDIDATE_CHANNEL',
    channelId,
  };
}

export const verifyCandidateChannelAsync = function (query) {
  return function (dispatch) {
    candidateChannelApi.verifyCandidateChannel(query)
      .then((result) => {
        if (result.status === 200) {
          dispatch(
            verifyCandidateChannel(query.channelId)
          );
        }
      });
  };
};

export function deleteCandidateChannel(channelId) {
  return {
    type: 'DELETE_CANDIDATE_CHANNEL',
    channelId,
  };
}

export function deleteCandidateChannelAsync(channelId, accessToken) {
  return function (dispatch) {
    candidateChannelApi.deleteCandidateChannel(channelId, accessToken)
      .then((result) => {
        if (result.status === 200) {
          dispatch(
            deleteCandidateChannel(channelId)
          );
        }
      });
  }
}
