import { combineReducers } from 'redux';
import candidateChannel from './candidateChannel';
import channel from './channel';
import video from './video';
import user from './user';

const reducers = combineReducers({
  candidateChannel,
  channel,
  video,
  user,
});

export default reducers;
