import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  SIGN_OUT_FAIL,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  SIGN_UP_STARTED,
  SIGN_UP_ENDED,
  SIGN_UP_FAIL,
  SIGN_UP_SUCCESS,
  USER_LOGGED_IN_NOTVERIFIED,
  CLEAR_AUTH_ERRORS,
  SIGN_IN_STARTED,
  SIGN_IN_ENDED,
  UPDATE_PROFILE,
  LOGIN_ERROR_CAPTCHA_SHOW,
  LOGIN_ERROR_CAPTCHA_CLOSE,
  GETTING_USER_FOLLOWERS_STARTED,
  ADD_USER_FOLLOWERS,
  GETTING_USER_FOLLOWERS_ENDED
} from "./authActionTypes";

const initState = {
  signInFail: null,
  signUpLoading: false,
  signUpFail: null,
  signUpSuccess: false,
  currentUser: null,
  showSignInCaptcha: false,
  userFollowersLoading: false,
  currentUserFollowers: null,
  verifyingEmail: false,
  verifyingEmailError: null
};
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      return LOGIN_ERROR(state, action);

    case "LOGIN_SUCCESS":
      return LOGIN_SUCCESS(state);

    case "SIGN_OUT_FAIL":
      return SIGN_OUT_FAIL(state);

    case "USER_LOGGED_IN":
      return USER_LOGGED_IN(state, action);

    case "USER_LOGGED_IN_NOTVERIFIED":
      return USER_LOGGED_IN_NOTVERIFIED(state, action);

    case "USER_LOGGED_OUT":
      return USER_LOGGED_OUT(state, action);

    case "SIGN_UP_STARTED":
      return SIGN_UP_STARTED(state);

    case "SIGN_UP_ENDED":
      return SIGN_UP_ENDED(state);

    case "SIGN_UP_FAIL":
      return SIGN_UP_FAIL(state, action);

    case "SIGN_UP_SUCCESS":
      return SIGN_UP_SUCCESS(state);

    case "CLEAR_AUTH_ERRORS":
      return CLEAR_AUTH_ERRORS(state);

    case "SIGN_IN_STARTED":
      return SIGN_IN_STARTED(state);

    case "SIGN_IN_ENDED":
      return SIGN_IN_ENDED(state);

    case "UPDATE_PROFILE":
      return UPDATE_PROFILE(state, action);

    case "LOGIN_ERROR_CAPTCHA_SHOW":
      return LOGIN_ERROR_CAPTCHA_SHOW(state);

    case "LOGIN_ERROR_CAPTCHA_CLOSE":
      return LOGIN_ERROR_CAPTCHA_CLOSE(state);

    case "GETTING_USER_FOLLOWERS_STARTED":
      return GETTING_USER_FOLLOWERS_STARTED(state);

    case "ADD_USER_FOLLOWERS":
      return ADD_USER_FOLLOWERS(state, action);

    case "GETTING_USER_FOLLOWERS_ENDED":
      return GETTING_USER_FOLLOWERS_ENDED(state);

    default:
      return state;
  }
};

export default authReducer;
