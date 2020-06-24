const initState = {
  notifications: null,
  gettingNotifications: false,
  gettingNotificationsError: null
};

const notificationsReducer = (state = initState, action) => {
  switch (action.type) {
    case "GET_NOTIFICATIONS":
      return {
        ...state,
        gettingNotificationsError: null,
        gettingNotifications: true
      };

    case "GET_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        notifications: action.notifications,
        gettingNotifications: false
      };

    case "GET_NOTIFICATIONS_ERROR":
      return {
        ...state,
        notifications: null,
        gettingNotificationsError: action.error,
        gettingNotifications: true
      };

    default:
      return state;
  }
};

export default notificationsReducer;
