import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Input,
  Header,
  Button,
  Label
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import CommunitySubNav from "./communitySubNav";
import { connect } from "react-redux";
import { createCommunity } from "../../store/Actions/communityActions";
import { toast } from "react-toastify";
import UserSearch from "./userSearch";
import Helmet from "react-helmet";

class NewCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityName: "",
      communityMembers: [],
      communityMembersUID: [],
      createValid: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.communityMembersUID !== prevState.communityMembersUID ||
      this.state.communityName !== prevState.communityName
    ) {
      if (
        this.state.communityName.length > 0 &&
        this.state.communityMembersUID.length > 0
      ) {
        this.setState({ createValid: true });
      } else {
        this.setState({ createValid: false });
      }
    }

    if (
      this.props.creatingCommunity !== prevProps.creatingCommunity &&
      this.props.creatingCommunity === false
    ) {
      if (!this.props.creatingCommunityError) {
        toast.success("Community Created Successfully");
        this.setState({
          communityName: "",
          communityMembers: [],
          communityMembersUID: [],
          createValid: false
        });
      }
    }
  }

  onChangeCommunityName = (e, callback) => {
    this.setState({ communityName: callback.value });
  };

  handleCreateCommunity = () => {
    const { communityName, communityMembersUID } = this.state;
    if (communityName.length > 0 && communityMembersUID.length > 0) {
      this.props.createCommunity(this.state);
    } else {
      alert("Give a title and select members");
    }
  };

  handleCommunityMembersChange = members => {
    this.setState({
      communityMembers: members.communityMembers,
      communityMembersUID: members.communityMembersUID
    });
  };

  render() {
    const { communityName, createValid } = this.state;
    const { creatingCommunity, creatingCommunityError } = this.props;
    return (
      <Container>
        <Helmet>
          <title>Create Community | ReputeU</title>
          <link rel="canonical" href={"https://reputeu.com/create-community"} />
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>
                  Create New Community
                </Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer={4} tablet={6} mobile={16} className="mb-14">
              <CommunitySubNav paths={this.props.match} />
            </Grid.Column>
            <Grid.Column computer={12} tablet={10} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Create New Community</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Grid.Row className="pb-0">
                      <Grid.Column>
                        <Header as="h5">Community Name</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pt-7">
                      <Grid.Column>
                        <Input
                          placeholder="Community Name"
                          fluid
                          onChange={this.onChangeCommunityName}
                          value={communityName}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <UserSearch
                    membersCallback={this.handleCommunityMembersChange}
                  />
                </Card.Content>
                <Card.Content>
                  {creatingCommunityError && (
                    <Label pointing="right" color="red">
                      {creatingCommunityError}
                    </Label>
                  )}
                  <Button
                    color="teal"
                    floated="right"
                    onClick={this.handleCreateCommunity}
                    disabled={!createValid || creatingCommunity}
                    loading={creatingCommunity}
                  >
                    Create
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, community }) => {
  return {
    currentUserUID: auth.currentUser.uid,
    creatingCommunity: community.creatingCommunity,
    creatingCommunityError: community.creatingCommunityError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createCommunity: community => dispatch(createCommunity(community))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCommunity);
