import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";
import { Menu } from "semantic-ui-react";

class NavbarComp extends Component {
  render() {
    const { profile, isFacebook, isTwitter, user } = this.props;
    const links =
      user.emailVerified || isFacebook || isTwitter ? (
        <SignedInLinks profile={profile} />
      ) : (
        <SignedOutLinks />
      );
    return (
      <Menu borderless fixed="top" style={{ height: "60px" }}>
        <Menu.Item
          isActive={() => {
            return false;
          }}
          as={NavLink}
          content={<>ReputeU</>}
          to="/"
          exact
          style={{ fontSize: "1.5rem" }}
        />
        {links}
      </Menu>
    );
  }
}

const mapStateToProps = ({ firebase, auth }) => {
  return {
    user: firebase.auth,
    profile: auth.currentUser,
    isFacebook: firebase.auth.providerData
      ? firebase.auth.providerData["0"].providerId === "facebook.com"
        ? true
        : false
      : null,
    isTwitter: firebase.auth.providerData
      ? firebase.auth.providerData["0"].providerId === "twitter.com"
        ? true
        : false
      : null
  };
};

export default connect(mapStateToProps)(NavbarComp);
