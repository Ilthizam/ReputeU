const initState = {
  verifyingEmail: false,
  verifyingEmailError: null
};

const accountsReducer = (state = initState, action) => {
  switch (action.type) {
    case "VERIFYING_EMAIL_STARTED":
      return {
        ...state,
        verifyingEmailError: null,
        verifyingEmail: true
      };

    case "VERIFYING_EMAIL_SUCCESS":
      return {
        ...state,
        verifyingEmail: false
      };

    case "VERIFYING_EMAIL_ERROR":
      return {
        ...state,
        verifyingEmailError: action.error,
        verifyingEmail: false
      };

    default:
      return state;
  }
};

export default accountsReducer;
