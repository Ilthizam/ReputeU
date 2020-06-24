const initState = {
  gettingVirtues: false,
  gettingVirtuesError: null,
  virtueList: null,
  topics: [],
  creatingTopic: false,
  creatingTopicError: null,
  gettingTopics: false,
  gettingTopicsError: null,
  deletingTopic: false,
  deletingTopicError: null,
  addingCustomVirtue: false,
  addingCustomVirtueError: null,
  customVirtues: [],
  gettingCustomVirtues: false,
  gettingCustomVirtuesError: null,
  deletingCustomVirtue: false,
  deletingCustomVirtueError: null
};

const virtueReducer = (state = initState, action) => {
  let newTopics = [];
  switch (action.type) {
    case "GETTING_VIRTUES_STARTED":
      return {
        ...state,
        virtueList: null,
        gettingVirtues: true
      };

    case "GETTING_VIRTUES_SUCCESS":
      return {
        ...state,
        virtueList: action.virtues,
        gettingVirtues: false
      };

    case "GETTING_VIRTUES_ERROR":
      return {
        ...state,
        gettingVirtuesError: action.error,
        gettingVirtues: false
      };

    case "CREATING_TOPIC_STARTED":
      return {
        ...state,
        creatingTopicError: null,
        creatingTopic: true
      };

    case "CREATING_TOPIC_SUCCESS":
      if (state.topics && state.topics.length > 0) {
        newTopics = [action.topic, ...state.topics];
      }
      return {
        ...state,
        topics: newTopics,
        creatingTopic: false
      };

    case "CREATING_TOPIC_ERROR":
      return {
        ...state,
        creatingTopicError: action.error,
        creatingTopic: false
      };

    case "GETTING_TOPICS_STARTED":
      return {
        ...state,
        gettingTopicsError: null,
        gettingTopics: true
      };

    case "GETTING_TOPICS_SUCCESS":
      return {
        ...state,
        topics: [...action.topics],
        gettingTopics: false
      };

    case "GETTING_TOPICS_ERROR":
      return {
        ...state,
        gettingTopicsError: action.error,
        gettingTopics: false
      };

    case "DELETING_TOPIC_STARTED":
      return {
        ...state,
        deletingTopicError: null,
        deletingTopic: true
      };

    case "DELETING_TOPIC_SUCCESS":
      return {
        ...state,
        topics: state.topics.filter(topic => {
          return topic.id !== action.topicID;
        }),
        deletingTopic: false
      };

    case "DELETING_TOPIC_ERROR":
      return {
        ...state,
        deletingTopicError: action.error,
        deletingTopic: false
      };

    case "ADDING_VIRTUES_STARTED":
      return {
        ...state,
        addingCustomVirtueError: null,
        addingCustomVirtue: true
      };

    case "ADDING_VIRTUES_SUCCESS":
      let newCVirtues = [];
      if (state.customVirtues && state.customVirtues.length > 0) {
        newCVirtues = [...action.customVirtues, ...state.customVirtues];
      }
      return {
        ...state,
        customVirtues: newCVirtues,
        addingCustomVirtue: false
      };

    case "ADDING_VIRTUES_ERROR":
      return {
        ...state,
        addingCustomVirtueError: action.error,
        addingCustomVirtue: false
      };

    case "GETTING_CUSTOM_VIRTUES_STARTED":
      return {
        ...state,
        customVirtues: null,
        gettingCustomVirtues: true
      };

    case "GETTING_CUSTOM_VIRTUES_SUCCESS":
      return {
        ...state,
        customVirtues: action.customVirtues,
        gettingCustomVirtues: false
      };

    case "GETTING_CUSTOM_VIRTUES_ERROR":
      return {
        ...state,
        gettingCustomVirtuesError: action.error,
        gettingCustomVirtues: false
      };

    case "DELETING_CUSTOM_VIRTUE_STARTED":
      return {
        ...state,
        deletingCustomVirtueError: null,
        deletingCustomVirtue: true
      };

    case "DELETING_CUSTOM_VIRTUE_SUCCESS":
      return {
        ...state,
        customVirtues: state.customVirtues.filter(topic => {
          return topic.id !== action.customVirtueID;
        }),
        deletingCustomVirtue: false
      };

    case "DELETING_CUSTOM_VIRTUE_FAIL":
      return {
        ...state,
        deletingCustomVirtueError: action.error,
        deletingCustomVirtue: false
      };

    case "SELF_REVIEW_SUBMIT_SUCCESS_REDUX":
      newTopics = [];
      state.topics.filter(topic => {
        if (topic.id === action.data.topic.id) {
          newTopics.push({
            ...topic,
            ...action.data.newData
          });
        } else {
          newTopics.push(topic);
        }
        return true;
      });
      console.log(newTopics);
      return {
        ...state,
        topics: newTopics
      };

    default:
      return state;
  }
};

export default virtueReducer;
