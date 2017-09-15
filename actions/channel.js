import * as channelApi from '../apis/channel';
import * as tinyHelper from '../libs/tinyHelper';


export function getChannels(channels, totalCount, channelCategories, countryCategories, token) {
  return {
    type: 'GET_CHANNELS',
    channels,
    totalCount,
    channelCategories,
    countryCategories,
    token,
  };
}

export const getChannelsAsync = function (preChannels, query) {
  return async function (dispatch) {
    const result = await channelApi.getAllChannels(query)
    dispatch(
      getChannels(result.datas, result.totalCount, result.channelCategories, result.countryCategories, result.token)
    );
  };
};

export function getChannel(channel, token) {
  return {
    type: 'GET_CHANNEL',
    channel,
    token,
  };
}

export const getChannelAsync = function (channelId) {
  return async function (dispatch) {
    const result = await channelApi.getChannel(channelId)
    dispatch(
      getChannel(result.data, result.token)
    );
  };
};
