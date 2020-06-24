import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Button,
  Label,
  Form,
  Dropdown,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReviewSubNav from "./reviewSubNav";
import { connect } from "react-redux";
import { getUserTopics } from "../../store/Actions/virtueActions";
import { getUserCommunity } from "../../store/Actions/communityActions";
import { sendRequests } from "../../store/Actions/reviewActions";
import { toast } from "react-toastify";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";

class RequestReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityOptions: null,
      communityOptionsRefined: null,
      topicOptions: null,
      selectedTopic: null,
      selectedTopicName: null,
      selectedCommunities: [],
      currentCommunities: null,
      currentCommunitiesID: null,
      submittableCommunity: null,
      requestValid: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getTopics();
    this.props.getCommunity();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.topics && prevProps.topics !== this.props.topics) {
      let options = [];
      this.props.topics.map(topic => {
        options.push({
          key: topic.id,
          text: topic.name,
          value: topic.id
        });
        return true;
      });
      this.setState({ topicOptions: options });
    }

    if (this.props.community && prevProps.community !== this.props.community) {
      let options = [];
      this.props.community.map(com => {
        options.push({
          key: com.communityID,
          text: com.name,
          value: com.communityID
        });
        return true;
      });
      this.setState({ communityOptions: options });
    }

    if (
      this.state.submittableCommunity !== prevState.submittableCommunity ||
      this.state.selectedTopic !== prevState.selectedTopic
    ) {
      if (
        this.state.selectedTopic &&
        this.state.selectedTopic.length > 0 &&
        this.state.submittableCommunity &&
        this.state.submittableCommunity.length > 0
      ) {
        this.setState({ requestValid: true });
      } else {
        this.setState({ requestValid: false });
      }
    }

    if (
      this.props.sendingRequests === false &&
      prevProps.sendingRequests === true &&
      !this.props.sendingRequestsError
    ) {
      toast.success("Review requests sent!");
      this.setState({
        communityOptions: null,
        communityOptionsRefined: null,
        topicOptions: null,
        selectedTopic: null,
        selectedTopicName: null,
        selectedCommunities: [],
        currentCommunities: null,
        currentCommunitiesID: null,
        submittableCommunity: null,
        requestValid: false
      });
      this.props.getTopics();
      this.props.getCommunity();
    }
  }

  handleTopicChange = (e, callback) => {
    let curCom = [];
    let curComID = [];
    this.props.topics.filter(topic => {
      if (topic.id === callback.value) {
        this.setState({ selectedTopicName: topic.name });
        if (topic.communities) {
          topic.communities.filter(community => {
            curCom.push(community.name);
            curComID.push(community.communityID);
            return true;
          });
        }
        return true;
      }
      return false;
    });

    if (this.props.community) {
      let options = [];
      this.props.community.map(com => {
        if (!curComID.includes(com.communityID)) {
          options.push({
            key: com.communityID,
            text: com.name,
            value: com.communityID
          });
        }
        return true;
      });
      this.setState({ communityOptionsRefined: options });
    }

    this.setState({
      selectedCommunities: [],
      submittableCommunity: null,
      selectedTopic: callback.value,
      currentCommunities: curCom,
      currentCommunitiesID: curComID
    });
  };

  handleCommunityChange = (e, callback) => {
    let submittableCom = [];
    this.props.community.filter(com => {
      if (callback.value.includes(com.communityID))
        submittableCom.push({
          name: com.name,
          communityID: com.communityID
        });
      return true;
    });
    this.setState({
      selectedCommunities: callback.value,
      submittableCommunity: submittableCom
    });
  };

  handleSubmitRequest = () => {
    if (this.state.requestValid === true) {
      this.props.sendRequests(
        this.state.selectedTopic,
        this.state.selectedTopicName,
        this.state.submittableCommunity,
        this.state.selectedCommunities
      );
    }
  };

  render() {
    const { topics, sendingRequests } = this.props;
    const {
      communityOptionsRefined,
      topicOptions,
      selectedTopic,
      currentCommunities,
      communityOptions,
      selectedCommunities,
      requestValid
    } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Request Reviews | ReputeU</title>
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
              <ReviewSubNav paths={this.props.match} />
            </Grid.Column>
            <Grid.Column computer={12} tablet={10} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Send Review Requests</Card.Header>
                </Card.Content>
                <Card.Content>
                  {(!topics || !communityOptions) && <GeneralPlaceholder />}
                  {topics && communityOptions && (
                    <Grid verticalAlign="bottom">
                      <Grid.Row columns={3}>
                        <Grid.Column computer={6} tablet={16} mobile={16}>
                          <Form>
                            <Form.Field
                              control={Dropdown}
                              options={topicOptions}
                              label={{
                                children: "Topic"
                              }}
                              placeholder="Choose a topic"
                              fluid
                              selection
                              value={selectedTopic}
                              onChange={this.handleTopicChange}
                            />
                          </Form>
                        </Grid.Column>
                        <Grid.Column computer={6} tablet={16} mobile={16}>
                          <Form>
                            <Form.Field
                              control={Dropdown}
                              options={communityOptionsRefined}
                              label={{
                                children: "Send To"
                              }}
                              placeholder="Choose communities"
                              fluid
                              multiple
                              selection
                              value={selectedCommunities}
                              onChange={this.handleCommunityChange}
                            />
                          </Form>
                        </Grid.Column>
                        <Grid.Column computer={4} tablet={16} mobile={16}>
                          <Button
                            color="teal"
                            fluid
                            disabled={!requestValid || sendingRequests}
                            onClick={this.handleSubmitRequest}
                            loading={sendingRequests}
                          >
                            Send Requests
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column computer={16}>
                          {currentCommunities && (
                            <>
                              Currently sent to:{" "}
                              {currentCommunities.length > 0
                                ? currentCommunities.map(com => (
                                    <Label key={com}>{com}</Label>
                                  ))
                                : "None"}
                            </>
                          )}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  )}
                </Card.Content>
                <Card.Content>
                  <Message info>
                    <Message.Content>
                      If you cannot see any options in the "Send To" dropdown
                      menu, it's either you have not selected a topic or the
                      selected topic has been sent to all the available
                      communities for review.
                    </Message.Content>
                  </Message>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, virtues, community, reviews }) => {
  return {
    topics: virtues.topics,
    community: community.communities,
    sendingRequests: reviews.sendingRequests,
    sendingRequestsError: reviews.sendingRequestsError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTopics: () => dispatch(getUserTopics()),
    getCommunity: () => dispatch(getUserCommunity()),
    sendRequests: (topicID, topicName, communities, communityID) =>
      dispatch(sendRequests(topicID, topicName, communities, communityID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestReviews);
