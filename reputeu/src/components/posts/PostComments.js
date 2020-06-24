import React, { Component } from "react";
import { Comment } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
let TimeAgo = require("node-time-ago");

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const { comments } = this.props;
    return (
      <>
        <Comment.Group>
          {comments.map(comment => {
            let commentTime = TimeAgo(comment.commentTime.seconds * 1000);
            return (
              <Comment key={comment.commentID} className="mt-14">
                <Comment.Avatar
                  src={comment.userPhotoURL}
                  className="circular"
                />
                <Comment.Content>
                  <Comment.Author as={Link} to={"/ru/" + comment.userHandle}>
                    {comment.userName}
                  </Comment.Author>
                  <Comment.Metadata>{commentTime}</Comment.Metadata>
                  <Comment.Text>{comment.comment}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                    {comment.userID === this.props.currentUser.uid && (
                      <>
                        <Comment.Action>Edit</Comment.Action>
                        <Comment.Action>Delete</Comment.Action>
                      </>
                    )}
                  </Comment.Actions>
                </Comment.Content>
              </Comment>
            );
          })}
        </Comment.Group>
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    currentUser: auth.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
