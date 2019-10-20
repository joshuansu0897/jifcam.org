import { combineReducers } from 'redux';

import { userReducer } from './users';
import { videoReducer } from './videos'

export default combineReducers({
    users: userReducer,
    videos: videoReducer,
})