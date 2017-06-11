import * as channelApi from '../apis/channel';
import * as tinyHelper from '../libs/tinyHelper';


export function getChannels(channels, totalCount, token) {
  return {
    type: 'GET_CHANNELS',
    channels,
    totalCount,
    token,
  };
}

export const getChannelsAsync = function (preChannels, query) {
  return function (dispatch) {
    channelApi.getAllChannels(query)
      .then((result) => {
        const newChannels = tinyHelper.removeDuplicated(preChannels.concat(result.datas));
        dispatch(
          getChannels(newChannels, result.totalCount, result.token)
        );
      });
  };
};
