import * as channelApi from '../apis/channel';


export function getChannels(channels) {
  return {
    type: 'GET_CHANNELS',
    channels,
  };
}

export const getChannelsAsync = function (sort, order) {
  return function (dispatch) {
    channelApi.getAllChannels(sort, order)
      .then((channels) => {
        dispatch(getChannels(channels));
      });
  };
};
