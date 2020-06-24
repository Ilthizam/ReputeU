import {
  Button,
  Modal,
  Rating,
  Grid,
  Header,
  Popup,
  List,
  Image,
  Message,
  Form,
  Dropdown,
  Card
} from "semantic-ui-react";
import React, { Component } from "react";
import Elliot from "./images/elliot.jpg";
import { Link } from "react-router-dom";

export class ReviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      virtueScores: null,
      popupOpen: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.virtues && this.props.virtues !== prevProps.virtues) {
      let virtueScorecard = [];
      this.props.virtues.forEach(virtue => {
        virtueScorecard.push({
          ...virtue,
          Deficit_score: 0,
          Excess_score: 0,
          Mean_score: 0,
          modified: [0, 0, 0]
        });
      });
      this.setState({
        virtueScores: virtueScorecard
      });
    }
  }

  handleRateChange = (e, callback) => {
    this.changeScorecard(
      callback.virtueid,
      callback.virtuetype,
      callback.rating
    );
  };

  changeScorecard = (virtueID, virtueType, score) => {
    let newScorecard = [];
    this.state.virtueScores.forEach(virtue => {
      if (virtue.id === virtueID) {
        switch (virtueType) {
          case "deficit":
            newScorecard.push({
              ...virtue,
              Deficit_score: score,
              modified: [1, virtue.modified[1], virtue.modified[2]]
            });
            break;

          case "mean":
            newScorecard.push({
              ...virtue,
              Mean_score: score,
              modified: [virtue.modified[0], 1, virtue.modified[2]]
            });
            break;

          case "excess":
            newScorecard.push({
              ...virtue,
              Excess_score: score,
              modified: [virtue.modified[0], virtue.modified[1], 1]
            });
            break;

          default:
            break;
        }
      } else {
        newScorecard.push(virtue);
      }
      return true;
    });
    this.setState({ virtueScores: newScorecard });
  };

  handlePopupOpen = () => {
    this.setState({ popupOpen: true });
  };

  handlePopupClose = () => {
    this.setState({ popupOpen: false });
  };

  submitReview = (e, callback) => {
    this.handlePopupClose();
    this.props.reviewScoreCallback(this.state.virtueScores, callback.anonymous);
  };

  render() {
    const {
      reviewModalOpen,
      reviewModalCloseCallback,
      topic,
      virtues,
      currentUser,
      submittingReview,
      selfReview
    } = this.props;
    const { popupOpen } = this.state;

    return (
      <Modal open={reviewModalOpen}>
        <Modal.Header>
          You are reviewing topic: {topic && (topic.topicName || topic.name)}
        </Modal.Header>
        {topic && topic.topicDescription && topic.topicDescription !== "" && (
          <Modal.Content className="pb-0">
            <b>Description provided by the requester</b>
            <br />
            <i>{topic.topicDescription}</i>
          </Modal.Content>
        )}
        <Modal.Content scrolling>
          {topic && (topic.reviewed === true || topic.selfReviewed === true) && (
            <Message warning>
              <Message.Content>
                Please be advised that reviewing again will replace your
                previous review entirely.
              </Message.Content>
            </Message>
          )}
          <Header as="h4">
            Rate the following virtues regarding the above topic.
          </Header>
          <Grid textAlign="center" className="mt-14" divided="vertically">
            <Grid.Row
              columns={3}
              className="pb-0"
              style={{ fontWeight: "bold" }}
            >
              <Grid.Column computer={6} mobile={16}>
                Deficit
              </Grid.Column>
              <Grid.Column computer={4} mobile={16}>
                Mean
              </Grid.Column>
              <Grid.Column computer={6} mobile={16}>
                Excess
              </Grid.Column>
            </Grid.Row>

            {virtues &&
              virtues.map(virtue => {
                return (
                  <Grid.Row key={virtue.id} columns={3}>
                    <Grid.Column computer={6} mobile={16}>
                      {virtue.Deficit}
                      <br />
                      <Rating
                        icon="star"
                        defaultRating={0}
                        maxRating={10}
                        virtuetype="deficit"
                        virtueid={virtue.id}
                        onRate={this.handleRateChange}
                        clearable
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={4}>
                      {virtue.Mean}
                      <br />
                      <Rating
                        icon="star"
                        defaultRating={0}
                        maxRating={10}
                        virtuetype="mean"
                        virtueid={virtue.id}
                        onRate={this.handleRateChange}
                        clearable
                      />
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={6}>
                      {virtue.Excess}
                      <br />
                      <Rating
                        icon="star"
                        defaultRating={0}
                        maxRating={10}
                        virtuetype="excess"
                        virtueid={virtue.id}
                        onRate={this.handleRateChange}
                        clearable
                      />
                    </Grid.Column>
                  </Grid.Row>
                );
              })}
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={reviewModalCloseCallback}>
            Cancel
          </Button>
          <Popup
            open={popupOpen}
            onClose={this.handlePopupClose}
            onOpen={this.handlePopupOpen}
            position="top right"
            content={
              <List selection verticalAlign="middle">
                <List.Item onClick={this.submitReview} anonymous={"false"}>
                  <Image avatar src={currentUser.photoURL} />
                  <List.Content>
                    <List.Header>{currentUser.name}</List.Header>
                  </List.Content>
                </List.Item>
                {selfReview !== true && (
                  <List.Item onClick={this.submitReview} anonymous={"true"}>
                    <Image avatar src={Elliot} />
                    <List.Content>
                      <List.Header>Anonymous</List.Header>
                    </List.Content>
                  </List.Item>
                )}
              </List>
            }
            on="click"
            pinned
            trigger={
              <Button
                color="teal"
                icon="dropdown"
                labelPosition="right"
                content="Submit Review As"
                loading={submittingReview}
                disabled={submittingReview}
              />
            }
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export class IndividualResponseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThisMemberScores: 0
    };
  }

  handleMemberChange = (e, callback) => {
    this.setState({ showThisMemberScores: callback.value });
  };

  render() {
    const { closeCallback, open, members } = this.props;
    const { showThisMemberScores } = this.state;

    let memberOptions = [];

    members.forEach((member, index) => {
      memberOptions.push({
        key: index,
        value: index,
        text: member.anonymous ? "Anonymous" : member.memberName,
        image: {
          avatar: true,
          src: member.anonymous ? Elliot : member.memberPhotoURL
        }
      });
    });

    return (
      <Modal open={open}>
        <Modal.Header>Individual Scores</Modal.Header>
        <Modal.Content scrolling>
          <Grid>
            <Grid.Row>
              <Grid.Column computer={6} mobile={16} tablet={16}>
                <Form>
                  <Form.Field>
                    <label>Select User</label>
                    <Dropdown
                      selection
                      options={memberOptions}
                      defaultValue={0}
                      onChange={this.handleMemberChange}
                    />
                  </Form.Field>
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Grid>
                      <Grid.Row columns="2">
                        <Grid.Column
                          computer="1"
                          tablet="2"
                          mobile="2"
                          className="pr-0"
                        >
                          <Image
                            circular
                            src={
                              members[showThisMemberScores].anonymous
                                ? Elliot
                                : members[showThisMemberScores].memberPhotoURL
                            }
                            className="full-image"
                          />
                        </Grid.Column>
                        <Grid.Column computer="15" tablet="14" mobile="4">
                          <label
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold"
                            }}
                          >
                            <Link
                              to={
                                members[showThisMemberScores].anonymous
                                  ? "#"
                                  : "/ru/" +
                                    members[showThisMemberScores].memberHandle
                              }
                            >
                              {members[showThisMemberScores].anonymous
                                ? "Anonymous"
                                : members[showThisMemberScores].memberName}
                            </Link>
                          </label>
                          <label
                            style={{
                              fontSize: "0.85rem",
                              color: "#888888",
                              display: "block"
                            }}
                          >
                            {members[showThisMemberScores].anonymous
                              ? "This user has reviewed anonymously"
                              : members[showThisMemberScores].memberHandle}
                          </label>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Card.Content>
                  <Card.Content>
                    <Grid
                      textAlign="center"
                      className="mt-0"
                      divided="vertically"
                    >
                      <Grid.Row
                        columns={3}
                        className="pb-0 pt-0"
                        style={{ fontWeight: "bold" }}
                      >
                        <Grid.Column computer={6} mobile={16}>
                          Deficit
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={16}>
                          Mean
                        </Grid.Column>
                        <Grid.Column computer={6} mobile={16}>
                          Excess
                        </Grid.Column>
                      </Grid.Row>

                      {members &&
                        members[showThisMemberScores].scores.map(virtue => {
                          return (
                            <Grid.Row key={virtue.id} columns={3}>
                              <Grid.Column computer={6} mobile={16}>
                                {virtue.Deficit}
                                <br />
                                <Rating
                                  icon="star"
                                  rating={virtue.Deficit_score}
                                  maxRating={10}
                                  disabled
                                />
                                <br />({virtue.Deficit_score})
                              </Grid.Column>
                              <Grid.Column mobile={16} computer={4}>
                                {virtue.Mean}
                                <br />
                                <Rating
                                  icon="star"
                                  rating={virtue.Mean_score}
                                  maxRating={10}
                                  disabled
                                />
                                <br />({virtue.Mean_score})
                              </Grid.Column>
                              <Grid.Column mobile={16} computer={6}>
                                {virtue.Excess}
                                <br />
                                <Rating
                                  icon="star"
                                  rating={virtue.Excess_score}
                                  maxRating={10}
                                  disabled
                                />
                                <br />({virtue.Excess_score})
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
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={closeCallback}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export class SingleResponseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { closeCallback, open, topic } = this.props;

    return (
      <Modal open={open}>
        <Modal.Header>
          Review scores for topic: {topic && topic.name}
        </Modal.Header>
        <Modal.Content scrolling>
          <Grid textAlign="center" className="mt-0" divided="vertically">
            <Grid.Row
              columns={3}
              className="pb-0 pt-0"
              style={{ fontWeight: "bold" }}
            >
              <Grid.Column computer={6} mobile={16}>
                Deficit
              </Grid.Column>
              <Grid.Column computer={4} mobile={16}>
                Mean
              </Grid.Column>
              <Grid.Column computer={6} mobile={16}>
                Excess
              </Grid.Column>
            </Grid.Row>

            {topic &&
              topic.selfReviewScore.map(virtue => {
                return (
                  <Grid.Row key={virtue.id} columns={3}>
                    <Grid.Column computer={6} mobile={16}>
                      {virtue.Deficit}
                      <br />
                      <Rating
                        icon="star"
                        rating={virtue.Deficit_score}
                        maxRating={10}
                        disabled
                      />
                      <br />({virtue.Deficit_score})
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={4}>
                      {virtue.Mean}
                      <br />
                      <Rating
                        icon="star"
                        rating={virtue.Mean_score}
                        maxRating={10}
                        disabled
                      />
                      <br />({virtue.Mean_score})
                    </Grid.Column>
                    <Grid.Column mobile={16} computer={6}>
                      {virtue.Excess}
                      <br />
                      <Rating
                        icon="star"
                        rating={virtue.Excess_score}
                        maxRating={10}
                        disabled
                      />
                      <br />({virtue.Excess_score})
                    </Grid.Column>
                  </Grid.Row>
                );
              })}
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={closeCallback}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
