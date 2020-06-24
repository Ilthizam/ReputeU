export const createPost = post => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CREATE_POST_STARTED"
  });
  try {
    const uid = getState().auth.currentUser.uid;
    const userPostOwner = getState().posts.userPostsOwner;
    const firestore = getFirestore();
    let docRef = await firestore.collection("ru_posts").doc();

    const submitDoc = {
      id: docRef.id,
      title: post.title,
      htmlContent: post.content,
      rawContent: post.rawContent,
      authorUID: uid,
      createdOn: new Date(),
      contentLength: post.contentLength,
      rating: {
        total: 0,
        users: 0,
        average: 0
      },
      edited: false,
      likeCount: 0,
      commentCount: 0
    };

    await docRef.set(submitDoc).then(() => {
      dispatch({
        type: "ADD_POST_TO_USER",
        post: {
          ...submitDoc,
          createdOn: {
            seconds: submitDoc.createdOn.getTime() / 1000
          }
        },
        updateUserPosts: uid === userPostOwner
      });
    });

    await firestore
      .collection("ru_post_likes")
      .doc(docRef.id)
      .set({
        users: []
      });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "CREATE_POST_ERROR",
      error: error
    });
  }
  dispatch({
    type: "CREATE_POST_ENDED"
  });
};

export const getUserPosts = receivedUID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_CURRENT_USER_POSTS_STARTED"
  });
  let uid = null;
  if (receivedUID) {
    uid = receivedUID;
  } else {
    uid = getState().auth.currentUser.uid;
  }

  const firestore = getFirestore();

  await firestore
    .collection("ru_posts")
    .where("authorUID", "==", uid)
    .get()
    .then(snapshot => {
      let posts = [];
      snapshot.forEach(doc => {
        posts.push(doc.data());
      });
      dispatch({
        type: "ADD_POST_TO_CURRENT_USER",
        posts: posts,
        postOwner: uid
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: "GETTING_POST_ERROR",
        error: error
      });
    });

  dispatch({
    type: "GETTING_CURRENT_USER_POSTS_ENDED"
  });
};

export const clearPostsListRedux = () => (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CLEAR_REDUX_POSTS_DATA"
  });
};

export const retrieveFullPost = postID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_FULL_POST"
  });
  const firestore = getFirestore();

  try {
    const fullPost = await firestore
      .collection("ru_posts")
      .doc(postID)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data();
        } else {
          dispatch({
            type: "GETTING_FULL_POST_ERROR",
            error: {
              code: "post-not-exist",
              message: "The post you requested does not exist"
            }
          });
          return null;
        }
      });

    let fullPostAuthor = null;
    if (fullPost) {
      fullPostAuthor = await firestore
        .collection("ru_users")
        .doc(fullPost.authorUID)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data();
          } else {
            dispatch({
              type: "GETTING_FULL_POST_ERROR",
              error: {
                code: "author-not-exist",
                message: "The author of the post you requested does not exist"
              }
            });
            return null;
          }
        });
    }

    if (fullPost && fullPostAuthor) {
      dispatch({
        type: "POPULATE_FULL_POST",
        fullPost: fullPost
      });
      dispatch({
        type: "POPULATE_FULL_POST_AUTHOR",
        fullPostAuthor: fullPostAuthor
      });
    }
  } catch (error) {
    dispatch({
      type: "GETTING_FULL_POST_ERROR",
      error: error
    });
  }

  dispatch({
    type: "GETTING_FULL_POST_ENDED"
  });
};

export const commitPostEdits = post => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "UPDATE_POST_STARTED"
  });
  try {
    const firestore = getFirestore();

    await firestore
      .collection("ru_posts")
      .doc(post.postID)
      .update({
        htmlContent: post.content,
        rawContent: post.rawContent,
        title: post.title,
        contentLength: post.contentLength,
        edited: true
      });

    dispatch({
      type: "UPDATE_POST_SUCCESS",
      updatedPost: post
    });
  } catch (error) {
    dispatch({
      type: "UPDATE_POST_ERROR",
      error: error
    });
  }
  dispatch({
    type: "UPDATE_POST_ENDED"
  });
};

export const retrieveAllComments = postID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "RETRIEVING_COMMENTS_STARTED"
  });
  const postAuthor = getState().posts.fullPostAuthor;
  const currentUser = getState().auth.currentUser;

  const firestore = getFirestore();

  try {
    let comments = await firestore
      .collection("ru_post_comments")
      .doc(postID)
      .collection("ru_comments_sub")
      .orderBy("commentTime", "asc")
      .get()
      .then(snapshot => {
        let comments = [];
        snapshot.forEach(doc => {
          comments.push(doc.data());
        });
        return comments;
      });

    let commentsWithUser = [];
    let retrievedUsers = [];

    for (let i = 0, len = comments.length; i < len; i++) {
      let comment = comments[i];
      if (comment.userID === currentUser.uid) {
        commentsWithUser.push({
          ...comment,
          userPhotoURL: currentUser.photoURL,
          userName: currentUser.name,
          userHandle: currentUser.handle
        });
      } else if (comment.userID === postAuthor.uid) {
        commentsWithUser.push({
          ...comment,
          userPhotoURL: postAuthor.photoURL,
          userName: postAuthor.name,
          userHandle: postAuthor.handle
        });
      } else {
        let userAlreadyRetrieved = retrievedUsers.filter(obj => {
          return obj.uid === comment.userID;
        });
        if (userAlreadyRetrieved.length > 0) {
          commentsWithUser.push({
            ...comment,
            userPhotoURL: userAlreadyRetrieved[0].photoURL,
            userName: userAlreadyRetrieved[0].name,
            userHandle: userAlreadyRetrieved[0].handle
          });
        } else {
          let newRetrievedUser = await firestore
            .collection("ru_users")
            .doc(comment.userID)
            .get()
            .then(doc => {
              return doc.data();
            });
          commentsWithUser.push({
            ...comment,
            userPhotoURL: newRetrievedUser.photoURL,
            userName: newRetrievedUser.name,
            userHandle: newRetrievedUser.handle
          });
          retrievedUsers.push(newRetrievedUser);
        }
      }
    }
    dispatch({
      type: "POPULATE_POST_COMMENTS",
      comments: commentsWithUser
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "RETRIEVING_COMMENTS_ERROR",
      error: error
    });
  }
  dispatch({
    type: "RETRIEVING_COMMENTS_ENDED"
  });
};

export const submitComment = comment => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "SUBMIT_COMMENT_STARTED"
  });
  const firestore = getFirestore();
  const uid = getState().auth.currentUser.uid;
  const postID = getState().posts.fullPost.id;

  try {
    let docRef = await firestore
      .collection("ru_post_comments")
      .doc(postID)
      .collection("ru_comments_sub")
      .doc();

    const fullComment = {
      comment: comment,
      commentID: docRef.id,
      commentTime: new Date(),
      edited: false,
      postID: postID,
      userID: uid
    };

    await docRef.set(fullComment);
    await firestore
      .collection("ru_posts")
      .doc(postID)
      .update({
        commentCount: firestore.FieldValue.increment(1)
      });
    dispatch({
      type: "SUBMIT_COMMENT_SUCCESS",
      comment: fullComment,
      user: getState().auth.currentUser
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "SUBMIT_COMMENT_ERROR",
      error: error
    });
  }

  dispatch({
    type: "SUBMIT_COMMENT_ENDED"
  });
};

export const clearFullPostData = () => dispatch => {
  dispatch({
    type: "CLEAR_FULL_POST_DATA"
  });
};

export const searchUserPostsAlgolia = keyword => async (
  dispatch,
  getState,
  { getFirebase, getFirestore, algoliaSearchClient }
) => {
  const index = algoliaSearchClient.initIndex(
    "ru_posts_" + getState().auth.currentUser.uid
  );
  index
    .search(keyword)
    .then(({ hits }) => {
      dispatch({
        type: "ADD_POST_TO_CURRENT_USER",
        posts: hits,
        postOwner: getState().auth.currentUser.uid
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const retrievePostLikes = postID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({
      type: "GETTING_POST_LIKES_STARTED"
    });
    const firestore = getFirestore();
    await firestore
      .collection("ru_post_likes")
      .doc(postID)
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch({
            type: "GETTING_POST_LIKES_SUCCESS",
            likes: doc.data()
          });
        } else {
          dispatch({
            type: "GETTING_POST_LIKES_ERROR",
            error: {
              code: "post-likes-not-exist",
              message: "The likes you requested does not exist"
            }
          });
          return null;
        }
      });
  } catch (error) {
    dispatch({
      type: "GETTING_POST_LIKES_ERROR",
      error: error
    });
  }
};

export const likePost = (postID, uid) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({
      type: "LIKING_POST_STARTED"
    });
    const firestore = getFirestore();
    await firestore
      .collection("ru_post_likes")
      .doc(postID)
      .update({
        users: firestore.FieldValue.arrayUnion(uid)
      });
    await firestore
      .collection("ru_posts")
      .doc(postID)
      .update({
        likeCount: firestore.FieldValue.increment(1)
      });
    dispatch({
      type: "LIKING_POST_SUCCESS",
      user: uid
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LIKING_POST_ERROR",
      error: error
    });
  }
};

export const unlikePost = (postID, uid) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  try {
    dispatch({
      type: "LIKING_POST_STARTED"
    });
    const firestore = getFirestore();
    await firestore
      .collection("ru_post_likes")
      .doc(postID)
      .update({
        users: firestore.FieldValue.arrayRemove(uid)
      });
    await firestore
      .collection("ru_posts")
      .doc(postID)
      .update({
        likeCount: firestore.FieldValue.increment(-1)
      });
    dispatch({
      type: "UNLIKING_POST_SUCCESS",
      user: uid
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "LIKING_POST_ERROR",
      error: error
    });
  }
};
