const initState = {
  postCreateLoading: false,
  postCreteError: null,
  userPosts: null,
  userPostsOwner: null,
  gettingUserPosts: false,
  gettingUserPostsError: null,
  postCreateSuccess: false,
  gettingFullPost: false,
  gettingFullPostError: null,
  fullPost: null,
  fullPostAuthor: null,
  updatingPost: false,
  updatePostSuccess: false,
  updatePostError: null,
  gettingPostComments: false,
  gettingPostCommentsError: null,
  postComments: null,
  addingComment: false,
  addingCommentSuccess: false,
  addingCommentFail: null,
  gettingPostLikes: false,
  gettingPostLikesError: null,
  postLikes: null,
  likingPost: false,
  likingPostError: null
};
const postsReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_POST_STARTED":
      return {
        ...state,
        postCreateLoading: true,
        postCreateError: null,
        postCreateSuccess: false
      };

    case "CREATE_POST_ENDED":
      return {
        ...state,
        postCreateLoading: false
      };

    case "CREATE_POST_ERROR":
      return {
        ...state,
        postCreateError: action.error
      };

    case "ADD_POST_TO_USER":
      if (action.updateUserPosts) {
        state.userPosts.push(action.post);
      }
      return {
        ...state,
        postCreateSuccess: true,
        userPosts: state.userPosts
      };

    case "GETTING_CURRENT_USER_POSTS_STARTED":
      return {
        ...state,
        gettingUserPosts: true,
        userPostsOwner: null
      };

    case "GETTING_CURRENT_USER_POSTS_ENDED":
      return {
        ...state,
        gettingUserPosts: false
      };

    case "ADD_POST_TO_CURRENT_USER":
      return {
        ...state,
        userPosts: action.posts,
        userPostsOwner: action.postOwner
      };

    case "GETTING_POST_ERROR":
      return {
        ...state,
        gettingUserPostsError: action.error
      };

    case "CLEAR_REDUX_POSTS_DATA":
      return {
        ...state,
        userPosts: null,
        userPostsOwner: null,
        gettingUserPosts: false
      };

    case "POPULATE_FULL_POST":
      return {
        ...state,
        fullPost: action.fullPost
      };

    case "POPULATE_FULL_POST_AUTHOR":
      return {
        ...state,
        fullPostAuthor: action.fullPostAuthor
      };

    case "GETTING_FULL_POST":
      return {
        ...state,
        gettingFullPost: true,
        fullPost: null,
        gettingFullPostError: null
      };

    case "GETTING_FULL_POST_ENDED":
      return {
        ...state,
        gettingFullPost: false
      };

    case "GETTING_FULL_POST_ERROR":
      return {
        ...state,
        gettingFullPostError: action.error
      };

    case "UPDATE_POST_STARTED":
      return {
        ...state,
        updatingPost: true,
        updatePostError: null,
        updatePostSuccess: false
      };

    case "UPDATE_POST_ENDED":
      return {
        ...state,
        updatingPost: false
      };

    case "UPDATE_POST_ERROR":
      return {
        ...state,
        updatePostError: action.error
      };

    case "UPDATE_POST_SUCCESS":
      return {
        ...state,
        updatePostSuccess: true,
        fullPost: {
          ...state.fullPost,
          htmlContent: action.updatedPost.content,
          rawContent: action.updatedPost.rawContent,
          title: action.updatedPost.title,
          edited: true
        },
        userPosts: null,
        userPostsOwner: null
      };

    case "RETRIEVING_COMMENTS_STARTED":
      return {
        ...state,
        gettingPostComments: true,
        gettingPostCommentsError: null
      };

    case "RETRIEVING_COMMENTS_ENDED":
      return {
        ...state,
        gettingPostComments: false
      };

    case "RETRIEVING_COMMENTS_ERROR":
      return {
        ...state,
        gettingPostCommentsError: action.error
      };

    case "POPULATE_POST_COMMENTS":
      return {
        ...state,
        postComments: action.comments
      };

    case "CLEAR_FULL_POST_DATA":
      return {
        ...state,
        postComments: null,
        fullPost: null,
        fullPostAuthor: null
      };

    case "SUBMIT_COMMENT_STARTED":
      return {
        ...state,
        addingComment: true,
        addingCommentFail: null
      };

    case "SUBMIT_COMMENT_ENDED":
      return {
        ...state,
        addingComment: false
      };

    case "SUBMIT_COMMENT_SUCCESS":
      let newComments = [
        ...state.postComments,
        {
          ...action.comment,
          commentTime: {
            seconds: action.comment.commentTime.getTime() / 1000
          },
          userPhotoURL: action.user.photoURL,
          userName: action.user.name,
          userHandle: action.user.handle
        }
      ];
      return {
        ...state,
        addingCommentSuccess: true,
        postComments: newComments
      };

    case "SUBMIT_COMMENT_FAIL":
      return {
        ...state,
        addingCommentFail: action.error
      };

    case "GETTING_POST_LIKES_STARTED":
      return {
        ...state,
        postLikes: null,
        gettingPostLikesError: null,
        gettingPostLikes: true
      };

    case "GETTING_POST_LIKES_SUCCESS":
      return {
        ...state,
        postLikes: action.likes,
        gettingPostLikes: false
      };

    case "GETTING_POST_LIKES_ERROR":
      return {
        ...state,
        gettingPostLikesError: action.error,
        gettingPostLikes: false
      };

    case "LIKING_POST_STARTED":
      return {
        ...state,
        likingPost: true,
        likingPostError: null
      };

    case "LIKING_POST_ERROR":
      return {
        ...state,
        likingPostError: action.error,
        likingPost: false
      };

    case "LIKING_POST_SUCCESS":
      return {
        ...state,
        postLikes: {
          users: [...new Set([...state.postLikes.users, action.user])]
        },
        likingPost: false
      };

    case "UNLIKING_POST_SUCCESS":
      let newLikes = [...state.postLikes.users];
      newLikes.splice(state.postLikes.users.indexOf(action.user), 1);
      return {
        ...state,
        postLikes: {
          users: newLikes
        },
        likingPost: false
      };

    default:
      return state;
  }
};

export default postsReducer;
