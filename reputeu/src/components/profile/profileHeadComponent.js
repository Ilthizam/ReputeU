import React, { Component } from "react";
import {
  Container,
  Grid,
  Card,
  Image,
  Placeholder,
  Breadcrumb,
  Icon,
  Responsive,
  Button,
  Popup
} from "semantic-ui-react";
import Img from "react-image";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getOtherUserFollowers,
  addFollower
} from "../../store/Actions/profileActions";
import { Helmet } from "react-helmet";
import ProfilePostsComponent from "./profilePostsComponent";
let moment = require("moment");

class ProfileHeadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followedBy: null,
      following: null,
      followIconFilled: false,
      followIconShow: false,
      postCount: 0,
      postCountLoading: true
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.props.currentUser.uid !== this.props.user.uid) {
      if (this.props.otherUserFollowers === null) {
        this.props.getOtherUserFollowers(this.props.user.uid);
      } else {
        this.setState({
          following: this.props.otherUserFollowers.following.length,
          followedBy: this.props.otherUserFollowers.followedBy.length,
          followIconShow: true,
          followIconFilled: this.props.currentUserFollowers.following.includes(
            this.props.user.uid
          )
            ? true
            : false
        });
      }
    } else if (
      this.props.currentUser.uid === this.props.user.uid &&
      this.props.currentUserFollowers
    ) {
      this.setState({
        following: this.props.currentUserFollowers.following.length,
        followedBy: this.props.currentUserFollowers.followedBy.length,
        followIconShow: false,
        followIconFilled: false
      });
    }

    if (this.props.userPosts) {
      this.setState({
        postCountLoading: false,
        postCount: this.props.userPosts.length
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.user.uid !== this.props.user.uid &&
      this.props.currentUser.uid !== this.props.user.uid &&
      this.props.otherUser.uid !== this.props.user.uid
    ) {
      this.props.getOtherUserFollowers(this.props.user.uid);
    }

    if (
      prevState === this.state &&
      this.props.user.uid === this.props.currentUser.uid &&
      this.props.currentUserFollowers
    ) {
      this.setState({
        following: this.props.currentUserFollowers.following.length,
        followedBy: this.props.currentUserFollowers.followedBy.length,
        followIconShow: false,
        followIconFilled: false
      });
    } else if (prevState === this.state && this.props.otherUserFollowers) {
      this.setState({
        following: this.props.otherUserFollowers.following.length,
        followedBy: this.props.otherUserFollowers.followedBy.length,
        followIconShow: true,
        followIconFilled: this.props.currentUserFollowers.following.includes(
          this.props.user.uid
        )
          ? true
          : false
      });
    }

    if (
      this.props.gettingUserPosts === true &&
      this.props.gettingUserPosts !== prevProps.gettingUserPosts
    ) {
      this.setState({
        postCountLoading: true
      });
    } else if (
      this.props.userPosts &&
      this.props.gettingUserPosts === false &&
      this.props.gettingUserPosts !== prevProps.gettingUserPosts
    ) {
      this.setState({
        postCountLoading: false,
        postCount: this.props.userPosts.length
      });
    }
  }

  toggleFollowButton = () => {
    this.props.addFollower(this.props.user.uid);
  };

  render() {
    const {
      name,
      photoURL,
      handle,
      introduction,
      websiteLink,
      twitterLink,
      facebookLink,
      joinedOn,
      uid
    } = this.props.user;
    const joinedDate = moment.unix(joinedOn.seconds).format("DD-MMM-YYYY");
    const { userFollowersLoading, otherUserFollowersUpdating } = this.props;
    const {
      following,
      followedBy,
      followIconFilled,
      followIconShow,
      postCount,
      postCountLoading
    } = this.state;
    return (
      <Container>
        <Helmet>
          <title>{name} | ReputeU</title>
          <link rel="canonical" href={"https://reputeu.com/ru/" + handle} />
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section>User</Breadcrumb.Section>
                <Breadcrumb.Divider icon="right arrow" />
                <Breadcrumb.Section active>{name}</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Grid>
                    <Grid.Row columns={2} className="pb-0 pt-0" stretched>
                      <Grid.Column
                        computer={4}
                        tablet={6}
                        mobile={16}
                        className="pl-0 pr-0"
                      >
                        <Responsive minWidth={768}>
                          {photoURL ? (
                            <Img
                              src={photoURL}
                              loader={
                                <Placeholder>
                                  <Placeholder.Image square />
                                </Placeholder>
                              }
                              unloader={
                                <Image src="https://react.semantic-ui.com/images/wireframe/square-image.png" />
                              }
                              style={{ width: "100%", height: "auto" }}
                            />
                          ) : (
                            <Image src="https://react.semantic-ui.com/images/wireframe/square-image.png" />
                          )}
                        </Responsive>
                      </Grid.Column>
                      <Grid.Column computer={12} tablet={10} mobile={16}>
                        <Grid className="pt-14 pb-14">
                          <Grid.Row>
                            <Responsive
                              maxWidth={767}
                              as={Grid.Column}
                              mobile={3}
                              className="pr-0"
                            >
                              {photoURL ? (
                                <Image
                                  floated="left"
                                  src={photoURL}
                                  style={{ width: "100%", height: "auto" }}
                                />
                              ) : (
                                <Image src="https://react.semantic-ui.com/images/wireframe/square-image.png" />
                              )}
                            </Responsive>
                            <Grid.Column mobile={13} computer={16}>
                              <label
                                style={{
                                  fontSize: "1.6rem",
                                  fontWeight: "bold"
                                }}
                              >
                                {name}
                              </label>
                              <br />
                              <label>{handle}</label>
                              <br />
                              <label
                                className="pt-7"
                                style={{ color: "grey", fontSize: "0.85rem" }}
                              >
                                Member since {joinedDate}
                              </label>
                            </Grid.Column>
                          </Grid.Row>
                          {introduction.length > 0 ? (
                            <Grid.Row className="pt-0">
                              <Grid.Column>
                                <label>{introduction}</label>
                              </Grid.Column>
                            </Grid.Row>
                          ) : null}
                          {(websiteLink.length > 0 ||
                            facebookLink.length > 0 ||
                            twitterLink.length > 0) && (
                            <Grid.Row className="pt-0">
                              <Grid.Column>
                                {websiteLink.length > 0 && (
                                  <a
                                    href={websiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mr-14"
                                  >
                                    <Icon name="globe" color="black" />
                                  </a>
                                )}

                                {facebookLink.length > 0 && (
                                  <a
                                    href={
                                      "https://www.facebook.com/" + facebookLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mr-14"
                                  >
                                    <Icon name="facebook" color="blue" />
                                  </a>
                                )}

                                {twitterLink.length > 0 && (
                                  <a
                                    href={
                                      "https://www.twitter.com/" + twitterLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mr-14"
                                  >
                                    <Icon name="twitter" color="blue" />
                                  </a>
                                )}
                              </Grid.Column>
                            </Grid.Row>
                          )}
                          <Grid.Row columns={4} divided verticalAlign="bottom">
                            <Grid.Column textAlign="center">
                              <label>
                                <strong>Followers</strong>
                              </label>
                              <br />
                              {userFollowersLoading ? (
                                <center>
                                  <Placeholder
                                    style={{ height: 19, width: 10 }}
                                  >
                                    <Placeholder.Image />
                                  </Placeholder>
                                </center>
                              ) : (
                                followedBy
                              )}
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                              <label>
                                <strong>Following</strong>
                              </label>
                              <br />
                              {userFollowersLoading ? (
                                <center>
                                  <Placeholder
                                    style={{ height: 19, width: 10 }}
                                  >
                                    <Placeholder.Image />
                                  </Placeholder>
                                </center>
                              ) : (
                                following
                              )}
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                              <label>
                                <strong>Posts</strong>
                              </label>
                              <br />
                              <label>
                                {postCountLoading ? (
                                  <center>
                                    <Placeholder
                                      style={{ height: 19, width: 10 }}
                                    >
                                      <Placeholder.Image />
                                    </Placeholder>
                                  </center>
                                ) : (
                                  postCount
                                )}
                              </label>
                            </Grid.Column>
                            {followIconShow === true ? (
                              <>
                                <Grid.Column textAlign="center">
                                  {userFollowersLoading ? (
                                    <center>
                                      <Placeholder
                                        style={{ height: 30, width: 30 }}
                                      >
                                        <Placeholder.Image />
                                      </Placeholder>
                                    </center>
                                  ) : (
                                    <>
                                      {followIconFilled ? (
                                        <Button
                                          circular
                                          icon={"bell"}
                                          basic={false}
                                          color="yellow"
                                          onClick={this.toggleFollowButton}
                                          disabled={otherUserFollowersUpdating}
                                          loading={otherUserFollowersUpdating}
                                        />
                                      ) : (
                                        <Button
                                          circular
                                          icon={"bell slash outline"}
                                          basic={true}
                                          color="yellow"
                                          onClick={this.toggleFollowButton}
                                          disabled={otherUserFollowersUpdating}
                                          loading={otherUserFollowersUpdating}
                                        />
                                      )}
                                    </>
                                  )}
                                </Grid.Column>
                              </>
                            ) : (
                              <Grid.Column textAlign="center">
                                <Popup
                                  position="top center"
                                  trigger={
                                    <Button
                                      icon="edit"
                                      primary
                                      basic
                                      circular
                                      as={Link}
                                      to="/edit-profile"
                                    />
                                  }
                                >
                                  Edit Profile
                                </Popup>
                              </Grid.Column>
                            )}
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>

          <ProfilePostsComponent
            componentUserUID={uid}
            componentUser={this.props.user}
          />
        </Grid>
      </Container>
    );
  }
}

const matchStateToProps = ({ auth, profile, posts }) => {
  return {
    currentUser: auth.currentUser,
    currentUserFollowers: auth.currentUserFollowers,
    otherUserFollowers: profile.otherUserFollowers,
    otherUser: profile.otherUser,
    userFollowersLoading: auth.userFollowersLoading,
    otherUserFollowersUpdating: profile.otherUserFollowersUpdating,
    userPosts: posts.userPosts,
    gettingUserPosts: posts.gettingUserPosts
  };
};

const matchDispatchToProps = dispatch => {
  return {
    getOtherUserFollowers: uid => dispatch(getOtherUserFollowers(uid)),
    addFollower: otherUserUID => dispatch(addFollower(otherUserUID))
  };
};

export default connect(
  matchStateToProps,
  matchDispatchToProps
)(ProfileHeadComponent);
