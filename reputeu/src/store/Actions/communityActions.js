export const getUserCommunity = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "RETRIEVING_COMMUNITIES_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;
    let community = await firestore
      .collection("ru_user_community")
      .doc(uid)
      .collection("ru_user_community_sub")
      .orderBy("name", "asc")
      .get()
      .then(snapshot => {
        let communities = [];
        snapshot.forEach(doc => {
          if (doc.data().deleted !== true) {
            communities.push({ ...doc.data(), communityID: doc.id });
          }
        });
        return communities;
      });

    let allUsersUID = [];
    for (let i = 0, len = community.length; i < len; i++) {
      allUsersUID = [...new Set([...allUsersUID, ...community[i].members])];
    }

    let allPromises = [];

    for (let j = 0, len = allUsersUID.length; j < len; j++) {
      allPromises.push(
        firestore
          .collection("ru_users")
          .doc(allUsersUID[j])
          .get()
          .then(doc => {
            return doc.data();
          })
      );
    }

    let retrievedUsers = await Promise.all(allPromises);

    let communityWithUsers = [];

    for (let i = 0, len = community.length; i < len; i++) {
      let communityRecord = community[i];
      let communityRecordUsers = communityRecord.members;
      let newCommunityRecordUsers = [];
      for (let j = 0, len2 = communityRecordUsers.length; j < len2; j++) {
        let communityRecordUser = communityRecordUsers[j];
        let userAlreadyRetrieved = retrievedUsers.filter(obj => {
          return obj.uid === communityRecordUser;
        });
        if (userAlreadyRetrieved.length > 0) {
          newCommunityRecordUsers.push(userAlreadyRetrieved[0]);
        } else {
          let newRetrievedUser = await firestore
            .collection("ru_users")
            .doc(communityRecordUser)
            .get()
            .then(doc => {
              return doc.data();
            });
          retrievedUsers.push(newRetrievedUser);
          newCommunityRecordUsers.push(newRetrievedUser);
        }
      }

      communityWithUsers.push({
        ...communityRecord,
        members: newCommunityRecordUsers
      });
    }
    dispatch({
      type: "RETRIEVING_COMMUNITIES_SUCCESS",
      communities: communityWithUsers
    });
  } catch (error) {
    dispatch({
      type: "RETRIEVING_COMMUNITIES_ERROR",
      error: error
    });
  }
};

export const searchUsersAlgolia = keyword => async (
  dispatch,
  getState,
  { getFirebase, getFirestore, algoliaSearchClient }
) => {
  dispatch({
    type: "SEARCH_USER_SUGGESTIONS_STARTED"
  });
  const index = algoliaSearchClient.initIndex("ru_users");
  index
    .search({
      query: keyword,
      hitsPerPage: 10
    })
    .then(({ hits }) => {
      let suggestions = hits.map(hit => {
        return {
          photourl: hit.photoURL,
          handle: hit.handle,
          uid: hit.uid,
          key: hit.uid,
          name: hit.name,
          title: hit.name
        };
      });
      dispatch({
        type: "SEARCH_USER_SUGGESTIONS",
        users: suggestions
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "SEARCH_USER_SUGGESTIONS_ERROR",
        error: error
      });
    });
};

export const clearUserSuggestionsRedux = () => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CLEAR_REDUX_USER_SUGGESTIONS"
  });
};

export const createCommunity = community => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CREATING_COMMUNITY_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    let docRef = await firestore
      .collection("ru_user_community")
      .doc(uid)
      .collection("ru_user_community_sub")
      .doc();

    const newCommunity = {
      name: community.communityName,
      communityID: docRef.id,
      createdOn: new Date(),
      members: community.communityMembersUID,
      deleted: false
    };

    await docRef.set(newCommunity);

    const newCommunityRedux = {
      ...newCommunity,
      members: community.communityMembers
    };

    dispatch({
      type: "CREATING_COMMUNITY_SUCCESS",
      community: newCommunityRedux
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "CREATING_COMMUNITY_ERROR",
      error: error
    });
  }
};

export const deleteCommunity = communityID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "DELETING_COMMUNITY_STARTED"
  });
  const firestore = getFirestore();
  const uid = getState().auth.currentUser.uid;
  firestore
    .collection("ru_user_community")
    .doc(uid)
    .collection("ru_user_community_sub")
    .doc(communityID)
    .update({
      deleted: true
    })
    .then(() => {
      dispatch({
        type: "DELETING_COMMUNITY_SUCCESS",
        communityID: communityID
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "DELETING_COMMUNITY_ERROR",
        error: error
      });
    });
};

export const deleteCommunityMember = memberData => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "DELETING_COMMUNITY_MEMBER_STARTED"
  });
  const firestore = getFirestore();
  const uid = getState().auth.currentUser.uid;
  const { member, communityID } = memberData;
  firestore
    .collection("ru_user_community")
    .doc(uid)
    .collection("ru_user_community_sub")
    .doc(communityID)
    .update({
      members: firestore.FieldValue.arrayRemove(member.uid)
    })
    .then(() => {
      dispatch({
        type: "DELETING_COMMUNITY_MEMBER_SUCCESS",
        communityID: communityID,
        memberID: member.uid
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "DELETING_COMMUNITY_MEMBER_ERROR",
        error: error
      });
    });
};

export const changeCommunityName = (newName, communityID) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CHANGE_COMMUNITY_NAME_STARTED"
  });
  const firestore = getFirestore();
  const uid = getState().auth.currentUser.uid;

  firestore
    .collection("ru_user_community")
    .doc(uid)
    .collection("ru_user_community_sub")
    .doc(communityID)
    .update({
      name: newName
    })
    .then(() => {
      dispatch({
        type: "CHANGE_COMMUNITY_NAME_SUCCESS",
        communityID: communityID,
        newName: newName
      });
    })
    .catch(error => {
      if (!error.response) {
        // network error
        dispatch({
          type: "CHANGE_COMMUNITY_NAME_ERROR",
          error: {
            message: "Network Error"
          }
        });
      } else {
        dispatch({
          type: "CHANGE_COMMUNITY_NAME_ERROR",
          error: error
        });
      }
      console.log(error);
    });
};

export const addCommunityMembers = (members, membersUID, communityID) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "ADD_COMMUNITY_MEMBERS_STARTED"
  });
  const firestore = getFirestore();
  const uid = getState().auth.currentUser.uid;

  firestore
    .collection("ru_user_community")
    .doc(uid)
    .collection("ru_user_community_sub")
    .doc(communityID)
    .update({
      members: firestore.FieldValue.arrayUnion(...membersUID)
    })
    .then(() => {
      dispatch({
        type: "ADD_COMMUNITY_MEMBERS_SUCCESS",
        communityID: communityID,
        members: members
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "ADD_COMMUNITY_MEMBERS_ERROR",
        error: error
      });
    });
};
