import React, { Component } from "react";
import { connect } from "react-redux";
import ProfileHeadComponent from "./profileHeadComponent";
import {
  getProfileByHandle,
  clearOtherUserProfile
} from "../../store/Actions/profileActions";
import ProfileSpinner from "../../helpers/profileSpinner";

class ViewProfile extends Component {
  componentDidMount() {
    if (this.props.otherUser) {
      if (this.props.otherUser.handle !== this.props.match.params.handle) {
        const handle = this.props.match.params.handle;
        this.props.getProfileByHandle(handle);
      }
    } else if (
      this.props.match.params.handle &&
      this.props.match.params.handle !== this.props.profile.handle
    ) {
      const handle = this.props.match.params.handle;
      this.props.getProfileByHandle(handle);
    }
  }

  componentDidUpdate(prevProps, PrevState) {
    if (
      this.props.match.params.handle &&
      prevProps.match.params.handle !== this.props.match.params.handle &&
      this.props.match.params.handle !== this.props.profile.handle
    ) {
      if (
        !(
          this.props.otherUser &&
          this.props.otherUser.handle === this.props.match.params.handle
        )
      ) {
        const handle = this.props.match.params.handle;
        this.props.getProfileByHandle(handle);
      }
    }
  }

  render() {
    const { profile, otherUser, otherUserLoading } = this.props;
    if (this.props.match.params.handle === profile.handle) {
      return <ProfileHeadComponent user={profile} />;
    } else if (otherUserLoading) {
      return <ProfileSpinner mode="normal" />;
    } else if (otherUser === null) {
      return <ProfileSpinner mode="not-found" />;
    } else if (otherUser !== null) {
      return <ProfileHeadComponent user={otherUser} />;
    }
  }
}

const mapStateToProps = ({ auth, profile }) => {
  return {
    profile: auth.currentUser,
    otherUser: profile.otherUser,
    otherUserLoading: profile.otherUserLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileByHandle: handle => dispatch(getProfileByHandle(handle)),
    clearOtherUserProfile: () => dispatch(clearOtherUserProfile())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
