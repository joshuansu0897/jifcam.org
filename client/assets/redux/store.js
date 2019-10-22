import { configureStore, getDefaultMiddleware } from "redux-starter-kit";
import rootReducers from "./rootReducers";
import { getToken } from "../../utils/authenticator";
const preloadedState = {
  users: {
    auth: false,
    user: null,
    verified: null,
    notVerified: null,
    list: [],
    userVideos: {},
    token: typeof window !== "undefined" ? getToken() : null,
    offset: 0,
    limit: 20,
    current: {},
    videoList: [],
    all: null,
    importStatus: 0,
    importError: 0,
    mailsStatus: 0,
    importData: null
  }
};
export const initStore = configureStore({
  reducer: rootReducers,
  preloadedState,
  middleware: [...getDefaultMiddleware()]
});
