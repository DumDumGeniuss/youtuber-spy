import { combineReducers } from 'redux';
import candidateChannel from './candidateChannel';
import channel from './channel';
import video from './video';

const reducers = combineReducers({
  candidateChannel,
  channel,
  video,
});

export default reducers;
