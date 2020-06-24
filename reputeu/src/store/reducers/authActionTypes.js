export const LOGIN_ERROR = (state, action) => {
  return {
    ...state,
    signInFail: action.error
  };
};

export const LOGIN_SUCCESS = state => {
  return {
    ...state,
    signInFail: null
  };
};

export const SIGN_OUT_FAIL = state => {
  return state;
};

export const USER_LOGGED_IN = (state, action) => {
  return {
    ...state,
    currentUser: action.currentUser
  };
};

export const UPDATE_PROFILE = (state, action) => {
  return {
    ...state,
    currentUser: action.currentUser
  };
};

export const USER_LOGGED_OUT = (state, action) => {
  return {
    ...state,
    currentUser: null
  };
};

export const SIGN_UP_STARTED = state => {
  return {
    ...state,
    signUpLoading: true,
    signUpFail: null,
    signInLoading: false,
    signInFail: null,
    signUpSuccess: false
  };
};

export const SIGN_UP_ENDED = state => {
  return {
    ...state,
    signUpLoading: false
  };
};

export const SIGN_IN_STARTED = state => {
  return {
    ...state,
    signUpLoading: false,
    signUpFail: null,
    signInLoading: true,
    signInFail: null
  };
};

export const SIGN_IN_ENDED = state => {
  return {
    ...state,
    signInLoading: false
  };
};

export const SIGN_UP_FAIL = (state, action) => {
  return {
    ...state,
    signUpFail: action.error
  };
};

export const SIGN_UP_SUCCESS = state => {
  return {
    ...state,
    signUpFail: null,
    signUpSuccess: true
  };
};

export const USER_LOGGED_IN_NOTVERIFIED = (state, action) => {
  return {
    ...state,
    signInFail: action.error
  };
};

export const LOGIN_ERROR_CAPTCHA_SHOW = state => {
  return {
    ...state,
    showSignInCaptcha: true
  };
};

export const LOGIN_ERROR_CAPTCHA_CLOSE = state => {
  return {
    ...state,
    showSignInCaptcha: false
  };
};

export const CLEAR_AUTH_ERRORS = state => {
  return {
    ...state,
    signInFail: null,
    signUpFail: null,
    signUpSuccess: false
  };
};

export const GETTING_USER_FOLLOWERS_STARTED = state => {
  return {
    ...state,
    userFollowersLoading: true
  };
};

export const ADD_USER_FOLLOWERS = (state, action) => {
  return {
    ...state,
    currentUserFollowers: action.currentUserFollowers
  };
};

export const GETTING_USER_FOLLOWERS_ENDED = state => {
  return {
    ...state,
    userFollowersLoading: false
  };
};
