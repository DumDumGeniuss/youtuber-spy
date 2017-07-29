import { combineReducers } from 'redux';
import candidateChannel from './candidateChannel';
import channel from './channel';
import video from './video';
import user from './user';
import article from './article';
import channelStatistic from './channelStatistic';
import i18n from './i18n';
import browserAttribute from './browserAttribute';

const reducers = combineReducers({
  candidateChannel,
  channel,
  video,
  user,
  article,
  channelStatistic,
  i18n,
  browserAttribute,
});

export default reducers;
