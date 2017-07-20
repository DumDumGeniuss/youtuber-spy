import * as channelStatisticApi from '../apis/channelStatistic';
import * as tinyHelper from '../libs/tinyHelper';

export function getChannelStatistics(channelStatistics, totalCount, token) {
  return {
    type: 'GET_CHANNEL_STATISTICS',
    channelStatistics,
    totalCount,
    token,
  };
}

export const getChannelStatisticsAsync = function (query) {
  return function (dispatch) {
    channelStatisticApi.getAllChannelStatistics(query)
      .then((result) => {
        dispatch(
          getChannelStatistics(result.datas, result.totalCount, result.token)
        );
      });
  };
};
