    
import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { USER_ACTIONS } from '../constants';
import { authUser, getUserList, imporUserData, getInfoVerified, getOneUserData, sendVerificationEmails, removeUsers, getUserVideos } from '../actions/users';

function* reqAuthUser(action){
    // console.log(action);
    try {
        let userData = yield call(authUser, action.data.username, action.data.password);
        yield put({type: USER_ACTIONS.UPADTE_AUTH, data: { user: userData.data.user, token: userData.data.token } });
    } catch (error) {
        yield put({ type: USER_ACTIONS.FAIL_AUTH });
    }
}

function* reqGetUserList(action){
    try{
        let usersData = yield call(getUserList, action.data.offset, action.data.limit, action.data.token);
        yield put({type: USER_ACTIONS.UPDATE_LIST, data: {
            list: usersData.data.users, 
            offset:  usersData.data.offset, 
            limit: usersData.data.limit, 
            all: usersData.data.countAll
        }})
    }catch(err){
        yield put({ type: USER_ACTIONS.FAIL_LOAD_LIST });
        yield put({ type: USER_ACTIONS.SIGNOUT })
    }

}

function* reqGetVideosList(action){
    console.log('mount1 am', action);
    try{
        let videoList = yield call(getUserVideos, action.data.offset, action.data.token);
        console.log(videoList.data)
        yield put({type: USER_ACTIONS.ADD_VIDEO_LIST, data: {
            videosList: videoList.data, 
        }})
    }catch(err){
        console.log('error', err);
        yield put({ type: USER_ACTIONS.FAIL_LOAD_LIST });
        yield put({ type: USER_ACTIONS.SIGNOUT })
    }

}

function* importUserData(action){
    try{
        let userData = yield call(imporUserData, action.data.formData, action.data.token );
        yield put({type: USER_ACTIONS.COMPLETE_IMPORT, data: {
            success: userData.data.success, 
            fails: userData.data.fails, 
            fieled: userData.data.fieled } 
        })
    }catch(err){
        yield put({type: USER_ACTIONS.RESET_IMPORT_STATUS});
    }
}

function* requestVerfiedInfo(action){
    try{
        let userData = yield call(getInfoVerified, action.data.token)
        console.log(userData);
        yield put({type: USER_ACTIONS.UPADTE_INFO_VERIFIED, data: userData.data});
    }catch(err){

    }
}

function* requestOneUserData(action){
    try{
        let userData = yield call(getOneUserData, action.data.id, action.data.token)
        yield put({type: USER_ACTIONS.UPDATE_ONE_DATA, data: userData.data});
    }catch(err){

    }
}

function* requestMoreUsers(action){
    try{
        let userData = yield call(getUserList,  action.data.offset, action.data.limit, action.data.token);
        yield put({type: USER_ACTIONS.LOAD_MORE_USERS_SUCCESS, data: {  
                list: userData.data.users, 
                offset:  userData.data.offset, 
                limit: userData.data.limit, 
                all: userData.data.countAll 
            }
        })
    }catch(err){
        
    }
}

function* requestSendMails(action){
    console.log(action);
    try{
        let data = yield call(sendVerificationEmails, action.data, action.token);
        yield put({type: USER_ACTIONS.COMPLETED_MAILING_VERIFICATIONS})
    }catch(err){
        yield put({type: USER_ACTIONS.FIALED_EMAIL_SEND});
    }
}

function* deleteUsers(action){
    try{
        let data = yield call(removeUsers, action.list, action.token);
        yield delay(500);
        yield put({type: USER_ACTIONS.REMOVE_COMPLETED});
        let usersData = yield call(getUserList, 0, 10, token);
        yield put({type: USER_ACTIONS.UPDATE_LIST, data: {
            list: usersData.data.users, 
            offset: usersData.data.offset, 
            limit: usersData.data.limit, 
            all: usersData.data.countAll
        }})
    }catch(err){
        yield delay(500);
        yield put({type: USER_ACTIONS.REMOVE_FIALED});
        let usersData = yield call(getUserList, 0, 10, action.token);
        yield put({type: USER_ACTIONS.UPDATE_LIST, data: {
            list: usersData.data.users, 
            offset:  usersData.data.offset, 
            limit: usersData.data.limit, 
            all: usersData.data.countAll
        }})
    }
}

function* actionsSaga(){
    yield takeEvery(USER_ACTIONS.REQUEST_AUTH, reqAuthUser);
    yield takeEvery(USER_ACTIONS.REQUEST_LIST, reqGetUserList);
    yield takeEvery(USER_ACTIONS.REQUEST_IMPORT, importUserData);
    yield takeEvery(USER_ACTIONS.REQUEST_INFO_VERIFIED, requestVerfiedInfo);
    yield takeEvery(USER_ACTIONS.REQUEST_ONE_DATA, requestOneUserData);
    yield takeEvery(USER_ACTIONS.LOAD_MORE_USERS, requestMoreUsers);
    yield takeEvery(USER_ACTIONS.REQEUST_SEND_VERIFICATION_EMAILS, requestSendMails);
    yield takeEvery(USER_ACTIONS.REQUEST_REMOVE, deleteUsers);
    yield takeEvery(USER_ACTIONS.GET_VIDEO_LIST, reqGetVideosList);
    
    console.log('Hello Sagas!');
}


export default actionsSaga;