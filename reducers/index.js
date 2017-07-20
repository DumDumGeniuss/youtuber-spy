import { combineReducers } from 'redux';
import candidateChannel from './candidateChannel';
import channel from './channel';
import video from './video';
import user from './user';
import article from './article';
import channelStatistic from './channelStatistic';

const reducers = combineReducers({
  candidateChannel,
  channel,
  video,
  user,
  article,
  channelStatistic,
});

export default reducers;
