let unsubscribeNotifications = null;

export const signUp = data => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({ type: "SIGN_UP_STARTED" });
  const { email, password, name } = data;
  const firebase = getFirebase();
  const createdUser = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async result => {
      await firebase.auth().signOut();
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
      return result.user;
    })
    .catch(err => {
      console.log(err);
      return err;
    });

  if (createdUser.uid) {
    const { uid, photoURL, phoneNumber } = createdUser;
    await firebase
      .firestore()
      .collection("ru_users")
      .doc(uid)
      .set({
        uid,
        name: name,
        photoURL,
        email,
        phoneNumber,
        handle: uid,
        handleChanged: false,
        gender: "",
        birthday: "",
        introduction: "",
        facebookLink: "",
        twitterLink: "",
        websiteLink: "",
        provider: "reputeu.com",
        joinedOn: new Date()
      })
      .catch(error => {
        console.log("ERROR IN DB CREATION - ", error);
      });

    let sendVerificationEmail = firebase
      .functions()
      .httpsCallable("sendVerificationEmail");

    await sendVerificationEmail({ email: email, name: name })
      .then(result => {
        console.log("email verification", result);
      })
      .catch(function(error) {
        console.log("email email", error);
      });

    dispatch({ type: "USER_LOGGED_OUT" });
    dispatch({ type: "SIGN_UP_SUCCESS" });
  } else {
    console.log("Failed to create user");
    if (createdUser.code === "auth/email-already-in-use") {
      dispatch({
        type: "SIGN_UP_FAIL",
        error: "The given email is already registered in ReputeU"
      });
    } else if (createdUser.code === "auth/network-request-failed") {
      dispatch({
        type: "SIGN_UP_FAIL",
        error:
          "A network error has occured. Please check your network settings and try again later."
      });
    } else {
      dispatch({
        type: "SIGN_UP_FAIL",
        error: "Couldn't create an account. Error code - " + createdUser.code
      });
    }
  }
  dispatch({ type: "SIGN_UP_ENDED" });
};

export const signOut = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  await firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("signed out");
      unsubscribeNotifications();
      dispatch({ type: "RESET_REDUX" });
    })
    .catch(err => {
      dispatch({ type: "SIGN_OUT_ERROR", err });
    });
};

export const signIn = credentials => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    const firebase = getFirebase();
    dispatch({ type: "SIGN_IN_STARTED" });
    dispatch({ type: "LOGIN_ERROR_CAPTCHA_CLOSE" });
    await firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(async user => {
        if (!user.user.emailVerified) {
          await firebase.auth().signOut();
          if (unsubscribeNotifications) {
            unsubscribeNotifications();
          }
          dispatch({
            type: "USER_LOGGED_IN_NOTVERIFIED",
            error: "Please verify your email"
          });
        } else {
          const currentUser = await getCurrentUser(
            user.user.uid,
            dispatch,
            firebase
          );
          dispatch({
            type: "USER_LOGGED_IN",
            currentUser: currentUser
          });
          dispatch({ type: "LOGIN_SUCCESS" });
        }
      });
  } catch (error) {
    authErrors(error, dispatch);
  }

  dispatch({ type: "SIGN_IN_ENDED" });
};

export const signInWithGoogle = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({ type: "SIGN_IN_STARTED" });
    const firebase = getFirebase();
    const firestore = getFirestore();
    const provider = new firebase.auth.GoogleAuthProvider();

    const createdUser = await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async createdUser => {
        return createdUser;
      });

    let { uid, photoURL, phoneNumber, displayName, email } = createdUser.user;

    const doc = await firestore
      .collection("ru_users")
      .doc(uid)
      .get()
      .then(async doc => {
        return doc;
      });

    if (!doc.exists) {
      await firestore
        .collection("ru_users")
        .doc(uid)
        .set({
          uid,
          name: displayName,
          photoURL,
          email,
          phoneNumber,
          handle: uid,
          handleChanged: false,
          gender: "",
          birthday: "",
          introduction: "",
          facebookLink: "",
          twitterLink: "",
          websiteLink: "",
          provider: "google.com",
          joinedOn: new Date()
        });
    }

    const currentUser = await getCurrentUser(
      createdUser.user.uid,
      dispatch,
      firebase
    );
    dispatch({
      type: "USER_LOGGED_IN",
      currentUser: currentUser
    });
    dispatch({ type: "LOGIN_SUCCESS" });
  } catch (error) {
    authErrors(error, dispatch);
  }
  dispatch({ type: "SIGN_IN_ENDED" });
};

export const signInWithFacebook = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({ type: "SIGN_IN_STARTED" });
    const firebase = getFirebase();
    const firestore = getFirestore();
    const provider = new firebase.auth.FacebookAuthProvider();

    const createdUser = await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async createdUser => {
        return createdUser;
      });

    let { uid, photoURL, phoneNumber, displayName, email } = createdUser.user;

    const doc = await firestore
      .collection("ru_users")
      .doc(uid)
      .get()
      .then(async doc => {
        return doc;
      });

    if (!doc.exists) {
      await firestore
        .collection("ru_users")
        .doc(uid)
        .set({
          uid,
          name: displayName,
          photoURL: photoURL + "?height=300",
          email,
          phoneNumber,
          handle: uid,
          handleChanged: false,
          gender: "",
          birthday: "",
          introduction: "",
          facebookLink: "",
          twitterLink: "",
          websiteLink: "",
          provider: "facebook.com",
          joinedOn: new Date()
        });
    }
    const currentUser = await getCurrentUser(
      createdUser.user.uid,
      dispatch,
      firebase
    );
    dispatch({
      type: "USER_LOGGED_IN",
      currentUser: currentUser
    });
    dispatch({ type: "LOGIN_SUCCESS" });
  } catch (error) {
    authErrors(error, dispatch);
  }
  dispatch({ type: "SIGN_IN_ENDED" });
};

export const signInWithTwitter = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({ type: "SIGN_IN_STARTED" });
    const firebase = getFirebase();
    const firestore = getFirestore();
    const provider = new firebase.auth.TwitterAuthProvider();

    const createdUser = await firebase
      .auth()
      .signInWithPopup(provider)
      .then(createdUser => {
        return createdUser;
      });

    let { uid, photoURL, phoneNumber, displayName, email } = createdUser.user;
    photoURL = photoURL.split("_normal").join("");

    const doc = await firestore
      .collection("ru_users")
      .doc(uid)
      .get()
      .then(doc => {
        return doc;
      });

    if (!doc.exists) {
      await firestore
        .collection("ru_users")
        .doc(uid)
        .set({
          uid,
          name: displayName,
          photoURL,
          email,
          phoneNumber,
          handle: uid,
          handleChanged: false,
          gender: "",
          birthday: "",
          introduction: "",
          facebookLink: "",
          twitterLink: "",
          websiteLink: "",
          provider: "twitter.com",
          joinedOn: new Date()
        });
    }

    const currentUser = await getCurrentUser(
      createdUser.user.uid,
      dispatch,
      firebase
    );
    dispatch({
      type: "USER_LOGGED_IN",
      currentUser: currentUser
    });
    dispatch({ type: "LOGIN_SUCCESS" });
  } catch (error) {
    authErrors(error, dispatch);
  }
  dispatch({ type: "SIGN_IN_ENDED" });
};

const getCurrentUser = async (uid, dispatch, firebase) => {
  try {
    const currentUser = await firebase
      .firestore()
      .collection("ru_users")
      .doc(uid)
      .get()
      .then(doc => {
        return doc.data();
      });
    return currentUser;
  } catch (error) {
    console.log("COULDNT GET CURRENT USER", error);
    await firebase.auth().signOut();
    dispatch({
      type: "LOGIN_ERROR",
      error:
        "Couldn't connect to database. Please check your network settings and try again later."
    });
    return error;
  }
};

export const clearAuthErrors = () => {
  return dispatch => dispatch({ type: "CLEAR_AUTH_ERRORS" });
};

const authErrors = (error, dispatch) => {
  if (error.code === "auth/account-exists-with-different-credential") {
    return dispatch({
      type: "LOGIN_ERROR",
      error:
        "Different account with the same email exists. Please use the correct sign in method."
    });
  } else if (error.code === "auth/network-request-failed") {
    return dispatch({
      type: "LOGIN_ERROR",
      error:
        "A network error has occured. Please check your network settings and try again later."
    });
  } else if (error.code === "auth/cancelled-popup-request") {
    return dispatch({
      type: "LOGIN_ERROR",
      error: "Please use only one authentication option at a time"
    });
  } else if (error.code === "auth/user-not-found") {
    dispatch({
      type: "LOGIN_ERROR",
      error: "Incorrect username or password"
    });
  } else if (error.code === "auth/wrong-password") {
    dispatch({
      type: "LOGIN_ERROR",
      error: "Incorrect username or password"
    });
  } else if (error.code === "auth/network-request-failed") {
    dispatch({
      type: "LOGIN_ERROR",
      error:
        "A network error has occured. Please check your network settings and try again later."
    });
  } else if (error.code === "auth/popup-closed-by-user") {
    dispatch({
      type: "LOGIN_ERROR",
      error:
        "Please do not close the popup window. It will be closed automatically when the operation completes"
    });
  } else if (error.code === "auth/too-many-requests") {
    dispatch({
      type: "LOGIN_ERROR",
      error: "Sign in blocked. Please try again later"
    });
    dispatch({ type: "LOGIN_ERROR_CAPTCHA_SHOW" });
  } else {
    dispatch({
      type: "LOGIN_ERROR",
      error: error.message
    });
  }
};

export const updateCurrentUser = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      const currentUser = await getCurrentUser(user.uid, dispatch, firebase);
      getCurrentUserFollowers(user.uid, dispatch, firestore);
      dispatch({
        type: "USER_LOGGED_IN",
        currentUser: currentUser
      });
    } else {
      console.log("not logged in");
    }
  });
};

export const getCurrentUserFollowers = async (uid, dispatch, firestore) => {
  dispatch({
    type: "GETTING_USER_FOLLOWERS_STARTED"
  });

  await firestore
    .collection("ru_followers")
    .doc(uid)
    .get()
    .then(doc => {
      dispatch({
        type: "ADD_USER_FOLLOWERS",
        currentUserFollowers: doc.data()
      });
    })
    .catch(error => {
      console.log(error);
    });
  dispatch({
    type: "GETTING_USER_FOLLOWERS_ENDED"
  });
};

export const getNotifications = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GET_NOTIFICATIONS"
  });
  try {
    const uid = getState().auth.currentUser.uid;
    const firestore = getFirestore();

    unsubscribeNotifications = await firestore
      .collection("ru_user_notifications")
      .doc(uid)
      .collection("ru_user_notifications_sub")
      .orderBy("notiDate", "desc")
      .onSnapshot(snapshot => {
        let noti = [];
        snapshot.forEach(doc => {
          noti.push({ ...doc.data(), notiID: doc.id });
        });

        dispatch({
          type: "GET_NOTIFICATIONS_SUCCESS",
          notifications: noti
        });
      });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GET_NOTIFICATIONS_ERROR",
      error: error
    });
  }
};
