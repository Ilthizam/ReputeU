import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Icon, List, Modal, Button } from "semantic-ui-react";
import { getNotifications } from "../../store/Actions/authActions";
import { markNotificationAsRead } from "../../store/Actions/notificationsActions";
let TimeAgo = require("node-time-ago");

class NotificationModal extends Component {
  componentDidMount() {
    this.props.getNotifications();
  }

  formatNotification = notification => {
    let notiTime = TimeAgo(notification.notiDate.seconds * 1000);

    switch (notification.notiType) {
      case "invite":
        return {
          icon: "mail",
          color: "green",
          to: "/review-invites",
          person: notification.inviterName,
          text: "Invited you to review",
          subject: notification.topicName,
          time: notiTime,
          read: notification.read
        };

      case "comment":
        return {
          icon: "comment alternate",
          color: "blue",
          to:
            "/story/" +
            notification.postID +
            "/comment/" +
            notification.commentID,
          person: notification.commenterName,
          text: "Commented on",
          subject: notification.postName,
          time: notiTime,
          read: notification.read
        };

      case "reviewed":
        return {
          icon: "star",
          color: "yellow",
          to: "/manage-reviews/" + notification.topicID,
          person: notification.reviewerName,
          text: "of community " + notification.communityName + " reviewed",
          subject: notification.topicName,
          time: notiTime,
          read: notification.read
        };

      default:
        break;
    }
  };

  onNotificationClick = (e, callback) => {
    this.props.markNotificationAsRead(callback.notificationid);
    this.props.close();
  };

  render() {
    const { open, close, notifications } = this.props;
    return (
      <Modal
        open={open}
        onClose={close}
        closeIcon
        closeOnDimmerClick
        size="small"
      >
        <Modal.Header>
          <Icon name="bell" />
          Notifications
        </Modal.Header>
        <Modal.Content scrolling>
          <List selection relaxed="very" divided>
            {notifications &&
              notifications.map(noti => {
                let data = this.formatNotification(noti);
                return (
                  <List.Item
                    id={noti.notiID}
                    as={Link}
                    to={data.to}
                    onClick={this.onNotificationClick}
                    key={noti.notiID}
                    notificationid={noti.notiID}
                    style={
                      data.read === false
                        ? { backgroundColor: "rgb(248,255,255)" }
                        : null
                    }
                  >
                    <Icon name={data.icon} color={data.color} />
                    <List.Content>
                      <List.Description>
                        <strong>{data.person}</strong> {data.text}{" "}
                        <strong>{data.subject}</strong>
                        <span style={{ float: "right", fontSize: "0.85em" }}>
                          {data.time}
                        </span>
                      </List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" basic>
            Clear
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = ({ notifications }) => {
  return {
    notifications: notifications.notifications,
    gettingNotifications: notifications.gettingNotifications,
    gettingNotificationsError: notifications.gettingNotificationsError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getNotifications: () => dispatch(getNotifications()),
    markNotificationAsRead: notiID => dispatch(markNotificationAsRead(notiID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationModal);
