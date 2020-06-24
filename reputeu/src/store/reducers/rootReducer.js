import authReducer from "./authReducer";
import postsReducer from "./postsReducer";
import profileReducer from "./profileReducer";
import communityReducer from "./communityReducer";
import virtueReducer from "./virtueReducer";
import reviewReducer from "./reviewReducer";
import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import notificationsReducer from "./notificationsReducer";
import accountsReducer from "./accountsReducer";

const allReducers = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  profile: profileReducer,
  community: communityReducer,
  virtues: virtueReducer,
  reviews: reviewReducer,
  notifications: notificationsReducer,
  accounts: accountsReducer
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_REDUX") {
    state = undefined;
  }
  return allReducers(state, action);
};

export default rootReducer;
