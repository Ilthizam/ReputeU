/* eslint-disable no-await-in-loop */
const AlgoliaKeys = require("./credentials");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");
admin.initializeApp({
  storageBucket: "reputeu-ucsc-dev.appspot.com"
});

exports.createUserFollowersAndAlgolia = functions.auth
  .user()
  .onCreate(async user => {
    const uid = user.uid;

    if (
      user.providerData[0].providerId === "facebook.com" ||
      user.providerData[0].providerId === "twitter.com"
    ) {
      admin
        .auth()
        .updateUser(uid, {
          emailVerified: true
        })
        .then(() => {
          console.log("Successfully verified user", uid);
          return;
        })
        .catch(error => {
          console.error("Error verifying user:", error);
        });
    }

    await admin
      .firestore()
      .collection("ru_followers")
      .doc(uid)
      .set({
        followedBy: [],
        following: []
      })
      .then(() => {
        console.log("Followers list created for ", uid);
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });

    const algoliaUser = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      handle: user.uid,
      objectID: user.uid
    };

    const ALGOLIA_INDEX_NAME = "ru_users";
    const client = algoliasearch(
      AlgoliaKeys.ALGOLIA_ID,
      AlgoliaKeys.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.setSettings({
      searchableAttributes: ["name", "handle"]
    });
    return index.saveObject(algoliaUser);
  });

exports.updateUserAlgolia = functions.firestore
  .document("ru_users/{uid}")
  .onWrite((change, context) => {
    const uid = context.params.uid;
    const newUserValues = change.after.data();

    const algoliaUpdatedUser = {
      name: newUserValues.name,
      email: newUserValues.email,
      photoURL: newUserValues.photoURL,
      handle: newUserValues.handle,
      objectID: uid,
      uid: uid
    };

    const ALGOLIA_INDEX_NAME = "ru_users";
    const client = algoliasearch(
      AlgoliaKeys.ALGOLIA_ID,
      AlgoliaKeys.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    index.partialUpdateObject(algoliaUpdatedUser, (error, content) => {
      if (error) {
        console.log(error);
      }
    });
    return 0;
  });

exports.deleteUser = functions.auth.user().onDelete(async user => {
  const uid = user.uid;
  // delete followers
  await admin
    .firestore()
    .collection("ru_followers")
    .doc(uid)
    .delete();

  // delete user
  await admin
    .firestore()
    .collection("ru_users")
    .doc(uid)
    .delete();

  // delete posts
  let deletingPosts = [];
  await admin
    .firestore()
    .collection("ru_posts")
    .where("authorUID", "==", uid)
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        deletingPosts.push(doc.id);
        admin
          .firestore()
          .collection("ru_post_rating")
          .doc(doc.id)
          .delete();
        admin
          .firestore()
          .collection("ru_post_likes")
          .doc(doc.id)
          .delete();
        return;
      });
      return;
    });

  for (let j = 0, len = deletingPosts.length; j < len; j++) {
    await admin
      .firestore()
      .collection("ru_post_comments")
      .doc(deletingPosts[j])
      .collection("ru_comments_sub")
      .get()
      .then(snap => {
        snap.forEach(doc => {
          doc.ref.delete();
          return;
        });
        return;
      });
  }

  // review invites
  await admin
    .firestore()
    .collection("ru_review_invites")
    .doc(uid)
    .collection("ru_review_invites_sub")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        return;
      });
      return;
    });

  // communities
  await admin
    .firestore()
    .collection("ru_user_community")
    .doc(uid)
    .collection("ru_user_community_sub")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        return;
      });
      return;
    });

  // notifications
  await admin
    .firestore()
    .collection("ru_user_notifications")
    .doc(uid)
    .collection("ru_user_notifications_sub")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        return;
      });
      return;
    });

  // topics
  await admin
    .firestore()
    .collection("ru_user_topics")
    .doc(uid)
    .collection("ru_user_topics_sub")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        return;
      });
      return;
    });

  // custom virtues
  await admin
    .firestore()
    .collection("ru_virtues")
    .doc(uid)
    .collection("ru_virtues_sub")
    .get()
    .then(snap => {
      snap.forEach(doc => {
        doc.ref.delete();
        return;
      });
      return;
    });

  // delete image
  try {
    await admin
      .storage()
      .bucket()
      .file("profile-pictures/" + uid + "/pro-pic.jpg")
      .delete();
  } catch (error) {
    console.log("No uploaded photo");
  }

  console.log("Deleted Mapping UID = ", uid);

  const ALGOLIA_INDEX_NAME = "ru_users";
  const client = algoliasearch(
    AlgoliaKeys.ALGOLIA_ID,
    AlgoliaKeys.ALGOLIA_ADMIN_KEY
  );
  const index = client.initIndex(ALGOLIA_INDEX_NAME);

  index.deleteObject(uid, (error, content) => {
    if (error) {
      console.log(error);
    }
  });
  return 0;
});

exports.insertPostAlgolia = functions.firestore
  .document("ru_posts/{postId}")
  .onCreate((snap, context) => {
    const post = snap.data();
    const algoliaPost = {
      ...post,
      createdOn: {
        seconds: post.createdOn.seconds
      },
      objectID: post.id,
      edited: false
    };
    post.objectID = context.params.postId;
    const ALGOLIA_INDEX_NAME = "ru_posts_" + post.authorUID;
    const client = algoliasearch(
      AlgoliaKeys.ALGOLIA_ID,
      AlgoliaKeys.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.setSettings({
      searchableAttributes: ["title", "rawContent"]
    });
    return index.saveObject(algoliaPost);
  });

exports.updatePostRating = functions.firestore
  .document("ru_posts/{postID}")
  .onWrite(async (change, context) => {
    if (
      change.before.data().rating.total !== change.after.data().rating.total ||
      change.before.data().rating.users !== change.after.data().rating.users
    ) {
      const postID = context.params.postID;
      const ratingData = change.after.data().rating;
      const newRating = ratingData.total / ratingData.users;
      await admin
        .firestore()
        .collection("ru_posts")
        .doc(postID)
        .update({
          rating: {
            ...ratingData,
            average: newRating
          }
        })
        .then(() => {
          return;
        })
        .catch(err => {
          console.log(err);
          return;
        });
    }
    return;
  });

exports.updatePostAlgolia = functions.firestore
  .document("ru_posts/{id}")
  .onUpdate((change, context) => {
    const postID = context.params.id;
    const newPostValues = change.after.data();

    const algoliaUpdatedPost = {
      rawContent: newPostValues.rawContent,
      title: newPostValues.title,
      objectID: postID,
      contentLength: newPostValues.contentLength,
      htmlContent: newPostValues.htmlContent,
      rating: newPostValues.rating,
      commentCount: newPostValues.commentCount,
      likeCount: newPostValues.likeCount,
      edited: newPostValues.edited
    };

    const ALGOLIA_INDEX_NAME = "ru_posts_" + newPostValues.authorUID;
    const client = algoliasearch(
      AlgoliaKeys.ALGOLIA_ID,
      AlgoliaKeys.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    index.partialUpdateObject(algoliaUpdatedPost, (error, content) => {
      if (error) {
        console.log(error);
      }
    });
    return 0;
  });

exports.deletePostAlgolia = functions.firestore
  .document("ru_posts/{postID}")
  .onDelete((snap, context) => {
    const postID = context.params.postID;
    const deletedPost = snap.data();

    const ALGOLIA_INDEX_NAME = "ru_posts_" + deletedPost.authorUID;
    const client = algoliasearch(
      AlgoliaKeys.ALGOLIA_ID,
      AlgoliaKeys.ALGOLIA_ADMIN_KEY
    );
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    index.deleteObject(postID, (error, content) => {
      if (error) {
        console.log(error);
      }
    });
    return 0;
  });

exports.addNotificationOnInvite = functions.firestore
  .document("ru_review_invites/{uid}/ru_review_invites_sub/{inviteID}")
  .onCreate(async (snap, context) => {
    let uid = context.params.uid;
    let data = snap.data();

    //get inviter details
    let inviter = await admin
      .firestore()
      .collection("ru_users")
      .doc(data.owner)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => {
        console.log(error);
      });

    //get topic details
    let topic = await admin
      .firestore()
      .collection("ru_user_topics")
      .doc(data.owner)
      .collection("ru_user_topics_sub")
      .doc(data.topic)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => {
        console.log(error);
      });

    let notification = {
      notiDate: data.dateInvited,
      notiType: "invite",
      read: false,
      inviterName: inviter.name,
      inviterHandle: inviter.handle,
      topicName: topic.name,
      topicID: topic.id
    };

    await admin
      .firestore()
      .collection("ru_user_notifications")
      .doc(uid)
      .collection("ru_user_notifications_sub")
      .doc()
      .set({
        ...notification
      })
      .then(() => {
        console.log("SUCCESS", notification);
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

exports.addNotificationOnReview = functions.firestore
  .document(
    "ru_user_topics/{uid}/ru_user_topics_sub/{topicID}/{communityID}/{reviewerID}"
  )
  .onCreate(async (change, context) => {
    let uid = context.params.uid;
    let topicID = context.params.topicID;
    let communityID = context.params.communityID;
    let data = change.data();

    reviewer = {
      name: "A Reviewer",
      handle: ""
    };

    // get topic details
    let topic = await admin
      .firestore()
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .doc(topicID)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => {
        console.log(error);
      });

    // get community details
    let community = await admin
      .firestore()
      .collection("ru_user_community")
      .doc(uid)
      .collection("ru_user_community_sub")
      .doc(communityID)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => {
        console.log(error);
      });

    let notification = {
      notiDate: data.reviewedOn,
      notiType: "reviewed",
      read: false,
      reviewerName: reviewer.name,
      reviewerHandle: reviewer.handle,
      topicName: topic.name,
      topicID: topic.id,
      communityName: community.name,
      communityID: community.communityID
    };

    await admin
      .firestore()
      .collection("ru_user_notifications")
      .doc(uid)
      .collection("ru_user_notifications_sub")
      .doc()
      .set({
        ...notification
      })
      .then(() => {
        console.log("SUCCESS", notification);
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

exports.addNotificationOnComment = functions.firestore
  .document("ru_post_comments/{postID}/ru_comments_sub/{commentID}")
  .onWrite(async (change, context) => {
    let postID = context.params.postID;
    let data = change.after.data();

    // get post details
    let post = await admin
      .firestore()
      .collection("ru_posts")
      .doc(postID)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => {
        console.log(error);
      });

    console.log("post - ", post);

    if (post.authorUID !== data.userID) {
      //get commenter name
      let commenter = await admin
        .firestore()
        .collection("ru_users")
        .doc(data.userID)
        .get()
        .then(doc => {
          return doc.data();
        })
        .catch(error => {
          console.log(error);
        });

      let notification = {
        notiDate: data.commentTime,
        notiType: "comment",
        read: false,
        commenterName: commenter.name,
        commenterHandle: commenter.handle,
        postName: post.title,
        postID: post.id,
        commentID: data.commentID
      };

      await admin
        .firestore()
        .collection("ru_user_notifications")
        .doc(post.authorUID)
        .collection("ru_user_notifications_sub")
        .doc()
        .set({
          ...notification
        })
        .then(() => {
          console.log("SUCCESS", notification);
          return;
        })
        .catch(err => {
          console.log(err);
          return;
        });
    } else {
      console.log("Author Commented");
    }
  });

exports.sendVerificationEmail = functions.https.onCall(
  async (data, context) => {
    const email = data.email;
    const name = data.name;

    const verificationLink = await admin
      .auth()
      .generateEmailVerificationLink(email)
      .then(link => {
        return link;
      })
      .catch(error => {
        console.log(error);
        return null;
      });

    if (verificationLink) {
      await admin
        .firestore()
        .collection("ru_emails")
        .doc()
        .set({
          to: email,
          template: {
            name: "verificationEmail",
            data: {
              link: verificationLink,
              name: name
            }
          },
          emailType: "verification"
        })
        .then(() => {
          console.log("Email data Added to Firestore");
          return null;
        });
    }
  }
);

exports.getTopicResponsesCloud = functions.https.onCall(
  async (data, context) => {
    let topic = data.topic;
    let communities = data.communities;
    let detailedCommunities = data.detailedCommunities;
    let uid = data.uid;

    let retrievedUsers = [];
    let retrievedUsersUID = [];
    let communityWiseResults = [];

    // this for loop is for each community, get users and calculate the per community averages in here
    for (let j = 0, len = communities.length; j < len; j++) {
      let respondedUsers = await admin
        .firestore()
        .collection("ru_user_topics")
        .doc(uid)
        .collection("ru_user_topics_sub")
        .doc(topic)
        .collection(communities[j])
        .get()
        .then(snapshot => {
          let docus = [];
          snapshot.forEach(doc => {
            docus.push(doc.data());
          });
          return docus;
        });

      let allPromises = [];
      let detailedUsers = [];
      let allScoresByCommunityMembers = [];

      for (let k = 0, l = respondedUsers.length; k < l; k++) {
        let person = respondedUsers[k].reviewedBy;
        let individualScore = respondedUsers[k].scores;

        allPromises.push(
          admin
            .firestore()
            .collection("ru_users")
            .doc(person)
            .get()
            .then(doc => {
              let data = doc.data();
              retrievedUsers.push(doc.data());
              retrievedUsersUID.push(doc.data().uid);
              detailedUsers.push({
                scores: individualScore,
                anonymous: respondedUsers[k].anonymous,
                memberUID: data.uid,
                memberName: data.name,
                memberHandle: data.handle,
                memberPhotoURL: data.photoURL
              });
              return true;
            })
        );
        allScoresByCommunityMembers.push(individualScore);
      }
      await Promise.all(allPromises);

      let allScores = allScoresByCommunityMembers;

      let finalScores = [];
      allScores[0].forEach(virtue => {
        finalScores.push({
          Deficit: virtue.Deficit,
          Deficit_score: 0,
          Excess: virtue.Excess,
          Excess_score: 0,
          Mean: virtue.Mean,
          Mean_score: 0,
          id: virtue.id
        });
      });

      //calculate scores
      for (let m = 0, n = allScores.length; m < n; m++) {
        allScores[m].forEach(virtue => {
          finalScores.filter(fVirtue => {
            if (fVirtue.id === virtue.id) {
              fVirtue.Deficit_score =
                fVirtue.Deficit_score + virtue.Deficit_score / n;
              fVirtue.Excess_score =
                fVirtue.Excess_score + virtue.Excess_score / n;
              fVirtue.Mean_score = fVirtue.Mean_score + virtue.Mean_score / n;
            }
            return true;
          });
        });
      }

      let totalCommunityScore = finalScores;

      // eslint-disable-next-line no-loop-func
      let interestedCommunity = detailedCommunities.filter(dCom => {
        return dCom.communityID === communities[j];
      });

      communityWiseResults.push({
        ...interestedCommunity[0],
        members: [...detailedUsers],
        results: [...totalCommunityScore]
      });
    }

    return communityWiseResults;
  }
);

exports.getInvitedTopicsCloud = functions.https.onCall(
  async (data, context) => {
    let uid = data.uid;

    let invitedTopics = await admin
      .firestore()
      .collection("ru_review_invites")
      .doc(uid)
      .collection("ru_review_invites_sub")
      .orderBy("dateInvited", "desc")
      .get()
      .then(snapshot => {
        let docs = [];
        snapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            inviteID: doc.id
          });
        });
        return docs;
      });

    let invites = [];
    if (invitedTopics) {
      for (let i = 0; i < invitedTopics.length; i++) {
        let invite = invitedTopics[i];
        let allPromises = [];

        //get community data
        let communityData = admin
          .firestore()
          .collection("ru_user_community")
          .doc(invite.owner)
          .collection("ru_user_community_sub")
          .doc(invite.community)
          .get()
          .then(doc => {
            let data = doc.data();
            return {
              communityID: data.communityID,
              communityName: data.name,
              communityMembersCount: data.members.length,
              communityDeleted: data.deleted
            };
          });

        //get owner data
        let ownerData = admin
          .firestore()
          .collection("ru_users")
          .doc(invite.owner)
          .get()
          .then(doc => {
            let data = doc.data();
            return {
              ownerUID: data.uid,
              ownerName: data.name,
              ownerHandle: data.handle,
              ownerPhotoURL: data.photoURL
            };
          });

        //get topic data
        let topicData = admin
          .firestore()
          .collection("ru_user_topics")
          .doc(invite.owner)
          .collection("ru_user_topics_sub")
          .doc(invite.topic)
          .get()
          .then(doc => {
            let data = doc.data();
            return {
              topicID: data.id,
              topicName: data.name,
              topicVirtues: data.virtues,
              topicDeleted: data.topicDeleted,
              topicDescription: data.description
            };
          });

        allPromises.push(communityData, ownerData, topicData);

        let allData = await Promise.all(allPromises);

        if (!allData[0].communityDeleted && !allData[2].topicDeleted) {
          invites.push({
            ...allData[0],
            ...allData[1],
            ...allData[2],
            dateInvited: {
              seconds: invite.dateInvited.seconds
            },
            inviteID: invite.inviteID,
            reviewed: invite.reviewed,
            anonymous: invite.anonymous,
            dateReviewed: {
              seconds: invite.dateReviewed && invite.dateReviewed.seconds
            }
          });
        }
      }
    }
    return invites;
  }
);
