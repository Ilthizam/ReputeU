import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default class TopicSubNav extends Component {
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <Menu pointing secondary vertical fluid>
        <Menu.Item
          as={NavLink}
          to={"/manage-topics"}
          name="Manage Review Topics"
          active={this.props.paths.path === "/manage-topics"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/new-topic"}
          name="Create New Review Topic"
          active={this.props.paths.path === "/new-topic"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/manage-custom-virtues"}
          name="Manage Custom Virtues"
          active={this.props.paths.path === "/manage-custom-virtues"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/add-custom-virtue"}
          name="Add Custom Virtue"
          active={this.props.paths.path === "/add-custom-virtue"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
      </Menu>
    );
  }
}
