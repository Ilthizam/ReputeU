import React, { Component } from "react";
import {
  Container,
  Card,
  Button,
  Grid,
  Icon,
  Image,
  Rating,
  Header,
  Breadcrumb,
  Input,
  Dropdown,
  Form,
  Placeholder
} from "semantic-ui-react";
import PostEditor from "./PostEditor";
import {
  retrieveFullPost,
  commitPostEdits,
  retrieveAllComments,
  submitComment,
  clearFullPostData,
  retrievePostLikes,
  likePost,
  unlikePost
} from "../../store/Actions/postsActions";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import FullPostSpinner from "../../helpers/fullPostSpinner";
import PostComments from "./PostComments";

let moment = require("moment");

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullPost: null,
      gettingFullPost: true,
      title: "",
      rawContent: "",
      content: "",
      contentLength: 0,
      postEditMode: false,
      optionsDropdownState: undefined,
      commentContent: "",
      commentValid: false,
      editsValid: false,
      postLikes: null,
      liked: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const postID = this.props.match.params.postID;

    if (this.props.fullPost && this.props.postLikes) {
      if (this.props.fullPost.id !== postID) {
        this.props.clearFullPostData();
        this.props.retrieveFullPost(postID);
        this.props.retrievePostLikes(postID);
      } else {
        this.setState({
          title: this.props.fullPost.title,
          contentLength: this.props.fullPost.contentLength,
          content: this.props.fullPost.htmlContent,
          rawContent: this.props.fullPost.rawContent
        });
        if (
          this.props.postLikes &&
          this.props.postLikes.users.includes(this.props.currentUser.uid)
        ) {
          this.setState({ liked: true });
        } else {
          this.setState({ liked: false });
        }
      }
    } else {
      this.props.retrieveFullPost(postID);
      this.props.retrievePostLikes(postID);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.fullPost && prevProps.fullPost !== this.props.fullPost) {
      this.setState({
        title: this.props.fullPost.title,
        contentLength: this.props.fullPost.contentLength,
        content: this.props.fullPost.htmlContent,
        rawContent: this.props.fullPost.rawContent
      });
    }

    if (
      prevProps.updatePostSuccess !== this.props.updatePostSuccess &&
      this.props.updatePostSuccess === true
    ) {
      this.setState({
        title: this.props.fullPost.title,
        contentLength: this.props.fullPost.contentLength,
        content: this.props.fullPost.htmlContent,
        rawContent: this.props.fullPost.rawContent,
        postEditMode: false
      });
    }

    if (
      this.props.fullPost &&
      this.props.fullPostAuthor &&
      prevProps.fullPostAuthor !== this.props.fullPostAuthor
    ) {
      this.retrieveComments();
    }

    if (
      this.props.addingCommentSuccess === true &&
      this.props.addingCommentSuccess !== prevProps.addingCommentSuccess
    ) {
      this.setState({ commentContent: "" });
      let objDiv = document.getElementById("comment-section-div");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }

    if (
      this.props.likingPost !== prevProps.likingPost ||
      (this.props.postLikes && this.props.postLikes !== prevProps.postLikes)
    ) {
      if (
        this.props.postLikes &&
        this.props.postLikes.users.includes(this.props.currentUser.uid)
      ) {
        this.setState({ liked: true });
      } else {
        this.setState({ liked: false });
      }
    }

    if (
      this.props.match.params !== prevProps.match.params &&
      this.props.match.params.commentID
    ) {
      this.retrieveComments();
    }
  }

  getEditorData = html => {
    this.setState({ content: html });
  };

  getEditorRawData = raw => {
    this.setState({ rawContent: raw });
  };

  getEditorLength = characters => {
    this.setState({ contentLength: characters });
  };

  onChangeTitle = e => {
    if (e.target.value.length <= 100) {
      this.setState({ title: e.target.value });
    }
  };

  toggleEdit = (e, callback) => {
    switch (callback.value) {
      case "edit":
        this.setState({ postEditMode: true });
        break;
      case "discard":
        this.setState({
          title: this.props.fullPost.title,
          contentLength: this.props.fullPost.contentLength,
          content: this.props.fullPost.htmlContent,
          rawContent: this.props.fullPost.rawContent,
          postEditMode: false
        });
        break;
      default:
        break;
    }
  };

  commitPostEdits = () => {
    if (
      this.props.currentUser.uid === this.props.fullPost.authorUID &&
      this.props.updatingPost === false &&
      this.state.title.length >= 10 &&
      this.state.contentLength >= 50
    ) {
      this.props.commitPostEdits({
        ...this.state,
        postID: this.props.fullPost.id
      });
    } else {
      alert("not allowed to change");
    }
  };

  retrieveComments = () => {
    this.props.retrieveAllComments(this.props.fullPost.id);
  };

  handleComment = (e, callback) => {
    this.setState({ commentContent: callback.value });
    if (callback.value.length === 0) {
      this.setState({ commentValid: false });
    } else {
      this.setState({ commentValid: true });
    }
  };

  submitComment = () => {
    if (this.state.commentValid) {
      this.props.submitComment(this.state.commentContent);
    } else {
      alert("type a comment");
    }
  };

  handleLikePost = () => {
    if (this.props.likingPost === false) {
      this.props.likePost(this.props.fullPost.id, this.props.currentUser.uid);
    }
  };

  handleUnlikePost = () => {
    if (this.props.likingPost === false) {
      this.props.unlikePost(this.props.fullPost.id, this.props.currentUser.uid);
    }
  };

  render() {
    const {
      fullPost,
      gettingFullPost,
      fullPostAuthor,
      updatingPost,
      postComments,
      gettingPostComments,
      addingComment,
      currentUser,
      gettingPostLikes,
      postLikes
    } = this.props;
    const {
      content,
      contentLength,
      title,
      postEditMode,
      optionsDropdownState,
      commentValid,
      commentContent,
      liked
    } = this.state;
    const editOptions = [
      {
        key: "edit",
        icon: "edit",
        text: "Edit Post",
        value: "edit",
        selected: false
      },
      {
        key: "delete",
        icon: "delete",
        text: "Delete Post",
        value: "delete",
        selected: false
      }
    ];
    if (fullPost && fullPostAuthor) {
      const postDate = moment
        .unix(fullPost.createdOn.seconds)
        .format("hh:mma DD-MMM-YYYY");
      return (
        <>
          <Container>
            <Helmet>
              <title>{fullPost.title} | ReputeU</title>
              <link rel="canonical" href={"https://reputeu.com/edit-profile"} />
            </Helmet>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Breadcrumb>
                    <Breadcrumb.Section link as={Link} to="/">
                      Home
                    </Breadcrumb.Section>
                    <Breadcrumb.Divider icon="right chevron" />
                    <Breadcrumb.Section>Post</Breadcrumb.Section>
                    <Breadcrumb.Divider icon="right arrow" />
                    <Breadcrumb.Section active>
                      {fullPost.title}
                    </Breadcrumb.Section>
                  </Breadcrumb>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid>
              <Grid.Row>
                <Grid.Column computer={16}>
                  <Card fluid>
                    <Card.Content>
                      <Grid verticalAlign="middle">
                        <Grid.Row columns="3">
                          <Grid.Column
                            computer="1"
                            tablet="2"
                            mobile="2"
                            className="pr-0"
                          >
                            <Image
                              circular
                              src={fullPostAuthor.photoURL}
                              className="full-image"
                            />
                          </Grid.Column>
                          <Grid.Column computer="10" tablet="8" mobile="8">
                            <label
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: "bold"
                              }}
                            >
                              {fullPostAuthor.name}
                            </label>
                            <label
                              style={{
                                fontSize: "0.85rem",
                                color: "#888888",
                                display: "block"
                              }}
                            >
                              {postDate}{" "}
                              {fullPost.edited &&
                                fullPost.edited === true &&
                                "| Edited"}
                            </label>
                          </Grid.Column>
                          <Grid.Column computer="5" tablet="6" mobile="6">
                            {fullPost.authorUID === currentUser.uid && (
                              <>
                                {postEditMode === true ? (
                                  <>
                                    <Button
                                      color="teal"
                                      floated="right"
                                      onClick={this.commitPostEdits}
                                      disabled={
                                        updatingPost ||
                                        !(
                                          title.length >= 10 &&
                                          contentLength >= 50
                                        )
                                      }
                                      loading={updatingPost}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      basic
                                      color="red"
                                      floated="right"
                                      value="discard"
                                      onClick={this.toggleEdit}
                                      disabled={updatingPost}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button.Group
                                    color="teal"
                                    basic
                                    floated="right"
                                  >
                                    <Dropdown
                                      className="button icon"
                                      floating
                                      options={editOptions}
                                      trigger={"Options "}
                                      value={optionsDropdownState}
                                      onOpen={() => {
                                        !this.state.optionsDropdownState &&
                                          this.setState({
                                            optionsDropdownState: undefined
                                          });
                                      }}
                                      onChange={this.toggleEdit}
                                      selectOnBlur={false}
                                    />
                                  </Button.Group>
                                )}
                              </>
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Card.Content>
                    <Card.Content>
                      <Grid>
                        <Grid.Row className={postEditMode ? "" : "pb-0"}>
                          <Grid.Column>
                            {postEditMode === true ? (
                              <>
                                <Input
                                  placeholder="Title (at least 10 characters)"
                                  fluid
                                  onChange={this.onChangeTitle}
                                  value={title}
                                />
                                <span
                                  style={{
                                    float: "right",
                                    fontSize: "0.9rem",
                                    color: "grey"
                                  }}
                                >
                                  {title.length}/100
                                </span>
                              </>
                            ) : (
                              <Header as="h2" className="mb-0 text-break">
                                {fullPost.title}
                              </Header>
                            )}
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="pt-0">
                          <Grid.Column>
                            <PostEditor
                              dataCallback={this.getEditorData}
                              rawDataCallback={this.getEditorRawData}
                              charLengthCallback={this.getEditorLength}
                              htmlData={
                                postEditMode ? content : fullPost.htmlContent
                              }
                              readOnly={!postEditMode}
                              toolbarHidden={!postEditMode}
                              display={!postEditMode}
                              reset={!postEditMode}
                            />

                            {postEditMode === true ? (
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "0.9rem",
                                  color: "grey"
                                }}
                              >
                                {contentLength}/10000
                              </span>
                            ) : null}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Card.Content>
                    <Card.Content>
                      <Grid verticalAlign="middle">
                        <Grid.Row columns={3}>
                          <Grid.Column computer="2" tablet="4" mobile="4">
                            <Icon name="comment outline" />{" "}
                            {gettingPostComments ? (
                              "..."
                            ) : (
                              <>{postComments && postComments.length}</>
                            )}
                          </Grid.Column>
                          <Grid.Column computer="2" tablet="4" mobile="4">
                            {liked ? (
                              <Icon
                                name="thumbs up"
                                onClick={this.handleUnlikePost}
                                style={{ cursor: "pointer" }}
                                color="blue"
                              />
                            ) : (
                              <Icon
                                name="thumbs up outline"
                                onClick={this.handleLikePost}
                                style={{ cursor: "pointer" }}
                              />
                            )}{" "}
                            {gettingPostLikes ? (
                              "..."
                            ) : (
                              <>
                                {postLikes && postLikes.users
                                  ? postLikes.users.length
                                  : "0"}
                              </>
                            )}
                          </Grid.Column>
                          <Grid.Column
                            computer="12"
                            tablet="8"
                            mobile="8"
                            textAlign="right"
                          >
                            {Math.round(fullPost.rating.average * 10) / 10}{" "}
                            <Rating
                              icon="star"
                              rating={Math.round(fullPost.rating.average)}
                              maxRating={5}
                              disabled
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Card.Content>
                    <Card.Content
                      className="comment-section"
                      id="comment-section-div"
                    >
                      {gettingPostComments ? (
                        <>
                          <Placeholder>
                            <Placeholder.Line length="short" />
                          </Placeholder>
                          <Placeholder>
                            <Placeholder.Header image>
                              <Placeholder.Line />
                              <Placeholder.Line />
                            </Placeholder.Header>
                          </Placeholder>
                        </>
                      ) : (
                        <>
                          {postComments && (
                            <>
                              <Header as="h3">
                                {postComments.length} Comment
                                {postComments.length === 1 ? null : "s"}
                              </Header>
                              {postComments.length > 0 && (
                                <PostComments
                                  comments={this.props.postComments}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Card.Content>
                    <Card.Content>
                      <Form reply>
                        <Form.TextArea
                          onChange={this.handleComment}
                          rows="6"
                          value={commentContent}
                        />
                        <Button
                          content="Comment"
                          color="teal"
                          floated="right"
                          onClick={this.submitComment}
                          disabled={!commentValid || addingComment}
                          loading={addingComment}
                        />
                      </Form>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </>
      );
    } else if (gettingFullPost === true) {
      return <FullPostSpinner />;
    } else {
      return "No such post";
    }
  }
}

const mapStateToProps = ({ auth, posts }) => {
  return {
    gettingFullPost: posts.gettingFullPost,
    fullPost: posts.fullPost,
    gettingFullPostError: posts.gettingFullPostError,
    currentUser: auth.currentUser,
    fullPostAuthor: posts.fullPostAuthor,
    updatePostSuccess: posts.updatePostSuccess,
    updatingPost: posts.updatingPost,
    updatePostError: posts.updatePostError,
    postComments: posts.postComments,
    gettingPostComments: posts.gettingPostComments,
    gettingPostCommentsError: posts.gettingPostCommentsError,
    addingComment: posts.addingComment,
    addingCommentSuccess: posts.addingCommentSuccess,
    addingCommentFail: posts.addingCommentFail,
    gettingPostLikes: posts.gettingPostLikes,
    postLikes: posts.postLikes,
    likingPost: posts.likingPost
  };
};

const mapDispatchToProps = dispatch => {
  return {
    retrieveFullPost: postID => dispatch(retrieveFullPost(postID)),
    commitPostEdits: post => dispatch(commitPostEdits(post)),
    retrieveAllComments: postID => dispatch(retrieveAllComments(postID)),
    submitComment: comment => dispatch(submitComment(comment)),
    clearFullPostData: () => dispatch(clearFullPostData()),
    retrievePostLikes: postID => dispatch(retrievePostLikes(postID)),
    likePost: (postID, uid) => dispatch(likePost(postID, uid)),
    unlikePost: (postID, uid) => dispatch(unlikePost(postID, uid))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);
