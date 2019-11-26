import { createSlice } from "redux-starter-kit";
import axios from "../../utils/axios";
import { getToken } from "../../utils/authenticator";
const preUsersSlice = createSlice({
    initialState: {
        auth: false,
        user: null,
        verified: null,
        notVerified: null,
        list: [],
        userVideos: {},
        videoList: [],
        token: typeof window !== "undefined" ? getToken() : null,
        offset: 0,
        limit: 20,
        all: null,
        current: {},
        importStatus: 0,
        importError: 0,
        mailsStatus: 0,
        importData: null,
        videoNotLoardMore: false
    },
    name: "users",
    reducers: {
        getUsersSucces: (state, action) => {
            return {
                ...state,
                list: action.payload.data.users,
                offset: action.payload.data.offset,
                limit: action.payload.data.limit,
                all: action.payload.data.countAll
            };
        },

        getUserVideosSucces: (state, action) => {
            return {
                ...state,
                videoList: action.payload.data.sort((a, b) => {
                    return new Date(b.created) - new Date(a.created);
                })
            };
        },

        addUserVideosSucces: (state, action) => {
            let videoNotLoardMore = false;
            if (action.payload.data.length === 0) {
                videoNotLoardMore = true;
            }
            return {
                ...state,
                videoNotLoardMore,
                videoList: [
                    ...state.videoList,
                    ...action.payload.data.sort((a, b) => {
                        return new Date(b.created) - new Date(a.created);
                    })
                ]
            };
        },

        getUsersInfoSucces: (state, action) => {
            return {
                ...state,
                verified: action.payload.data.verified,
                notVerified: action.payload.data.notVerified
            };
        },

        getOneUserDataSucces: (state, action) => {
            return { ...state, current: action.payload.data };
        },
        removeUsersSucces: (state, action) => {
            return state;
        },

        requestImportSucces: (state, action) => {
            return {
                ...state,
                importStatus: action.payload.importStatus || 2,
                importData: {
                    ...action.payload.data,
                    errors: action.payload.data.fieled
                }
            };
        },
        requestImportStart: (state, action) => {
            return {
                ...state,
                importStatus: 1
                // importData: action.payload.data
            };
        },
        resetImport: (state, action) => {
            return {
                ...state,
                importStatus: 0,
                importData: {}
            };
        },
        logout: state => ({
            ...state,
            token: null
        }),
        AuthUserSucces: (state, action) => {
            return {
                ...state,
                user: action.payload.data.user,
                token: action.payload.data.token,
                auth: true
            };
        },
        sendMailsSucces: (state, action) => {
            return {
                ...state,
                mailsStatus: 2
            };
        },
        resetMails: (state, action) => {
            return {
                ...state,
                mailsStatus: 0
            };
        },
        sendMailsError: (state, action) => {
            return {
                ...state,
                mailsStatus: 3
            };
        },
        sendMailsStart: (state, action) => {
            return {
                ...state,
                mailsStatus: 1
            };
        }
    }
});

const {
    AuthUserSucces,
    getUsersSucces,
    getUsersInfoSucces,
    getUserVideosSucces,
    requestImportSucces,
    requestImportStart,
    resetMails,
    sendMailsStart,
    sendMailsSucces,
    sendMailsError,
    resetImport,
    addUserVideosSucces,
    getOneUserDataSucces,
    removeUsersSucces,
    logout
} = preUsersSlice.actions;

const actions = {
    AuthUser: payload => async dispatch => {
        try {
            const res = await axios.post("/api/users/auth", {
                username: payload.username,
                password: payload.password
            });
            dispatch(AuthUserSucces(res.data));
            return res.data.data.token;
        } catch (err) {
            console.error(err);
            return "";
        }
    },
    getUsers: payload => async dispatch => {
        try {
            const res = await axios.get(
                "/api/users?offset=" + payload.offset + "&limit=" + payload.limit
            );
            dispatch(getUsersSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    getUsersInfo: payload => async dispatch => {
        try {
            const res = await axios.get("/api/users/verify/count/");
            dispatch(getUsersInfoSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    getOneUserData: payload => async dispatch => {
        try {
            const res = await axios.get("/api/users/" + payload.id);
            console.log(res);
            dispatch(getOneUserDataSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    getUserVideos: payload => async dispatch => {
        try {
            const url =
                typeof payload.offset === "number" && payload.offset > 0
                    ? `/api/videos/master/list?skip=${payload.offset}`
                    : "/api/videos/master/list";
            const res = await axios.get(url);
            dispatch(getUserVideosSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    removeUsers: payload => async dispatch => {
        try {
            const res = await axios.post("/api/users/remove", { list: payload.list });
            console.log(res);
            dispatch(removeUsersSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    addUserVideos: payload => async dispatch => {
        try {
            if (!payload.offset || payload.offset === 0)
                throw new Error("Invalid offset value");
            const url = `/api/videos/master/list/${
                payload.offset
                }?limit=${payload.limit || 24}`;
            const res = await axios.get(url);
            dispatch(addUserVideosSucces(res.data));
        } catch (err) {
            console.error(err);
        }
    },
    requestImport: payload => async dispatch => {
        try {
            dispatch(requestImportStart());
            const res = await axios.post("/api/users/import", payload.formData);
            console.log(res, "---------------> import");
            dispatch(requestImportSucces(res.data));
        } catch (err) {
            dispatch(resetImport());
            console.error(err);
        }
    },
    resetImport,
    resetMails,
    logout,
    sendMails: payload => async dispatch => {
        try {
            dispatch(sendMailsStart());
            const res = await axios.post("/api/users/mail", payload.data);
            dispatch(sendMailsSucces(res));
        } catch (err) {
            dispatch(sendMailsError());
            console.error(err);
        }
    }
};

export const usersSlice = {
    reducer: preUsersSlice.reducer,
    actions
};
