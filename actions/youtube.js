import * as channelApi from '../apis/channel';


export function getChannels(channels) {
  return {
    type: 'GET_CHANNELS',
    channels,
  };
}

export const getChannelsAsync = function () {
  return function (dispatch) {
    channelApi.getAllChannels()
      .then((channels) => {
        dispatch(getChannels(channels));
      });
  };
};
