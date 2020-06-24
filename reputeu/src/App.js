import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import NavbarComp from "./components/layout/Navbar";
import Landing from "./components/landing/Landing";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreatePost from "./components/posts/CreatePost";
import { connect } from "react-redux";
import { compose } from "redux";
import RouteGuard from "./components/auth/RouteGuard";
import Spinner from "./helpers/spinner";
import NotFoundPage from "./components/404/404";
import EditProfile from "./components/profile/EditProfile";
import { updateCurrentUser } from "./store/Actions/authActions";
import ViewProfile from "./components/profile/ViewProfile";
import PostDetails from "./components/posts/postDetails";
import ManageCommunity from "./components/community/manageCommunity";
import NewCommunity from "./components/community/createCommunity";
import ManageTopics from "./components/topic/manageTopics";
import NewTopic from "./components/topic/newTopic";
import AddCustomVirtue from "./components/topic/addCustomVirtue";
import ManageCustomVirtues from "./components/topic/manageCustomVirtues";
import InviteFriends from "./components/community/inviteFriends";
import RequestReviews from "./components/review/requestReviews";
import Reviews from "./components/review/reviews";
import ReviewInvitations from "./components/review/reviewInvitations";
import SelfReview from "./components/review/selfReview";
import CompareReviews from "./components/review/compareReviews";
import Accounts from "./components/auth/accounts";

class App extends Component {
  componentDidMount() {
    this.props.updateCurrentUser();
  }

  render() {
    const { loading, isProfileLoading } = this.props;
    if (loading || isProfileLoading) {
      return <Spinner />;
    } else {
      return (
        <BrowserRouter>
          <div className="App">
            <NavbarComp />
            <Switch>
              <RouteGuard
                exact
                path="/"
                component={SignIn}
                protection="public-noauth"
              />
              <RouteGuard
                exact
                path="/ru/:handle"
                component={ViewProfile}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/story/:postID/comment/:commentID"
                component={PostDetails}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/story/:postID"
                component={PostDetails}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/home"
                component={Landing}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/signin"
                component={SignIn}
                protection="public-noauth"
              />
              <RouteGuard
                exact
                path="/signup"
                component={SignUp}
                protection="public-noauth"
              />
              <RouteGuard
                exact
                path="/edit-profile"
                component={EditProfile}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/new-story"
                component={CreatePost}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/profile"
                component={ViewProfile}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/manage-community"
                component={ManageCommunity}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/new-community"
                component={NewCommunity}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/manage-topics"
                component={ManageTopics}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/new-topic"
                component={NewTopic}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/add-custom-virtue"
                component={AddCustomVirtue}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/manage-custom-virtues"
                component={ManageCustomVirtues}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/invite-friends"
                component={InviteFriends}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/request-reviews"
                component={RequestReviews}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/manage-reviews/:topic"
                component={Reviews}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/manage-reviews"
                component={Reviews}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/review-invites"
                component={ReviewInvitations}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/self-review"
                component={SelfReview}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/compare-reviews"
                component={CompareReviews}
                protection="private-only"
              />
              <RouteGuard
                exact
                path="/accounts"
                component={Accounts}
                protection="public-noauth"
              />
              <RouteGuard component={NotFoundPage} protection="public-fully" />
            </Switch>
          </div>
        </BrowserRouter>
      );
    }
  }
}
const mapStateToProps = ({ firebase, auth }) => {
  let isProfileLoading = false;
  if (firebase.auth.uid) {
    if (firebase.auth.uid.length > 0 && auth.currentUser) {
      isProfileLoading = false;
    } else {
      isProfileLoading = true;
    }
  } else {
    isProfileLoading = false;
  }
  return {
    loading: !firebase.auth.isLoaded,
    uid: firebase.auth.uid,
    isProfileLoading: isProfileLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentUser: () => dispatch(updateCurrentUser())
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);
