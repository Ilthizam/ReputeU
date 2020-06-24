import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";

const RouteGuard = ({
  component: Component,
  authorized,
  protection,
  emailVerified,
  isFacebook,
  isTwitter,
  ...rest
}) => (
  <>
    <Helmet>
      <title>ReputeU</title>
    </Helmet>
    <Route
      {...rest}
      render={props => {
        if (protection === "private-only") {
          if (authorized && (emailVerified || isFacebook || isTwitter)) {
            return <Component {...props} />;
          } else {
            return <Redirect to={"/signin"} />;
          }
        } else if (protection === "public-noauth") {
          if (authorized && (emailVerified || isFacebook || isTwitter)) {
            return <Redirect to={"/home"} />;
          } else {
            return <Component {...props} />;
          }
        } else if (protection === "public-fully") {
          return <Component {...props} />;
        }
      }}
    />
  </>
);

const mapStateToProps = ({ firebase, auth }, ownProps) => {
  return {
    authorized: !firebase.auth.isEmpty,
    emailVerified: firebase.auth.emailVerified
      ? firebase.auth.emailVerified
      : null,
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

export default connect(mapStateToProps)(RouteGuard);
