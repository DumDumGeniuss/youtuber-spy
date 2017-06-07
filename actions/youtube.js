import * as channelApi from '../apis/channel';


export function getChannels(channels) {
  return {
    type: 'GET_CHANNELS',
    channels,
  };
}

export const getChannelsAsync = function (orderValue) {
  return function (dispatch) {
    channelApi.getAllChannels(orderValue)
      .then((channels) => {
        dispatch(getChannels(channels));
      });
  };
};
