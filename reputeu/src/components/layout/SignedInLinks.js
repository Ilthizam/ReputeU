import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/Actions/authActions";
import { Menu, Dropdown, Image, Icon, Label } from "semantic-ui-react";
import Avatar from "react-avatar";
import NotificationModal from "./Notifications";

class SignedInLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotifications: false
    };
  }
  openNotifications = () => {
    this.setState({ showNotifications: true });
  };

  closeNotifications = () => {
    this.setState({ showNotifications: false });
  };

  render() {
    const { profile, signOut, notifications } = this.props;
    const { showNotifications } = this.state;
    return (
      <>
        <Menu.Menu position="right">
          <Menu.Item
            name="notifications"
            active={false}
            content={
              <>
                <Label color="red" className="ml-0">
                  {notifications &&
                    notifications.filter(noti => {
                      if (noti.read === false) {
                        return true;
                      }
                      return false;
                    }).length}
                </Label>
                <Icon name="bell" fitted size="large" />
              </>
            }
            onClick={this.openNotifications}
          />
          <Dropdown
            closeOnChange
            item
            trigger={
              <>
                {profile.photoURL ? (
                  <Image
                    circular
                    src={profile.photoURL}
                    style={{ height: "33px", width: "33px" }}
                  />
                ) : (
                  <Avatar name={profile.name} size="33" round />
                )}
              </>
            }
            icon={null}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                icon="user"
                text={profile.name}
                as={NavLink}
                to={"/ru/" + profile.handle}
              />
              <Dropdown.Item
                as={NavLink}
                icon="edit"
                to="/edit-profile"
                text="Edit Profile"
              />
              <Dropdown.Divider className="mt-0 mb-0" />
              <Dropdown.Item
                as={NavLink}
                icon="newspaper outline"
                to="/new-story"
                text="New Story"
              />
              <Dropdown.Item
                as={NavLink}
                icon="unordered list"
                to="/manage-topics"
                text="Topics"
              />
              <Dropdown.Item
                as={NavLink}
                icon="comment alternate"
                to="/manage-reviews"
                text="Reviews"
              />
              <Dropdown.Item
                as={NavLink}
                icon="users"
                to="/manage-community"
                text="Community"
              />
              <Dropdown.Divider className="mt-0 mb-0" />
              <Dropdown.Item onClick={signOut} icon="sign-out" text="Log Out" />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
        <NotificationModal
          open={showNotifications}
          close={this.closeNotifications}
        />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

const mapStateToProps = ({ notifications }) => {
  return {
    notifications: notifications.notifications
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
