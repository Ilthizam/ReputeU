import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default class ReviewSubNav extends Component {
  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    return (
      <Menu pointing secondary vertical fluid>
        <Menu.Item
          as={NavLink}
          to={"/request-reviews"}
          name="Request Reviews"
          active={this.props.paths.path === "/request-reviews"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/manage-reviews"}
          name="Reviews received"
          active={this.props.paths.path === "/manage-reviews"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/review-invites"}
          name="Invitations to review"
          active={this.props.paths.path === "/review-invites"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/self-review"}
          name="Self Review"
          active={this.props.paths.path === "/invite-friends"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
        <Menu.Item
          as={NavLink}
          to={"/compare-reviews"}
          name="Compare Reviews"
          active={this.props.paths.path === "/compare-reviews"}
          onClick={this.handleItemClick}
          className="pl-0"
        />
      </Menu>
    );
  }
}
