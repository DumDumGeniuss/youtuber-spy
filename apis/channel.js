import * as firebaseTool from '../libs/firebaseTool';

export const getAllChannels = async function (orderValue) {
  const database = firebaseTool.getDatabaseConnection();
  const channelSnaps = await database.ref('channels').orderByChild(orderValue).once('value');
  const channels = [];
  channelSnaps.forEach((channelSnap) => {
    channels.push(channelSnap.val());
  });
  return channels.reverse();
};
