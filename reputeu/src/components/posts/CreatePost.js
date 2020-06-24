import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Container,
  Card,
  Breadcrumb,
  Button,
  Input
} from "semantic-ui-react";
import { Helmet } from "react-helmet";
import PostEditor from "./PostEditor";
import { Link } from "react-router-dom";
import { createPost } from "../../store/Actions/postsActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      tags: "",
      content: "",
      rawContent: "",
      reviewers: "",
      contentLength: 0,
      postValid: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.title !== this.state.title ||
      prevState.content !== this.state.content
    ) {
      if (
        this.state.title.replace(/ /g, "").length >= 10 &&
        this.state.contentLength >= 50
      ) {
        this.setState({ postValid: true });
      } else {
        this.setState({ postValid: false });
      }
    }

    if (
      prevProps.postCreateSuccess !== this.props.postCreateSuccess &&
      this.props.postCreateSuccess === true
    ) {
      this.setState({ title: "" });
      this.notify();
    }
  }

  notify = () => {
    toast.success("Post Created Successfully");
  };

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
    if (e.target.value.length > 100) {
      this.setState({ title: e.target.value.slice(0, 100) });
    } else {
      this.setState({ title: e.target.value });
    }
  };

  onPostSubmit = () => {
    if (this.state.postValid === true) {
      this.props.createPost(this.state);
    }
  };

  render() {
    const { postAdding, postCreateSuccess } = this.props;
    const { postValid, title, contentLength } = this.state;
    return (
      <Container>
        <Helmet>
          <title>New Story | ReputeU</title>
          <link rel="canonical" href="https://reputeu.com/create" />
        </Helmet>
        <ToastContainer />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>New Story</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column
              computer={12}
              tablet={16}
              mobile={16}
              className="mb-14"
            >
              <Card fluid>
                <Card.Content>
                  <Card.Header>Write New Story</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Grid.Row className="pb-0">
                      <Grid.Column>
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
                          {title.replace(/ /g, "").length}/100
                        </span>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <PostEditor
                          dataCallback={this.getEditorData}
                          rawDataCallback={this.getEditorRawData}
                          charLengthCallback={this.getEditorLength}
                          reset={postCreateSuccess}
                        />
                        <span
                          style={{
                            float: "right",
                            fontSize: "0.9rem",
                            color: "grey"
                          }}
                        >
                          {contentLength}/10000
                        </span>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
                <Card.Content>
                  <Button
                    floated="right"
                    color="teal"
                    onClick={this.onPostSubmit}
                    loading={postAdding}
                    disabled={postAdding || !postValid}
                  >
                    Create Story
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column computer={4} tablet={16} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Tag Topics</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column></Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createPost: post => dispatch(createPost(post))
  };
};

const mapStateToProps = ({ posts }) => {
  return {
    postAdding: posts.postCreateLoading,
    postCreateSuccess: posts.postCreateSuccess
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);
