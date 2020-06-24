import React, { Component } from "react";
import { Container, Grid, Breadcrumb, Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReviewSubNav from "./reviewSubNav";
import { connect } from "react-redux";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import {
  getReviewedTopics,
  getTopicResponses
} from "../../store/Actions/reviewActions";
import { ReviewResponseComponent } from "./reviewResponseComponent";
import Helmet from "react-helmet";
let moment = require("moment");

class Reviews extends Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.match.params !== prevProps.match.params &&
      this.props.match.params.topic
    ) {
      this.props.getReviewedTopics();
    }
  }

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
          <title>Reviews Received | ReputeU</title>
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
                  <Card.Header>Reviews Received</Card.Header>
                </Card.Content>
                <Card.Content>
                  {gettingReviewedTopics && <GeneralPlaceholder />}
                  <Grid verticalAlign="middle" divided="vertically">
                    {reviewedTopics &&
                      !gettingReviewedTopics &&
                      reviewedTopics.map(topic => {
                        if (topic.topicDeleted !== true) {
                          let lastResponseDate = moment
                            .unix(topic.lastResponseDate.seconds)
                            .format("hh:mma DD-MMM-YYYY");
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
                                      <Grid verticalAlign="middle">
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
                                              has received responses
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
                                        <Grid.Row className="pt-0">
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
                                      </Grid>
                                    </Grid.Column>
                                    <Grid.Column
                                      computer="4"
                                      tablet="16"
                                      mobile="16"
                                      textAlign="right"
                                      verticalAlign="middle"
                                    >
                                      <Button
                                        floated="right"
                                        color="teal"
                                        onClick={
                                          showResponsesID === topic.id
                                            ? this.handleHideResponses
                                            : this.handleShowResponses
                                        }
                                        topic={topic}
                                        basic={showResponsesID === topic.id}
                                      >
                                        {showResponsesID === topic.id
                                          ? "Hide Responses"
                                          : "Show Responses"}
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
                                          <ReviewResponseComponent
                                            responses={topicResponses}
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

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
