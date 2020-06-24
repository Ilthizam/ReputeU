import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Form,
  Dropdown,
  Button
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReviewSubNav from "./reviewSubNav";
import { connect } from "react-redux";
import { getUserTopics } from "../../store/Actions/virtueActions";
import { submitSelfReviewScore } from "../../store/Actions/reviewActions";
import { toast } from "react-toastify";
import { ReviewModal, SingleResponseModal } from "./reviewModal";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";
let moment = require("moment");

class SelfReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTopic: null,
      topicOptions: null,
      openReviewModal: false,
      singleReviewModalOpen: false,
      viewSelfReviewedTopic: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getTopics();
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

    if (
      this.props.submittingSelfReview === false &&
      prevProps.submittingSelfReview === true &&
      this.props.submittingSelfReviewError === null
    ) {
      toast.success("Review successfully submitted!");
      this.setState({
        selectedTopic: null,
        openReviewModal: false
      });
    }
  }

  closeReviewModal = () => {
    this.setState({
      selectedTopic: null,
      openReviewModal: false
    });
  };

  handleTopicChange = (e, callback) => {
    this.props.topics.filter(topic => {
      if (topic.id === callback.value) {
        this.setState({ selectedTopic: topic, openReviewModal: true });
        return true;
      }
      return false;
    });
  };

  getReviewScore = (score, anonymous) => {
    this.props.submitSelfReviewScore(
      this.state.selectedTopic,
      score,
      anonymous
    );
  };

  showSelfReviewModal = (e, callback) => {
    this.setState({
      viewSelfReviewedTopic: callback.topic,
      singleReviewModalOpen: true
    });
  };

  handleSingleResponseModalClose = () => {
    this.setState({
      viewSelfReviewedTopic: null,
      singleReviewModalOpen: false
    });
  };

  render() {
    const {
      currentUser,
      submittingSelfReview,
      topics,
      gettingTopics
    } = this.props;
    const {
      topicOptions,
      selectedTopic,
      openReviewModal,
      viewSelfReviewedTopic,
      singleReviewModalOpen
    } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Self Review | ReputeU</title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Self Review</Breadcrumb.Section>
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
                  <Card.Header>Add Self Review</Card.Header>
                </Card.Content>
                <Card.Content>
                  {!topicOptions && <GeneralPlaceholder />}
                  {topicOptions && (
                    <Grid verticalAlign="bottom">
                      <Grid.Row columns={3}>
                        <Grid.Column computer={6} tablet={16} mobile={16}>
                          <Form>
                            <Form.Field
                              control={Dropdown}
                              options={topicOptions}
                              label={{
                                children: "Select a topic to Self Review"
                              }}
                              placeholder="Choose a topic"
                              fluid
                              selection
                              value={selectedTopic && selectedTopic.id}
                              onChange={this.handleTopicChange}
                            />
                          </Form>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  )}
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Self Reviewed Topics</Card.Header>
                </Card.Content>
                <Card.Content>
                  {gettingTopics && <GeneralPlaceholder />}
                  <Grid verticalAlign="middle" divided="vertically">
                    {topics &&
                      topicOptions &&
                      topics.map(topic => {
                        if (topic.selfReviewed === true) {
                          let lastResponseDate = null;
                          if (topic.selfReviewDate.seconds) {
                            lastResponseDate =
                              " at " +
                              moment
                                .unix(topic.selfReviewDate.seconds)
                                .format("hh:mma DD-MMM-YYYY");
                          } else {
                            lastResponseDate = " a liitle while ago";
                          }

                          return (
                            <Grid.Row key={topic.id}>
                              <Grid.Column>
                                <Grid>
                                  <Grid.Row columns="2" className="pb-0 pt-0">
                                    <Grid.Column
                                      computer="12"
                                      tablet="16"
                                      mobile="16"
                                    >
                                      <Grid>
                                        <Grid.Row className="pb-0">
                                          <Grid.Column computer={16}>
                                            <label
                                              style={{
                                                fontSize: "1.1rem",
                                                fontWeight: "bold"
                                              }}
                                            >
                                              <Link to={"/manage-topics"}>
                                                {topic.name}{" "}
                                              </Link>
                                            </label>
                                            <label
                                              style={{
                                                fontWeight: "bold"
                                              }}
                                            >
                                              was self reviewed
                                            </label>
                                          </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="pt-0" columns={2}>
                                          <Grid.Column computer={13}>
                                            <label
                                              style={{
                                                fontSize: "0.85rem",
                                                color: "#888888",
                                                display: "block"
                                              }}
                                            >
                                              You self reviewed this topic
                                              <strong>
                                                {lastResponseDate}
                                              </strong>
                                            </label>
                                          </Grid.Column>
                                        </Grid.Row>
                                      </Grid>
                                    </Grid.Column>
                                    <Grid.Column computer={4}>
                                      <Button
                                        color="teal"
                                        floated="right"
                                        topic={topic}
                                        onClick={this.showSelfReviewModal}
                                      >
                                        View
                                      </Button>
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              </Grid.Column>
                            </Grid.Row>
                          );
                        } else {
                          return null;
                        }
                      })}
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ReviewModal
          reviewModalOpen={openReviewModal}
          reviewModalCloseCallback={this.closeReviewModal}
          virtues={selectedTopic && selectedTopic.virtues}
          topic={selectedTopic}
          currentUser={currentUser}
          reviewScoreCallback={this.getReviewScore}
          submittingReview={submittingSelfReview}
          selfReview={true}
        />
        <SingleResponseModal
          open={singleReviewModalOpen}
          closeCallback={this.handleSingleResponseModalClose}
          topic={viewSelfReviewedTopic}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, virtues, community, reviews }) => {
  return {
    currentUser: auth.currentUser,
    topics: virtues.topics,
    gettingTopics: virtues.gettingTopics,
    submittingSelfReview: reviews.submittingSelfReview,
    submittingSelfReviewError: reviews.submittingSelfReviewError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTopics: () => dispatch(getUserTopics()),
    submitSelfReviewScore: (topic, score, anonymous) =>
      dispatch(submitSelfReviewScore(topic, score, anonymous))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelfReview);
