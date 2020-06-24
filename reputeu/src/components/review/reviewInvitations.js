import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Image,
  Button
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReviewSubNav from "./reviewSubNav";
import { connect } from "react-redux";
import {
  getInvitedTopics,
  submitReviewScore
} from "../../store/Actions/reviewActions";
import { toast } from "react-toastify";
import { ReviewModal } from "./reviewModal";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";
let moment = require("moment");

class ReviewInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewingTopic: null,
      reviewingVirtues: null,
      openReviewModal: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getInvitedTopics();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.submittingReview === false &&
      prevProps.submittingReview === true &&
      this.props.submittingReviewError === null
    ) {
      toast.success("Review successfully submitted!");
      this.setState({
        reviewingTopic: null,
        reviewingVirtues: null,
        openReviewModal: false
      });
    }

    if (
      this.props.match.params !== prevProps.match.params &&
      this.props.match.params.topic
    ) {
      this.props.getInvitedTopics();
    }
  }

  openReviewModal = (e, callback) => {
    this.setState({
      reviewingVirtues: callback.topic.topicVirtues,
      reviewingTopic: callback.topic,
      openReviewModal: true
    });
  };

  closeReviewModal = () => {
    this.setState({
      reviewingTopic: null,
      reviewingVirtues: null,
      openReviewModal: false
    });
  };

  getReviewScore = (score, anonymous) => {
    this.props.submitReviewScore(this.state.reviewingTopic, score, anonymous);
  };

  render() {
    const {
      gettingInvitedTopics,
      invitedTopics,
      currentUser,
      submittingReview
    } = this.props;
    const { openReviewModal, reviewingTopic, reviewingVirtues } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Invitations To Review | ReputeU</title>
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
                  Invitations To Review
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
                  <Card.Header>Invitations To Review</Card.Header>
                </Card.Content>
                <Card.Content>
                  {gettingInvitedTopics && <GeneralPlaceholder />}
                  <Grid verticalAlign="middle" divided="vertically">
                    {!gettingInvitedTopics &&
                      invitedTopics &&
                      invitedTopics.map(topic => {
                        let invitedDate = moment
                          .unix(topic.dateInvited.seconds)
                          .format("hh:mma DD-MMM-YYYY");
                        let reviewedDate = null;
                        if (topic.dateReviewed) {
                          reviewedDate = moment
                            .unix(topic.dateReviewed.seconds)
                            .format("hh:mma DD-MMM-YYYY");
                        }

                        return (
                          <Grid.Row
                            columns="3"
                            key={topic.communityID + topic.topicID}
                          >
                            <Grid.Column
                              computer="1"
                              tablet="2"
                              mobile="3"
                              className="pr-0"
                            >
                              <Image
                                circular
                                src={topic.ownerPhotoURL}
                                className="full-image"
                              />
                            </Grid.Column>
                            <Grid.Column computer="11" tablet="14" mobile="13">
                              <Grid>
                                <Grid.Row className="pb-0">
                                  <Grid.Column computer={16}>
                                    <label
                                      style={{
                                        fontSize: "1.1rem",
                                        fontWeight: "bold"
                                      }}
                                    >
                                      <Link to={"/ru/" + topic.ownerHandle}>
                                        {topic.ownerName}
                                      </Link>{" "}
                                      invited you to review: {topic.topicName}
                                    </label>
                                    <label
                                      style={{
                                        fontSize: "0.85rem",
                                        color: "#888888",
                                        display: "block"
                                      }}
                                    >
                                      {invitedDate}
                                    </label>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className="pt-0">
                                  <Grid.Column computer={16}>
                                    You were added to the community{" "}
                                    <strong>{topic.communityName}</strong> which
                                    has{" "}
                                    <strong>
                                      {topic.communityMembersCount} member
                                      {topic.communityMembersCount > 1 && "s"}
                                    </strong>
                                    .<br />
                                    {topic.reviewed && (
                                      <>
                                        You reviewed this{" "}
                                        <strong>
                                          {topic.anonymous
                                            ? " anonymously "
                                            : " as yourself "}
                                        </strong>
                                        at {reviewedDate}
                                      </>
                                    )}
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
                              {topic.reviewed ? (
                                <Button
                                  floated="right"
                                  color="teal"
                                  topic={topic}
                                  onClick={this.openReviewModal}
                                  basic
                                >
                                  Review Again
                                </Button>
                              ) : (
                                <Button
                                  floated="right"
                                  color="teal"
                                  topic={topic}
                                  onClick={this.openReviewModal}
                                >
                                  Add Review
                                </Button>
                              )}
                            </Grid.Column>
                          </Grid.Row>
                        );
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
          virtues={reviewingVirtues}
          topic={reviewingTopic}
          currentUser={currentUser}
          reviewScoreCallback={this.getReviewScore}
          submittingReview={submittingReview}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ reviews, auth }) => {
  return {
    currentUser: auth.currentUser,
    invitedTopics: reviews.invitedTopics,
    gettingInvitedTopics: reviews.gettingInvitedTopics,
    gettingInvitedTopicsError: reviews.gettingInvitedTopicsError,
    submittingReview: reviews.submittingReview,
    submittingReviewError: reviews.submittingReviewError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getInvitedTopics: () => dispatch(getInvitedTopics()),
    submitReviewScore: (topic, score, anonymous) =>
      dispatch(submitReviewScore(topic, score, anonymous))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewInvitations);
