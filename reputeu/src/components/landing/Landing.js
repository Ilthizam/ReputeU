import React, { Component } from "react";
import {
  Container,
  Grid,
  Header,
  Card,
  Icon,
  Image,
  Divider,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Landing extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column textAlign="center">
              <Header as="h1">Welcome to ReputeU</Header>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          {currentUser && currentUser.handleChanged === false && (
            <Grid.Row className="pt-0">
              <Grid.Column>
                <Message info>
                  Your current profile link is an auto generated one (
                  {currentUser.handle}). To customize this, go to the{" "}
                  <strong>Profile Link</strong> section in{" "}
                  <Link to={"/edit-profile"}>Edit Profile</Link> page
                </Message>
              </Grid.Column>
            </Grid.Row>
          )}

          <Grid.Row columns={4}>
            <Grid.Column computer={4} tablet={8} className="mb-14">
              <Header as="h2">
                <Icon name="list" /> Topics
              </Header>
              <Card
                fluid
                link
                as={Link}
                to={"/manage-topics"}
                header="Manage Review Topics"
                description="View your topics, view their virtues and delete the topics"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/new-topic"}
                header="Create New Review Topic"
                description="Create new review topics by assigning virtues, providing a title and a description"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/manage-custom-virtues"}
                header="Manage Custom Virtues"
                description="Add your own virtues to the list of the provided virtues"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/add-custom-virtue"}
                header="Add Custom Virtues"
                description="Add custom virtues by providing Excess, Mean and Deficit"
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} className="mb-14">
              <Header as="h2">
                <Icon name="commenting" /> Reviews
              </Header>
              <Card
                fluid
                link
                as={Link}
                to={"/request-reviews"}
                header="Request Reviews"
                description="Send your topics to be reviewed by your communities"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/manage-reviews"}
                header="Reviews Received"
                description="View responses received for your review requests"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/review-invites"}
                header="Invitations To Review"
                description="View the review requests you received and respond to them"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/self-review"}
                header="Self Review"
                description="Add you own review to your topics for reference"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/compare-reviews"}
                header="Compare Reviews"
                description="Compare the review scores received vs your self review scores"
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} className="mb-14">
              <Header as="h2">
                <Icon name="users" /> Community
              </Header>
              <Card
                fluid
                link
                as={Link}
                to={"/manage-community"}
                header="Manage Community"
                description="View created communities, add/remove members, edit or delete communities"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/new-community"}
                header="Create New Community"
                description="Create new community by searching and adding members and providing a name for the community"
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} className="mb-14">
              <Header as="h2" style={{ marginBottom: "13px" }}>
                <Image circular src={currentUser.photoURL} size="medium" />{" "}
                Profile
              </Header>
              <Card
                fluid
                link
                as={Link}
                style={{ marginTop: "13px" }}
                to={"/ru/" + currentUser.handle}
                header="View Profile"
                description="View your own profile, see how many followers you have, how many users you follow and the stories you published"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/edit-profile"}
                header="Edit Profile"
                description="Edit profile details, upload profile picture, change profile link (handle)"
              />
              <Card
                fluid
                link
                as={Link}
                to={"/new-story"}
                header="New Story"
                description="Add new stories to be displayed in your profile"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    currentUser: auth.currentUser
  };
};

export default connect(mapStateToProps, null)(Landing);
