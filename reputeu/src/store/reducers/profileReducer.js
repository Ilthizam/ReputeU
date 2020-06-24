const initState = {
  imageUploadProgress: 0,
  imageUploading: false,
  personalDetailsUpdating: false,
  socialMediaUpdating: false,
  handleChecking: false,
  handleExists: false,
  otherUser: null,
  otherUserLoading: false,
  otherUserFollowers: null,
  otherUserFollowersUpdating: false
};

const profileReducer = (state = initState, action) => {
  switch (action.type) {
    case "UPLOAD_PROFILE_PIC_STARTED":
      return {
        ...state,
        imageUploading: true
      };

    case "UPLOAD_PROFILE_PIC_PROGRESS":
      return {
        ...state,
        imageUploadProgress: action.imageUploadProgress
      };

    case "UPLOAD_PROFILE_PIC_ENDED":
      return {
        ...state,
        imageUploadProgress: 0,
        imageUploading: false
      };

    case "UPDATE_PERSONAL_DETAILS_STARTED":
      return {
        ...state,
        personalDetailsUpdating: true
      };

    case "UPDATE_PERSONAL_DETAILS_ENDED":
      return {
        ...state,
        personalDetailsUpdating: false
      };

    case "UPDATE_SOCIAL_MEDIA_STARTED":
      return {
        ...state,
        socialMediaUpdating: true
      };

    case "UPDATE_SOCIAL_MEDIA_ENDED":
      return {
        ...state,
        socialMediaUpdating: false
      };

    case "CHANGE_HANDLE_STARTED":
      return {
        ...state,
        handleUpdating: true,
        handleExists: false
      };

    case "CHANGE_HANDLE_ENDED":
      return {
        ...state,
        handleUpdating: false
      };

    case "HANDLE_OKAY":
      return {
        ...state,
        handleExists: false
      };

    case "HANDLE_EXISTS":
      return {
        ...state,
        handleExists: true
      };

    case "GET_USER_BY_HANDLE_STARTED":
      return {
        ...state,
        otherUserLoading: true,
        otherUser: null
      };

    case "GET_USER_BY_HANDLE_ENDED":
      return {
        ...state,
        otherUserLoading: false
      };

    case "GET_USER_BY_HANDLE_NOT_FOUND":
      return {
        ...state,
        otherUser: null
      };

    case "GET_USER_BY_HANDLE_SUCCESS":
      return {
        ...state,
        otherUser: action.otherUser
      };

    case "CLEAR_OTHER_USER_PROFILE":
      return {
        ...state,
        otherUser: null
      };

    case "ADD_OTHER_USER_FOLLOWERS":
      return {
        ...state,
        otherUserFollowers: action.otherUserFollowers
      };

    case "UPDATE_OTHER_USER_FOLLOWERS":
      return {
        ...state,
        otherUserFollowers: action.otherUserFollowers
      };

    case "UPDATE_OTHER_USER_FOLLOWERS_ENDED":
      return {
        ...state,
        otherUserFollowersUpdating: false
      };

    case "UPDATE_OTHER_USER_FOLLOWERS_STARTED":
      return {
        ...state,
        otherUserFollowersUpdating: true
      };
    default:
      return state;
  }
};

export default profileReducer;
