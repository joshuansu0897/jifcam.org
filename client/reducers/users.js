import { users } from '../stores/users';
import { USER_ACTIONS } from '../constants';
import { setCookie, deleteCookie } from '../utils/cookies';

export function userReducer(store = users, action){
    let requestStatuses;
    let infinityLoad;

    switch(action.type){
        case USER_ACTIONS.REQUEST_AUTH:
            requestStatuses = Object.assign({}, store.requestStatuses, { auth: 1 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );
        break;
        case USER_ACTIONS.REQUEST_LIST:
            requestStatuses = Object.assign({}, store.requestStatuses, { list: 1 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses })
        break;
        case USER_ACTIONS.REQUEST_IMPORT:
            requestStatuses = Object.assign({}, store.requestStatuses, { import: 1 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses });
        break;
        case USER_ACTIONS.RESET_IMPORT_STATUS:
            requestStatuses = Object.assign({}, store.requestStatuses, { import: 0 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses, importResults:{
                completed: false,
                created: 0,
                fieled: 0,
                errors: []
            } })            
        break;
        case USER_ACTIONS.SIGNOUT:
            requestStatuses = Object.assign({}, store.requestStatuses, { auth: 0 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses, user: null, token:"" });
            deleteCookie('userdata');
        break;
        case USER_ACTIONS.UPADTE_INFO_VERIFIED:
            store = Object.assign({}, store, { verifiedInfo: action.data });
        break;
        case USER_ACTIONS.UPDATE_ONE_DATA:
            store = Object.assign({}, store, { current: action.data });
        break;
        case USER_ACTIONS.UPADTE_AUTH:
                if(typeof action.data === 'object'){
                    let token = "";
                    let user = null;
                    if(typeof action.data.token === 'string') token = action.data.token; else token = store.token;
                    if(typeof action.data.user === 'object') user = action.data.user;
                    
                    requestStatuses = Object.assign({}, store.requestStatuses, { auth: 2 });
                    store = Object.assign({}, store, { logged: user, token: token, requestStatuses: requestStatuses } );
                    setCookie('userdata', encodeURIComponent( JSON.stringify({ user: user, token: token }) ), 8);
                }else{
                    store = Object.assign({}, store, { logged: null, token: "" } );
                }
        break;
        case USER_ACTIONS.FAIL_AUTH:
            requestStatuses = Object.assign({}, store.requestStatuses, { auth: 3 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses });
        break;
        case USER_ACTIONS.UPDATE_LIST:
            store = Object.assign({}, store, { 
                list: action.data.list, 
                offset: action.data.offset, 
                limit: action.data.limit, 
                all: action.data.all 
            });
        break;
        case USER_ACTIONS.COMPLETE_IMPORT:
            requestStatuses = Object.assign({}, store.requestStatuses, { import: 2 });
            store = Object.assign({}, store, { 
                requestStatuses: requestStatuses,
                importResults: {
                    completed: true,
                    created: action.data.success,
                    fieled: action.data.fails,
                    errors: action.data.fieled
                }
            });
        break;
        case USER_ACTIONS.LOAD_MORE_USERS:
            infinityLoad = Object.assign({}, store.infinityLoad, { isLoading: true });
            
            store = Object.assign({}, store, {
                infinityLoad: infinityLoad
            });
        break;
        case USER_ACTIONS.LOAD_MORE_USERS_SUCCESS:
    
            infinityLoad = Object.assign({}, store.infinityLoad, { 
                isLoading: false,
                list: [ ...store.infinityLoad.list ,...action.data.list], 
                loaded: store.infinityLoad.loaded + action.data.list.length,
                all: action.data.all
            });
            
            store = Object.assign({}, store, {
                infinityLoad: infinityLoad
            });
        break;
        case USER_ACTIONS.REQEUST_SEND_VERIFICATION_EMAILS:
            requestStatuses = Object.assign({}, store.requestStatuses, { mails: 1 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );
        break;
        case USER_ACTIONS.COMPLETED_MAILING_VERIFICATIONS:
            requestStatuses = Object.assign({}, store.requestStatuses, { mails: 2 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );
        break;
        case USER_ACTIONS.RESET_MAIL_STATUS:        
            requestStatuses = Object.assign({}, store.requestStatuses, { mails: 0 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );
        break;
        case USER_ACTIONS.FIALED_EMAIL_SEND:
            requestStatuses = Object.assign({}, store.requestStatuses, { mails: 3 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );
        break;
        case USER_ACTIONS.REQUEST_REMOVE:
            requestStatuses = Object.assign({}, store.requestStatuses, { actions: 1 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );        
        break;
        case USER_ACTIONS.REMOVE_COMPLETED:
            requestStatuses = Object.assign({}, store.requestStatuses, { actions: 2 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );  
        break;        
        case USER_ACTIONS.REMOVE_FIALED:
            requestStatuses = Object.assign({}, store.requestStatuses, { actions: 3 });
            store = Object.assign({}, store, { requestStatuses: requestStatuses } );  
        break;
        default:
        break;
    }

    return store;
}