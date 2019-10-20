import { videos } from '../stores/videos';
import { USER_ACTIONS } from '../constants';

export function videoReducer(store = videos, action){
    console.log('video reducer', action)
    switch('mount1 reducer', action.type){
        case USER_ACTIONS.ADD_VIDEO_LIST:
            console.log('mount1 reducer in', action, store, Object.assign({}, store, { list: action.data.videos } ));
            return Object.assign({}, store, { list: [
                ...store.list,
                ...action.data.videosList
            ] } );
        break;
        default:
        break;
    }

    return store;
}