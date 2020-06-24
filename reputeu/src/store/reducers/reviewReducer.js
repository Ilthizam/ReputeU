const initState = {
  sendingRequests: false,
  sendingRequestsError: null,
  invitedTopics: null,
  gettingInvitedTopics: false,
  gettingInvitedTopicsError: null,
  submittingReview: false,
  submittingReviewError: null,
  submittingSelfReview: false,
  submittingSelfReviewError: null,
  reviewResponses: null,
  gettingReviewResponsesError: null,
  gettingReviewResponses: false,
  reviewedTopics: null,
  gettingReviewedTopics: false,
  gettingReviewedTopicsError: null,
  topicResponses: null,
  gettingTopicResponses: false,
  gettingTopicResponsesError: null
};

const reviewReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADDING_REQUEST_STARTED":
      return {
        ...state,
        sendingRequestsError: null,
        sendingRequests: true
      };

    case "ADDING_REQUEST_SUCCESS":
      return {
        ...state,
        sendingRequests: false
      };

    case "ADDING_REQUEST_ERROR":
      return {
        ...state,
        sendingRequestsError: action.error,
        sendingRequests: false
      };

    case "GETTING_INVITED_TOPICS_STARTED":
      return {
        ...state,
        invitedTopics: null,
        gettingInvitedTopicsError: null,
        gettingInvitedTopics: true
      };

    case "GETTING_INVITED_TOPICS_SUCCESS":
      return {
        ...state,
        invitedTopics: [...action.invites],
        gettingInvitedTopics: false
      };

    case "GETTING_INVITED_TOPICS_ERROR":
      return {
        ...state,
        gettingInvitedTopicsError: action.error,
        gettingInvitedTopics: false
      };

    case "REVIEW_SUBMIT_STARTED":
      return {
        ...state,
        submittingReviewError: null,
        submittingReview: true
      };

    case "REVIEW_SUBMIT_SUCCESS":
      let newTopics = [];
      state.invitedTopics.filter(topic => {
        if (topic.inviteID === action.inviteID) {
          newTopics.push({
            ...topic,
            reviewed: true,
            dateReviewed: { seconds: new Date().getTime() / 1000 },
            anonymous: action.anonymous === "true"
          });
        } else {
          newTopics.push({ ...topic });
        }
        return true;
      });
      return {
        ...state,
        invitedTopics: newTopics,
        submittingReview: false
      };

    case "REVIEW_SUBMIT_ERROR":
      return {
        ...state,
        submittingReviewError: action.error,
        submittingReview: false
      };

    case "GETTING_REVIEW_RESPONSES_STARTED":
      return {
        ...state,
        reviewResponses: null,
        gettingReviewResponsesError: null,
        gettingReviewResponses: true
      };

    case "GETTING_REVIEW_RESPONSES_SUCCESS":
      return {
        ...state,
        // reviewResponses: action.responses,
        gettingReviewResponses: false
      };

    case "GETTING_REVIEW_RESPONSES_ERROR":
      return {
        ...state,
        gettingReviewResponsesError: action.error,
        gettingReviewResponses: false
      };

    case "GETTING_REVIEWED_TOPICS_STARTED":
      return {
        ...state,
        gettingReviewedTopicsError: null,
        gettingReviewedTopics: true
      };

    case "GETTING_REVIEWED_TOPICS_SUCCESS":
      return {
        ...state,
        reviewedTopics: action.reviewedTopics,
        gettingReviewedTopics: false
      };

    case "GETTING_REVIEWED_TOPICS_ERROR":
      return {
        ...state,
        gettingReviewedTopicsError: action.error,
        gettingReviewedTopics: false
      };

    case "GETTING_TOPIC_RESPONSES_STARTED":
      return {
        ...state,
        topicResponses: null,
        gettingTopicResponsesError: null,
        gettingTopicResponses: true
      };

    case "GETTING_TOPIC_RESPONSES_SUCCESS":
      return {
        ...state,
        topicResponses: action.responses,
        gettingTopicResponses: false
      };

    case "GETTING_TOPIC_RESPONSES_ERROR":
      return {
        ...state,
        gettingTopicResponsesError: action.error,
        gettingTopicResponses: false
      };

    case "SELF_REVIEW_SUBMIT_STARTED":
      return {
        ...state,
        submittingSelfReviewError: null,
        submittingSelfReview: true
      };

    case "SELF_REVIEW_SUBMIT_SUCCESS":
      return {
        ...state,
        submittingSelfReview: false
      };

    case "SELF_REVIEW_SUBMIT_ERROR":
      return {
        ...state,
        submittingSelfReviewError: action.error,
        submittingSelfReview: false
      };

    default:
      return state;
  }
};

export default reviewReducer;
