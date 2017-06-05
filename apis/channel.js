import * as firebaseTool from '../libs/firebaseTool';

export const getAllChannels = async function () {
  const database = firebaseTool.getDatabaseConnection();
  const channelSnaps = await database.ref('channels').orderByChild('subscriberCount').once('value');
  const channels = [];
  channelSnaps.forEach((channelSnap) => {
    channels.push(channelSnap.val());
  });
  return channels.reverse();
};
