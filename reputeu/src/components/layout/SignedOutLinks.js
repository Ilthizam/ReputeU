import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const SignedInLinks = () => {
  return (
    <Menu.Menu position="right">
      <Menu.Item as={NavLink} to="/signin">
        Sign In
      </Menu.Item>
      <Menu.Item as={NavLink} to="/signup">
        Sign Up
      </Menu.Item>
    </Menu.Menu>
  );
};

export default SignedInLinks;
