import * as channelStatisticApi from '../apis/channelStatistic';

export function getChannelStatistics(channelStatistics, totalCount, token) {
  return {
    type: 'GET_CHANNEL_STATISTICS',
    channelStatistics,
    totalCount,
    token,
  };
}

export const getChannelStatisticsAsync = function (query) {
  return async function (dispatch) {
    const result = await channelStatisticApi.getAllChannelStatistics(query);
    dispatch(
      getChannelStatistics(result.datas, result.totalCount, result.token),
    );
  };
};
