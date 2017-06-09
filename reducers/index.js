import { combineReducers } from 'redux';
import channel from './channel';
import video from './video';

const reducers = combineReducers({
  channel,
  video,
});

export default reducers;
