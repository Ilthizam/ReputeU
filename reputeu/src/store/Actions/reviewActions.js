export const sendRequests = (
  topicID,
  topicName,
  communities,
  communitiesID
) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({
    type: "ADDING_REQUEST_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().firebase.auth.uid;
    const inviter = getState().auth.currentUser;

    await firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .doc(topicID)
      .update({
        communities: firestore.FieldValue.arrayUnion(...communities),
        reviewSent: true
      });

    let invitableUsers = [];
    let allCommunities = getState().community.communities;
    allCommunities.filter(com => {
      if (communitiesID.includes(com.communityID)) {
        com.members.map(member => {
          invitableUsers.push({ uid: member.uid, community: com.communityID });
          return true;
        });
      }
      return true;
    });

    let invites = new Set(invitableUsers);

    let communityBatch = firestore.batch();
    communitiesID.forEach(id => {
      communityBatch.update(
        firestore
          .collection("ru_user_community")
          .doc(uid)
          .collection("ru_user_community_sub")
          .doc(id),
        {
          topics: firestore.FieldValue.arrayUnion(topicID),
          hasTopics: true
        }
      );
    });

    let invitesBatch = firestore.batch();
    let invitees = [];

    invites.forEach(person => {
      invitees.push(person.uid);
      invitesBatch.set(
        firestore
          .collection("ru_review_invites")
          .doc(person.uid)
          .collection("ru_review_invites_sub")
          .doc(),
        {
          dateInvited: new Date(),
          owner: uid,
          topic: topicID,
          community: person.community,
          reviewed: false,
          anonymous: false
        },
        { merge: true }
      );
    });

    await communityBatch.commit();
    await invitesBatch.commit();

    invitees = [...new Set(invitees)];

    //send invite emails
    await firestore
      .collection("ru_emails")
      .doc()
      .set({
        template: {
          name: "reviewInvitationEmail",
          data: {
            inviterName: inviter.name,
            inviterHandle: inviter.handle,
            inviterImage: inviter.photoURL,
            topic: topicName
          }
        },
        bccUids: [...invitees],
        emailType: "reviewInvite",
        invitedBy: inviter.uid,
        invitedTopic: topicName
      });

    dispatch({
      type: "ADDING_REQUEST_SUCCESS"
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "ADDING_REQUEST_ERROR",
      error: error
    });
  }
};

export const getReviewedTopics = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_REVIEWED_TOPICS_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    // get all user topics
    let topics = await firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .where("reviewReceived", "==", true)
      .get()
      .then(snapshot => {
        let tops = [];
        snapshot.forEach(doc => {
          tops.push(doc.data());
        });
        return tops;
      });

    dispatch({
      type: "GETTING_REVIEWED_TOPICS_SUCCESS",
      reviewedTopics: topics
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_REVIEWED_TOPICS_ERROR",
      error: error
    });
  }
};

export const getInvitedTopics = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_INVITED_TOPICS_STARTED"
  });
  try {
    const firebase = getFirebase();
    const uid = getState().auth.currentUser.uid;

    let getInvitedTopicsCloud = firebase
      .functions()
      .httpsCallable("getInvitedTopicsCloud");

    let invites = await getInvitedTopicsCloud({
      uid: uid
    }).then(result => {
      return result.data;
    });

    // let invitedTopics = await firestore
    //   .collection("ru_review_invites")
    //   .doc(uid)
    //   .collection("ru_review_invites_sub")
    //   .orderBy("dateInvited", "desc")
    //   .get()
    //   .then(snapshot => {
    //     let docs = [];
    //     snapshot.forEach(doc => {
    //       docs.push({
    //         ...doc.data(),
    //         inviteID: doc.id
    //       });
    //     });
    //     return docs;
    //   });

    // let invites = [];
    // if (invitedTopics) {
    //   for (let i = 0; i < invitedTopics.length; i++) {
    //     let invite = invitedTopics[i];
    //     let allPromises = [];

    //     //get community data
    //     let communityData = firestore
    //       .collection("ru_user_community")
    //       .doc(invite.owner)
    //       .collection("ru_user_community_sub")
    //       .doc(invite.community)
    //       .get()
    //       .then(doc => {
    //         return {
    //           communityID: doc.data().communityID,
    //           communityName: doc.data().name,
    //           communityMembersCount: doc.data().members.length,
    //           communityDeleted: doc.data().deleted
    //         };
    //       });

    //     //get owner data
    //     let ownerData = firestore
    //       .collection("ru_users")
    //       .doc(invite.owner)
    //       .get()
    //       .then(doc => {
    //         return {
    //           ownerUID: doc.data().uid,
    //           ownerName: doc.data().name,
    //           ownerHandle: doc.data().handle,
    //           ownerPhotoURL: doc.data().photoURL
    //         };
    //       });

    //     //get topic data
    //     let topicData = firestore
    //       .collection("ru_user_topics")
    //       .doc(invite.owner)
    //       .collection("ru_user_topics_sub")
    //       .doc(invite.topic)
    //       .get()
    //       .then(doc => {
    //         return {
    //           topicID: doc.data().id,
    //           topicName: doc.data().name,
    //           topicVirtues: doc.data().virtues,
    //           topicDeleted: doc.data().topicDeleted
    //         };
    //       });

    //     allPromises.push(communityData, ownerData, topicData);

    //     let allData = await Promise.all(allPromises);

    //     if (!allData[0].communityDeleted && !allData[2].topicDeleted) {
    //       invites.push({
    //         ...allData[0],
    //         ...allData[1],
    //         ...allData[2],
    //         dateInvited: invite.dateInvited,
    //         inviteID: invite.inviteID,
    //         reviewed: invite.reviewed,
    //         anonymous: invite.anonymous,
    //         dateReviewed: invite.dateReviewed
    //       });
    //     }
    //   }
    // }

    dispatch({
      type: "GETTING_INVITED_TOPICS_SUCCESS",
      invites: invites
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_INVITED_TOPICS_ERROR",
      error: error
    });
  }
};

export const submitReviewScore = (topic, score, anonymous) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "REVIEW_SUBMIT_STARTED"
  });

  try {
    const firestore = getFirestore();
    const uid = getState().firebase.auth.uid;
    let dateReviewed = new Date();
    await firestore
      .collection("ru_user_topics")
      .doc(topic.ownerUID)
      .collection("ru_user_topics_sub")
      .doc(topic.topicID)
      .collection(topic.communityID)
      .doc(uid)
      .set({
        scores: [...score],
        anonymous: anonymous === "true",
        reviewedOn: dateReviewed,
        reviewedBy: uid,
        topicID: topic.topicID,
        communityID: topic.communityID
      });

    await firestore
      .collection("ru_review_invites")
      .doc(uid)
      .collection("ru_review_invites_sub")
      .doc(topic.inviteID)
      .update({
        reviewed: true,
        anonymous: anonymous === "true",
        dateReviewed: dateReviewed
      });

    await firestore
      .collection("ru_user_topics")
      .doc(topic.ownerUID)
      .collection("ru_user_topics_sub")
      .doc(topic.topicID)
      .update({
        reviewReceived: true,
        reviewedCommunities: firestore.FieldValue.arrayUnion(topic.communityID),
        lastResponseDate: dateReviewed
      });

    dispatch({
      type: "REVIEW_SUBMIT_SUCCESS",
      inviteID: topic.inviteID,
      anonymous: anonymous
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "REVIEW_SUBMIT_ERROR",
      error: error
    });
  }
};

export const submitSelfReviewScore = (topic, score, anonymous) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "SELF_REVIEW_SUBMIT_STARTED"
  });

  try {
    const firestore = getFirestore();
    const uid = getState().firebase.auth.uid;
    let dateReviewed = new Date();

    let newData = {
      selfReviewed: true,
      selfReviewDate: dateReviewed,
      selfReviewScore: score
    };

    await firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .doc(topic.id)
      .update({
        ...newData
      });

    dispatch({
      type: "SELF_REVIEW_SUBMIT_SUCCESS"
    });
    dispatch({
      type: "SELF_REVIEW_SUBMIT_SUCCESS_REDUX",
      data: { topic, newData }
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "SELF_REVIEW_SUBMIT_ERROR",
      error: error
    });
  }
};

export const getTopicResponses = (
  topic,
  communities,
  detailedCommunities
) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({
    type: "GETTING_TOPIC_RESPONSES_STARTED"
  });
  try {
    const firebase = getFirebase();
    const uid = getState().firebase.auth.uid;

    let getTopicResponsesCloud = firebase
      .functions()
      .httpsCallable("getTopicResponsesCloud");

    let communityWiseResults = await getTopicResponsesCloud({
      topic: topic,
      communities: communities,
      detailedCommunities: detailedCommunities,
      uid: uid
    }).then(result => {
      return result.data;
    });

    // let retrievedUsers = [];
    // let retrievedUsersUID = [];
    // let communityWiseResults = [];

    // // this for loop is for each community, get users and calculate the per community averages in here
    // for (let j = 0, len = communities.length; j < len; j++) {
    //   let respondedUsers = await firestore
    //     .collection("ru_user_topics")
    //     .doc(uid)
    //     .collection("ru_user_topics_sub")
    //     .doc(topic)
    //     .collection(communities[j])
    //     .get()
    //     .then(snapshot => {
    //       let docus = [];
    //       snapshot.forEach(doc => {
    //         docus.push(doc.data());
    //       });
    //       return docus;
    //     });

    //   let allPromises = [];
    //   let detailedUsers = [];
    //   let allScoresByCommunityMembers = [];

    //   for (let k = 0, l = respondedUsers.length; k < l; k++) {
    //     let person = respondedUsers[k].reviewedBy;
    //     let individualScore = respondedUsers[k].scores;

    //     allPromises.push(
    //       firestore
    //         .collection("ru_users")
    //         .doc(person)
    //         .get()
    //         .then(doc => {
    //           retrievedUsers.push(doc.data());
    //           retrievedUsersUID.push(doc.data().uid);
    //           detailedUsers.push({
    //             scores: individualScore,
    //             anonymous: respondedUsers[k].anonymous,
    //             memberUID: doc.data().uid,
    //             memberName: doc.data().name,
    //             memberHandle: doc.data().handle,
    //             memberPhotoURL: doc.data().photoURL
    //           });
    //           return true;
    //         })
    //     );
    //     allScoresByCommunityMembers.push(individualScore);
    //   }
    //   await Promise.all(allPromises);

    //   let totalCommunityScore = await calculateTotalScore(
    //     allScoresByCommunityMembers
    //   );

    //   let interestedCommunity = detailedCommunities.filter(dCom => {
    //     return dCom.communityID === communities[j];
    //   });

    //   communityWiseResults.push({
    //     ...interestedCommunity[0],
    //     members: [...detailedUsers],
    //     results: [...totalCommunityScore]
    //   });
    // }

    dispatch({
      type: "GETTING_TOPIC_RESPONSES_SUCCESS",
      responses: communityWiseResults
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_TOPIC_RESPONSES_ERROR",
      error: error
    });
  }
};

// const calculateTotalScore = async allScores => {
//   // create scorecard structure
//   let finalScores = [];
//   allScores[0].forEach(virtue => {
//     finalScores.push({
//       Deficit: virtue.Deficit,
//       Deficit_score: 0,
//       Excess: virtue.Excess,
//       Excess_score: 0,
//       Mean: virtue.Mean,
//       Mean_score: 0,
//       id: virtue.id
//     });
//   });

//   //calculate scores
//   for (let m = 0, n = allScores.length; m < n; m++) {
//     allScores[m].forEach(virtue => {
//       finalScores.filter(fVirtue => {
//         if (fVirtue.id === virtue.id) {
//           fVirtue.Deficit_score =
//             fVirtue.Deficit_score + virtue.Deficit_score / n;
//           fVirtue.Excess_score = fVirtue.Excess_score + virtue.Excess_score / n;
//           fVirtue.Mean_score = fVirtue.Mean_score + virtue.Mean_score / n;
//         }
//         return true;
//       });
//     });
//   }

//   return new Promise(resolve => {
//     resolve(finalScores); // this is the return value
//   });
// };
