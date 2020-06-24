import React, { Component } from "react";
import {
  Grid,
  Card,
  Button,
  Image,
  Rating,
  Icon,
  Dropdown,
  Form,
  Input,
  Header,
  Transition
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getUserPosts,
  clearPostsListRedux,
  searchUserPostsAlgolia
} from "../../store/Actions/postsActions";
import PostsSpinner from "../../helpers/postsSpinner";
import { Link } from "react-router-dom";

let moment = require("moment");

class ProfilePostsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByState: "date-newest-first",
      openDetails: false,
      openPost: null,
      openPostUser: null,
      keyword: "",
      userPostsList: null
    };
  }

  componentDidMount() {
    if (this.props.userPostsOwner) {
      if (this.props.userPostsOwner === this.props.componentUserUID) {
        this.sortBy(
          "",
          { value: this.state.sortByState },
          this.props.userPostsOriginal
        );
      } else {
        this.props.getUserPosts(this.props.componentUserUID);
        this.setState({ userPostsList: this.props.userPostsOriginal });
      }
    } else if (this.props.componentUserUID === this.props.currentUser.uid) {
      this.props.clearPostsListRedux();
      this.props.getUserPosts();
      this.setState({ userPostsList: this.props.userPostsOriginal });
    } else {
      this.props.clearPostsListRedux();
      this.props.getUserPosts(this.props.componentUserUID);
      this.setState({ userPostsList: this.props.userPostsOriginal });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.componentUserUID !== this.props.componentUserUID ||
      prevProps.currentUser.uid !== this.props.currentUser.uid
    ) {
      this.props.clearPostsListRedux();
      if (this.props.componentUserUID === this.props.currentUser.uid) {
        this.props.getUserPosts();
      } else {
        this.props.getUserPosts(this.props.componentUserUID);
      }
    }

    if (
      this.props.userPostsOriginal &&
      prevProps.userPostsOriginal !== this.props.userPostsOriginal
    ) {
      this.sortBy(
        "",
        { value: this.state.sortByState },
        this.props.userPostsOriginal
      );
    }
  }

  componentWillUnmount() {
    this.props.clearPostsListRedux();
  }

  sortBy = (e, callback, optionalList) => {
    const sortByState = callback.value;
    this.setState({ sortByState });

    let userPosts = null;
    if (optionalList) {
      userPosts = optionalList;
    } else {
      userPosts = this.state.userPostsList;
    }

    if (sortByState === "date-newest-first") {
      userPosts.sort((x, y) =>
        x.createdOn.seconds > y.createdOn.seconds ? -1 : 1
      );
    } else if (sortByState === "date-oldest-first") {
      userPosts.sort((x, y) =>
        x.createdOn.seconds > y.createdOn.seconds ? 1 : -1
      );
    } else if (sortByState === "name-A-Z") {
      userPosts.sort((x, y) => (x.title > y.title ? 1 : -1));
    } else if (sortByState === "name-Z-A") {
      userPosts.sort((x, y) => (x.title > y.title ? -1 : 1));
    } else if (sortByState === "rating-low-high") {
      userPosts.sort((x, y) => (x.rating.average > y.rating.average ? 1 : -1));
    } else if (sortByState === "rating-high-low") {
      userPosts.sort((x, y) => (x.rating.average > y.rating.average ? -1 : 1));
    }
    this.setState({ userPostsList: userPosts });
  };

  showDetailedPost = (e, callback) => {
    const post = this.props.userPostsOriginal.find(
      obj => obj.id === callback.postid
    );

    this.setState({
      openDetails: true,
      openPost: post,
      openPostUser: this.props.componentUser
    });
  };

  closePostDetails = () => {
    this.setState({ openDetails: false, openPostID: null });
  };

  searchPostsAlgolia = (e, callback) => {
    this.setState({ keyword: callback.value });
    this.props.searchUserPostsAlgolia(callback.value);
  };

  render() {
    const { componentUser, gettingUserPosts } = this.props;
    const { sortByState, keyword, userPostsList } = this.state;

    let userPosts = userPostsList;

    const sortingOptions = [
      {
        key: 1,
        icon: "clock outline",
        text: "Date: Newest First",
        value: "date-newest-first"
      },
      {
        key: 2,
        icon: "clock",
        text: "Date: Oldest First",
        value: "date-oldest-first"
      },
      {
        key: 3,
        icon: "sort alphabet down",
        text: "Title: A to Z",
        value: "name-A-Z"
      },
      {
        key: 4,
        icon: "sort alphabet up",
        text: "Title: Z to A",
        value: "name-Z-A"
      },
      {
        key: 5,
        icon: "sort numeric down",
        text: "Rating: Low to High",
        value: "rating-low-high"
      },
      {
        key: 6,
        icon: "sort numeric up",
        text: "Rating: High to Low",
        value: "rating-high-low"
      }
    ];

    if (gettingUserPosts) {
      return <PostsSpinner />;
    } else {
      return (
        <Grid.Row columns="2">
          <Grid.Column computer="4" tablet="16" mobile="16" className="mb-14">
            <Form>
              <Form.Field>
                <Input
                  icon="search"
                  placeholder="Search stories..."
                  value={keyword}
                  onChange={this.searchPostsAlgolia}
                />
              </Form.Field>
              <Form.Field>
                <label>Sort Posts By</label>
                <Dropdown
                  placeholder="Sort by"
                  fluid
                  selection
                  options={sortingOptions}
                  onChange={this.sortBy}
                  value={sortByState}
                />
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column computer="12" tablet="16" mobile="16">
            {keyword.length > 0 && (
              <Header as="h3">
                Showing {userPosts.length} post{userPosts.length !== 1 && "s"}{" "}
                containing <span style={{ color: "#3791D5" }}>{keyword}</span>
              </Header>
            )}
            <Transition.Group as={Grid} duration={200}>
              {userPosts &&
                userPosts.map(post => {
                  const postDate = moment
                    .unix(post.createdOn.seconds)
                    .format("hh:mma DD-MMM-YYYY");
                  return (
                    <Grid.Row key={post.id}>
                      <Grid.Column>
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
                                    src={componentUser.photoURL}
                                    className="full-image"
                                  />
                                </Grid.Column>
                                <Grid.Column
                                  computer="12"
                                  tablet="10"
                                  mobile="7"
                                >
                                  <label
                                    style={{
                                      fontSize: "1.1rem",
                                      fontWeight: "bold"
                                    }}
                                  >
                                    {componentUser.name}
                                  </label>
                                  <label
                                    style={{
                                      fontSize: "0.85rem",
                                      color: "#888888",
                                      display: "block"
                                    }}
                                  >
                                    {postDate}{" "}
                                    {post.edited &&
                                      post.edited === true &&
                                      "| Edited"}
                                  </label>
                                </Grid.Column>
                                <Grid.Column
                                  computer="3"
                                  tablet="4"
                                  mobile="7"
                                  textAlign="right"
                                >
                                  {Math.round(post.rating.average * 10) / 10}{" "}
                                  <Rating
                                    icon="star"
                                    rating={
                                      Math.round(post.rating.average * 10) / 10
                                    }
                                    maxRating={5}
                                    disabled
                                  />
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Card.Content>
                          <Card.Content
                            as={Link}
                            to={"/story/" + post.id}
                            className="black-text"
                          >
                            <Card.Header className="text-break">
                              {post.title}
                            </Card.Header>
                            <p className="fade">{post.rawContent}</p>
                          </Card.Content>
                          <Card.Content>
                            <Grid verticalAlign="middle">
                              <Grid.Row columns={3}>
                                <Grid.Column computer="3" tablet="4" mobile="4">
                                  <Icon name="comment outline" />{" "}
                                  {post.commentCount}
                                </Grid.Column>
                                <Grid.Column computer="3" tablet="4" mobile="4">
                                  <Icon name="thumbs up outline" />{" "}
                                  {post.likeCount}
                                </Grid.Column>
                                <Grid.Column
                                  textAlign="right"
                                  computer="10"
                                  tablet="8"
                                  mobile="8"
                                >
                                  <Button
                                    as={Link}
                                    color="teal"
                                    basic
                                    size="small"
                                    to={"/story/" + post.id}
                                  >
                                    Show More
                                  </Button>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Card.Content>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                  );
                })}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      );
    }
  }
}

const matchStateToProps = ({ auth, posts }) => {
  return {
    gettingUserPosts: posts.gettingUserPosts,
    gettingUserPostsError: posts.gettingUserPostsError,
    userPostsOriginal: posts.userPosts,
    currentUser: auth.currentUser,
    userPostsOwner: posts.userPostsOwner
  };
};

const matchDispatchToProps = dispatch => {
  return {
    getUserPosts: uid => dispatch(getUserPosts(uid)),
    clearPostsListRedux: () => dispatch(clearPostsListRedux()),
    searchUserPostsAlgolia: keyword => dispatch(searchUserPostsAlgolia(keyword))
  };
};

export default connect(
  matchStateToProps,
  matchDispatchToProps
)(ProfilePostsComponent);
