
import { getCookie } from '../utils/cookies';

let userDataEncoded = getCookie('userdata');

let userData;
if(userDataEncoded){
    userData = JSON.parse(decodeURIComponent(userDataEncoded));
}

export const users = {
    logged: userData?userData.user:null,
    token: userData?userData.token:"",
    current: null,
    videoList: [],
    list: [],
    offset: 0,
    limit: 10,
    all: 0,
    infinityLoad: {
        list: [],
        loaded: 0,
        all: 0,
        isLoading: false
    },
    verifiedInfo: {
        verified: 0,
        notVerified: 0
    },
    requestStatuses: {   // 0 - active, 1 - pending, 2 - success, 3 - error
        auth: 0,
        list: 0,
        import: 0,
        mails: 0,
        actions: 0
    },
    importResults:{
        completed: false,
        created: 0,
        fieled: 0,
        errors: []
    }
}