export const markNotificationAsRead = notiID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "MARK_AS_READ_STARTED"
  });
  const uid = getState().auth.currentUser.uid;
  const firestore = getFirestore();

  await firestore
    .collection("ru_user_notifications")
    .doc(uid)
    .collection("ru_user_notifications_sub")
    .doc(notiID)
    .update({
      read: true
    })
    .then(() => {
      dispatch({
        type: "MARK_AS_READ_SUCCESS"
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "MARK_AS_READ_ERROR"
      });
    });
};
