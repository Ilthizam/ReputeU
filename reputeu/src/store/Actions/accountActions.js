export const verifyEmail = code => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({ type: "VERIFYING_EMAIL_STARTED" });
  const firebase = getFirebase();
  try {
    await firebase.auth().applyActionCode(code);
    dispatch({ type: "VERIFYING_EMAIL_SUCCESS" });
  } catch (error) {
    console.log(error);
    dispatch({ type: "VERIFYING_EMAIL_ERROR", error: error });
  }
};
