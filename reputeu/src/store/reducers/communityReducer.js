const initState = {
  gettingCommunities: false,
  gettingCommunitiesError: null,
  communities: null,
  communityUserSuggestions: null,
  communityUserSuggestionsLoading: false,
  communityUserSuggestionsError: false,
  creatingCommunity: false,
  creatingCommunityError: null,
  deletingCommunity: false,
  deletingCommunityError: null,
  deletingCommunityMember: false,
  deletingCommunityMemberError: null,
  changingCommunityName: false,
  changingCommunityNameError: null,
  addingCommunityMember: false,
  addingCommunityMemberError: null
};

const communityReducer = (state = initState, action) => {
  switch (action.type) {
    case "RETRIEVING_COMMUNITIES_STARTED":
      return {
        ...state,
        gettingCommunities: true,
        gettingCommunitiesError: null,
        communities: null
      };

    case "RETRIEVING_COMMUNITIES_SUCCESS":
      return {
        ...state,
        communities: action.communities,
        gettingCommunities: false
      };

    case "RETRIEVING_COMMUNITIES_ERROR":
      return {
        ...state,
        communities: null,
        gettingCommunitiesError: action.error,
        gettingCommunities: false
      };

    case "SEARCH_USER_SUGGESTIONS":
      return {
        ...state,
        communityUserSuggestions: action.users,
        communityUserSuggestionsLoading: false
      };

    case "SEARCH_USER_SUGGESTIONS_STARTED":
      return {
        ...state,
        communityUserSuggestionsLoading: true
      };

    case "SEARCH_USER_SUGGESTIONS_ERROR":
      return {
        ...state,
        communityUserSuggestionsError: action.error,
        communityUserSuggestions: null,
        communityUserSuggestionsLoading: false
      };

    case "CLEAR_REDUX_USER_SUGGESTIONS":
      return {
        ...state,
        communityUserSuggestionsError: null,
        communityUserSuggestions: null,
        communityUserSuggestionsLoading: false
      };

    case "CREATING_COMMUNITY_STARTED":
      return {
        ...state,
        creatingCommunity: true,
        creatingCommunityError: null
      };

    case "CREATING_COMMUNITY_SUCCESS":
      let newCommunities = null;
      if (state.communities && state.communities.length > 0) {
        newCommunities = [action.community, ...state.communities];
      }
      return {
        ...state,
        communities: newCommunities,
        creatingCommunity: false
      };

    case "CREATING_COMMUNITY_ERROR":
      return {
        ...state,
        creatingCommunityError: action.error,
        creatingCommunity: false
      };

    case "DELETING_COMMUNITY_STARTED":
      return {
        ...state,
        deletingCommunityError: null,
        deletingCommunity: true
      };

    case "DELETING_COMMUNITY_SUCCESS":
      let newCommunity = state.communities.filter(res => {
        if (res.communityID === action.communityID) {
          return false;
        }
        return true;
      });
      return {
        ...state,
        deletingCommunityError: null,
        communities: newCommunity,
        deletingCommunity: false
      };

    case "DELETING_COMMUNITY_ERROR":
      return {
        ...state,
        deletingCommunityError: action.error,
        deletingCommunity: false
      };

    case "DELETING_COMMUNITY_MEMBER_STARTED":
      return {
        ...state,
        deletingCommunityMemberError: null,
        deletingCommunityMember: true
      };

    case "DELETING_COMMUNITY_MEMBER_SUCCESS":
      let newCommunity_Member = [...state.communities];
      for (var i in newCommunity_Member) {
        if (newCommunity_Member[i].communityID === action.communityID) {
          let newMembers = newCommunity_Member[i].members;
          newMembers = newMembers.filter(res => {
            if (res.uid === action.memberID) {
              return false;
            }
            return true;
          });
          newCommunity_Member[i].members = newMembers;
          break;
        }
      }
      return {
        ...state,
        deletingCommunityMemberError: null,
        communities: newCommunity_Member,
        deletingCommunityMember: false
      };

    case "DELETING_COMMUNITY_MEMBER_ERROR":
      return {
        ...state,
        deletingCommunityMemberError: action.error,
        deletingCommunityMember: false
      };

    case "CHANGE_COMMUNITY_NAME_STARTED":
      return {
        ...state,
        changingCommunityName: true,
        changingCommunityNameError: null
      };

    case "CHANGE_COMMUNITY_NAME_SUCCESS":
      let newCommunity_Name = [...state.communities];
      for (let k in newCommunity_Name) {
        if (newCommunity_Name[k].communityID === action.communityID) {
          newCommunity_Name[k].name = action.newName;
          break;
        }
      }
      return {
        ...state,
        communities: newCommunity_Name,
        changingCommunityName: false
      };

    case "CHANGE_COMMUNITY_NAME_ERROR":
      return {
        ...state,
        changingCommunityNameError: action.error,
        changingCommunityName: false
      };

    case "ADD_COMMUNITY_MEMBERS_STARTED":
      return {
        ...state,
        addingCommunityMemberError: null,
        addingCommunityMember: true
      };

    case "ADD_COMMUNITY_MEMBERS_ERROR":
      return {
        ...state,
        addingCommunityMemberError: action.error,
        addingCommunityMember: false
      };

    case "ADD_COMMUNITY_MEMBERS_SUCCESS":
      let newCommunity_AddMember = [...state.communities];
      for (let l in newCommunity_AddMember) {
        if (newCommunity_AddMember[l].communityID === action.communityID) {
          let newMembers = newCommunity_AddMember[l].members;
          newMembers.push(...action.members);
          newCommunity_AddMember[l].members = newMembers;
          break;
        }
      }
      return {
        ...state,
        addingCommunityMemberError: action.error,
        communities: newCommunity_AddMember,
        addingCommunityMember: false
      };

    default:
      return state;
  }
};

export default communityReducer;
