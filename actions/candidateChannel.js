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
  return async function (dispatch) {
    const result = await candidateChannelApi.getCandidateChannels(query)
    dispatch(
      getCandidateChannels(result.datas, result.totalCount, result.token)
    );
  };
};

export function verifyCandidateChannel(channelId) {
  return {
    type: 'VERIFY_CANDIDATE_CHANNEL',
    channelId,
  };
}

export const verifyCandidateChannelAsync = function (query) {
  return async function (dispatch) {
    const result = await candidateChannelApi.verifyCandidateChannel(query)
    if (result.status === 200) {
      dispatch(
        verifyCandidateChannel(query.channelId)
      );
    }
  };
};

export function deleteCandidateChannel(channelId) {
  return {
    type: 'DELETE_CANDIDATE_CHANNEL',
    channelId,
  };
}

export function deleteCandidateChannelAsync(channelId, accessToken) {
  return async function (dispatch) {
    const result = await candidateChannelApi.deleteCandidateChannel(channelId, accessToken)
    if (result.status === 200) {
      dispatch(
        deleteCandidateChannel(channelId)
      );
    }
  }
}
