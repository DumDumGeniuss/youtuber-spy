import { combineReducers } from 'redux';
import candidateChannel from './candidateChannel';
import channel from './channel';
import video from './video';
import user from './user';
import article from './article';

const reducers = combineReducers({
  candidateChannel,
  channel,
  video,
  user,
  article,
});

export default reducers;
