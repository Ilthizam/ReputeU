import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Button,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReviewSubNav from "./reviewSubNav";
import { connect } from "react-redux";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import {
  getReviewedTopics,
  getTopicResponses
} from "../../store/Actions/reviewActions";
import { ReviewCompareComponent } from "./reviewResponseComponent";
import Helmet from "react-helmet";
let moment = require("moment");

class CompareReviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResponsesID: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getReviewedTopics();
  }

  componentDidUpdate(prevProps, prevState) {}

  handleShowResponses = (e, callback) => {
    this.props.getTopicResponses(
      callback.topic.id,
      callback.topic.reviewedCommunities,
      callback.topic.communities
    );
    this.setState({ showResponsesID: callback.topic.id });
  };

  handleHideResponses = () => {
    this.setState({ showResponsesID: null });
  };

  render() {
    const {
      reviewedTopics,
      topicResponses,
      gettingTopicResponses,
      gettingReviewedTopics
    } = this.props;
    const { showResponsesID } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Compare Reviews | ReputeU</title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Reviews</Breadcrumb.Section>
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
                  <Card.Header>Compare Reviews</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid verticalAlign="middle" divided="vertically">
                    <Grid.Row>
                      <Grid.Column>
                        <Message info>
                          <Message.Content>
                            If you cannot find the topic you are looking for,
                            please make sure the topic is both self reviewed and
                            at least one response is received.
                          </Message.Content>
                        </Message>
                      </Grid.Column>
                    </Grid.Row>

                    {reviewedTopics &&
                      !gettingReviewedTopics &&
                      reviewedTopics.map(topic => {
                        if (
                          topic.topicDeleted !== true &&
                          topic.selfReviewed === true
                        ) {
                          let lastResponseDate = moment
                            .unix(topic.lastResponseDate.seconds)
                            .format("hh:mma DD-MMM-YYYY");
                          let lastSelfReviewDate = moment
                            .unix(topic.selfReviewDate.seconds)
                            .format("hh:mma DD-MMM-YYYY");
                          return (
                            <Grid.Row key={topic.id}>
                              <Grid.Column>
                                <Grid verticalAlign="middle">
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
                                                fontWeight: "bold"
                                              }}
                                            >
                                              Compare
                                            </label>
                                            <label
                                              style={{
                                                fontSize: "1.1rem",
                                                fontWeight: "bold"
                                              }}
                                            >
                                              <Link to={"/manage-topics"}>
                                                {" "}
                                                {topic.name}{" "}
                                              </Link>
                                            </label>
                                            <label
                                              style={{
                                                fontWeight: "bold"
                                              }}
                                            >
                                              results
                                            </label>
                                          </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="pt-0 pb-0">
                                          <Grid.Column computer={16}>
                                            There are responses from{" "}
                                            <strong>
                                              {topic.reviewedCommunities.length}{" "}
                                              out of {topic.communities.length}
                                            </strong>{" "}
                                            communities
                                          </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="pt-0 pb-0">
                                          <Grid.Column computer={16}>
                                            <label
                                              style={{
                                                fontSize: "0.85rem",
                                                color: "#888888",
                                                display: "block"
                                              }}
                                            >
                                              Last response was received at{" "}
                                              <strong>
                                                {lastResponseDate}
                                              </strong>
                                            </label>
                                          </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="pt-0">
                                          <Grid.Column computer={16}>
                                            <label
                                              style={{
                                                fontSize: "0.85rem",
                                                color: "#888888",
                                                display: "block"
                                              }}
                                            >
                                              You self reviewed this topic at{" "}
                                              <strong>
                                                {lastSelfReviewDate}
                                              </strong>
                                            </label>
                                          </Grid.Column>
                                        </Grid.Row>
                                      </Grid>
                                    </Grid.Column>
                                    <Grid.Column
                                      computer="4"
                                      tablet="16"
                                      mobile="16"
                                      textAlign="right"
                                    >
                                      <Button
                                        floated="right"
                                        color={
                                          showResponsesID === topic.id
                                            ? "red"
                                            : "teal"
                                        }
                                        onClick={
                                          showResponsesID === topic.id
                                            ? this.handleHideResponses
                                            : this.handleShowResponses
                                        }
                                        topic={topic}
                                        basic={showResponsesID === topic.id}
                                      >
                                        {showResponsesID === topic.id
                                          ? "Close"
                                          : "Compare"}
                                      </Button>
                                    </Grid.Column>
                                  </Grid.Row>
                                  {showResponsesID === topic.id &&
                                    gettingTopicResponses && (
                                      <Grid.Row>
                                        <Grid.Column>
                                          <GeneralPlaceholder />
                                        </Grid.Column>
                                      </Grid.Row>
                                    )}
                                  {showResponsesID === topic.id &&
                                    topicResponses &&
                                    gettingTopicResponses === false && (
                                      <Grid.Row>
                                        <Grid.Column>
                                          <ReviewCompareComponent
                                            responses={topicResponses}
                                            selfReviewScore={
                                              topic.selfReviewScore
                                            }
                                          />
                                        </Grid.Column>
                                      </Grid.Row>
                                    )}
                                </Grid>
                              </Grid.Column>
                            </Grid.Row>
                          );
                        } else {
                          return null;
                        }
                      })}
                  </Grid>
                  {gettingReviewedTopics && <GeneralPlaceholder />}
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, reviews }) => {
  return {
    reviewedTopics: reviews.reviewedTopics,
    topicResponses: reviews.topicResponses,
    gettingTopicResponses: reviews.gettingTopicResponses,
    gettingReviewedTopics: reviews.gettingReviewedTopics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getReviewedTopics: () => dispatch(getReviewedTopics()),
    getTopicResponses: (topic, communities, comDetails) =>
      dispatch(getTopicResponses(topic, communities, comDetails))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareReviews);
