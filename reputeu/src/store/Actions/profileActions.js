import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export const changeProfilePicture = file => async (dispatch, getState) => {
  dispatch({ type: "UPLOAD_PROFILE_PIC_STARTED" });
  const storageRef = firebase.storage().ref();
  const uid = getState().auth.currentUser.uid;
  const uploadTask = storageRef
    .child("profile-pictures/" + uid + "/pro-pic.jpg")
    .put(file);

  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED,
    function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      dispatch({
        type: "UPLOAD_PROFILE_PIC_PROGRESS",
        imageUploadProgress: progress
      });
    },
    error => {
      console.log(error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then(async downloadURL => {
        await firebase
          .firestore()
          .collection("ru_users")
          .doc(uid)
          .update({
            photoURL: downloadURL
          })
          .then(() => {
            dispatch({ type: "UPLOAD_PROFILE_PIC_ENDED" });
            const currentUser = {
              ...getState().auth.currentUser,
              photoURL: downloadURL
            };
            dispatch({
              type: "UPDATE_PROFILE",
              currentUser: currentUser
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  );
};

export const updatePersonalDetails = ({
  name,
  gender,
  birthday,
  introduction
}) => async (dispatch, getState) => {
  dispatch({ type: "UPDATE_PERSONAL_DETAILS_STARTED" });
  const uid = getState().firebase.auth.uid;
  await firebase
    .firestore()
    .collection("ru_users")
    .doc(uid)
    .update({
      name: name,
      gender: gender,
      birthday: birthday,
      introduction: introduction
    })
    .then(() => {
      const currentUser = {
        ...getState().auth.currentUser,
        name: name,
        gender: gender,
        birthday: birthday,
        introduction: introduction
      };
      dispatch({
        type: "UPDATE_PROFILE",
        currentUser: currentUser
      });
    })
    .catch(error => {
      console.log("ERROR - ", error);
      return;
    });
  dispatch({ type: "UPDATE_PERSONAL_DETAILS_ENDED" });
};

export const updateSocialMedia = ({
  websiteLink,
  facebookLink,
  twitterLink
}) => async (dispatch, getState) => {
  dispatch({ type: "UPDATE_SOCIAL_MEDIA_STARTED" });
  const uid = getState().firebase.auth.uid;
  await firebase
    .firestore()
    .collection("ru_users")
    .doc(uid)
    .update({
      websiteLink: websiteLink,
      facebookLink: facebookLink,
      twitterLink: twitterLink
    })
    .then(() => {
      const currentUser = {
        ...getState().auth.currentUser,
        websiteLink: websiteLink,
        facebookLink: facebookLink,
        twitterLink: twitterLink
      };
      dispatch({
        type: "UPDATE_PROFILE",
        currentUser: currentUser
      });
    })
    .catch(error => {
      console.log("ERROR - ", error);
      return;
    });
  dispatch({ type: "UPDATE_SOCIAL_MEDIA_ENDED" });
};

export const updateHandle = handle => async (dispatch, getState) => {
  dispatch({ type: "CHANGE_HANDLE_STARTED" });

  try {
    const snapshot = await firebase
      .firestore()
      .collection("ru_users")
      .where("handle", "==", handle)
      .get()
      .then(async snapshot => {
        return snapshot;
      });

    if (snapshot.size === 0) {
      dispatch({ type: "HANDLE_OKAY" });
      const uid = getState().firebase.auth.uid;
      await firebase
        .firestore()
        .collection("ru_users")
        .doc(uid)
        .update({
          handle: handle,
          handleChanged: true
        })
        .then(() => {
          const currentUser = {
            ...getState().auth.currentUser,
            handle: handle,
            handleChanged: true
          };
          dispatch({
            type: "UPDATE_PROFILE",
            currentUser: currentUser
          });
        });
    } else {
      dispatch({ type: "HANDLE_EXISTS" });
    }
  } catch (error) {
    console.log(error);
  }
  dispatch({ type: "CHANGE_HANDLE_ENDED" });
};

export const getProfileByHandle = handle => async (dispatch, getState) => {
  dispatch({ type: "GET_USER_BY_HANDLE_STARTED" });
  await firebase
    .firestore()
    .collection("ru_users")
    .where("handle", "==", handle)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size === 1) {
        querySnapshot.forEach(doc => {
          dispatch({
            type: "GET_USER_BY_HANDLE_SUCCESS",
            otherUser: doc.data()
          });
        });
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: "GET_USER_BY_HANDLE_ERROR" });
    });

  dispatch({ type: "GET_USER_BY_HANDLE_ENDED" });
};

export const clearOtherUserProfile = () => async (dispatch, getState) => {
  dispatch({ type: "CLEAR_OTHER_USER_PROFILE" });
};

export const getOtherUserFollowers = uid => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_USER_FOLLOWERS_STARTED"
  });
  const firestore = getFirestore();
  await firestore
    .collection("ru_followers")
    .doc(uid)
    .get()
    .then(doc => {
      dispatch({
        type: "ADD_OTHER_USER_FOLLOWERS",
        otherUserFollowers: doc.data()
      });
    })
    .catch(error => {
      console.log(error);
    });
  dispatch({
    type: "GETTING_USER_FOLLOWERS_ENDED"
  });
};

export const addFollower = otherUserUID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "UPDATE_OTHER_USER_FOLLOWERS_STARTED"
  });
  const firestore = getFirestore();
  const currentUserUID = getState().auth.currentUser.uid;
  let currentUserFollowers = getState().auth.currentUserFollowers;
  let otherUserFollowers = getState().profile.otherUserFollowers;

  if (!otherUserFollowers.followedBy.includes(currentUserUID)) {
    otherUserFollowers.followedBy.push(currentUserUID);
    currentUserFollowers.following.push(otherUserUID);
    dispatch({
      type: "UPDATE_OTHER_USER_FOLLOWERS",
      otherUserFollowers: otherUserFollowers
    });

    let batch = firestore.batch();
    let uou = firestore.collection("ru_followers").doc(otherUserUID);
    batch.set(uou, {
      ...otherUserFollowers
    });
    let ucu = firestore.collection("ru_followers").doc(currentUserUID);
    batch.set(ucu, {
      ...currentUserFollowers
    });
    batch
      .commit()
      .then(() => {
        console.log("updated db");
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    otherUserFollowers.followedBy = otherUserFollowers.followedBy.filter(
      function(val) {
        return val !== currentUserUID;
      }
    );
    if (otherUserFollowers.followedBy.length === 0) {
      otherUserFollowers.followedBy = [];
    }
    currentUserFollowers.following = currentUserFollowers.following.filter(
      function(val) {
        return val !== otherUserUID;
      }
    );
    if (currentUserFollowers.following.length === 0) {
      currentUserFollowers.following = [];
    }
    dispatch({
      type: "UPDATE_OTHER_USER_FOLLOWERS",
      otherUserFollowers: otherUserFollowers
    });

    let batch = firestore.batch();
    let uou = firestore.collection("ru_followers").doc(otherUserUID);
    batch.set(uou, {
      ...otherUserFollowers
    });
    let ucu = firestore.collection("ru_followers").doc(currentUserUID);
    batch.set(ucu, {
      ...currentUserFollowers
    });
    batch
      .commit()
      .then(() => {
        console.log("updated db");
      })
      .catch(error => {
        console.log(error);
      });
  }
  dispatch({
    type: "UPDATE_OTHER_USER_FOLLOWERS_ENDED"
  });
};
