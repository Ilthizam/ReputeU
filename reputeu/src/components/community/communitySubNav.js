import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default class CommunitySubNav extends Component {
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <Menu pointing secondary vertical fluid>
        <Menu.Item
          as={NavLink}
          to={"/manage-community"}
          name="Manage Community"
          active={this.props.paths.path === "/manage-community"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/new-community"}
          name="Create New Community"
          active={this.props.paths.path === "/new-community"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        {/* <Menu.Item
          as={NavLink}
          to={"/invite-friends"}
          name="Invite Friends"
          active={this.props.paths.path === "/invite-friends"}
          onClick={this.handleItemClick}
          className="pl-0"
        /> */}
      </Menu>
    );
  }
}
