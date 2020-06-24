import { Rating, Grid, Dropdown, Form, Button } from "semantic-ui-react";
import React, { Component } from "react";
import { IndividualResponseModal } from "./reviewModal";

export class ReviewResponseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThisCommunity: 0,
      communityOptions: null,
      openIndividualModal: false
    };
  }

  handleCommunityChange = (e, callback) => {
    this.setState({ showThisCommunity: callback.value });
  };

  openIndividualScoresModal = () => {
    this.setState({ openIndividualModal: true });
  };

  handleCloseIndividualModal = () => {
    this.setState({ openIndividualModal: false });
  };

  render() {
    const { responses } = this.props;
    const { showThisCommunity, openIndividualModal } = this.state;

    let communityOptions = [];

    responses.forEach((response, index) => {
      communityOptions.push({
        key: index,
        value: index,
        text: response.name
      });
    });

    return (
      <>
        <Grid className="pt-14">
          <Grid.Row>
            <Grid.Column computer={6} mobile={16} tablet={16}>
              <Form>
                <Form.Field>
                  <label>Select Community</label>
                  <Dropdown
                    search
                    selection
                    options={communityOptions}
                    defaultValue={0}
                    onChange={this.handleCommunityChange}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="pt-0">
            <Grid.Column>
              Below values are the averages of the scores submitted by the
              members of <strong>{responses[showThisCommunity].name}</strong>{" "}
              community. Click the button below to view the scores submitted by
              each member.
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="pt-0">
            <Grid.Column>
              <Button
                color="teal"
                basic
                onClick={this.openIndividualScoresModal}
              >
                View Individual Scores
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid textAlign="center" divided="vertically" className="pt-0 mt-0">
          <Grid.Row columns={3} className="pb-0" style={{ fontWeight: "bold" }}>
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

          {responses &&
            responses[showThisCommunity].results.map(virtue => {
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
        <IndividualResponseModal
          open={openIndividualModal}
          closeCallback={this.handleCloseIndividualModal}
          members={responses[showThisCommunity].members}
        />
      </>
    );
  }
}

export class ReviewCompareComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThisCommunity: 0,
      communityOptions: null,
      openIndividualModal: false
    };
  }

  handleCommunityChange = (e, callback) => {
    this.setState({ showThisCommunity: callback.value });
  };

  openIndividualScoresModal = () => {
    this.setState({ openIndividualModal: true });
  };

  handleCloseIndividualModal = () => {
    this.setState({ openIndividualModal: false });
  };

  render() {
    const { responses, selfReviewScore } = this.props;
    const { showThisCommunity, openIndividualModal } = this.state;

    let communityOptions = [];

    responses.forEach((response, index) => {
      communityOptions.push({
        key: index,
        value: index,
        text: "Self vs " + response.name
      });
    });

    return (
      <>
        <Grid className="pt-14">
          <Grid.Row>
            <Grid.Column computer={6} mobile={16} tablet={16}>
              <Form>
                <Form.Field>
                  <label>Select community to compare</label>
                  <Dropdown
                    search
                    selection
                    options={communityOptions}
                    defaultValue={0}
                    onChange={this.handleCommunityChange}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid
          textAlign="center"
          divided="vertically"
          stackable
          className="pt-0 mt-0"
        >
          <Grid.Row columns={3} className="pb-0" style={{ fontWeight: "bold" }}>
            <Grid.Column>Deficit</Grid.Column>
            <Grid.Column>Mean</Grid.Column>
            <Grid.Column>Excess</Grid.Column>
          </Grid.Row>

          {responses &&
            responses[showThisCommunity].results.map((virtue, i) => {
              let selfVirtue = selfReviewScore[i];
              return (
                <Grid.Row key={virtue.id} columns={3}>
                  <Grid.Column>
                    <Grid centered verticalAlign="middle" className="mb-7">
                      <Grid.Row columns={3}>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Self</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {selfVirtue.Deficit_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                        <Grid.Column computer={2} textAlign="center">
                          vs
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Community</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {virtue.Deficit_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <span className="review-virtue">{virtue.Deficit}</span>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid centered verticalAlign="middle" className="mb-7">
                      <Grid.Row columns={3}>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Self</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {selfVirtue.Mean_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                        <Grid.Column computer={2} textAlign="center">
                          vs
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Community</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {virtue.Mean_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <span className="review-virtue">{virtue.Mean}</span>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid centered verticalAlign="middle" className="mb-7">
                      <Grid.Row columns={3}>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Self</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {selfVirtue.Excess_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                        <Grid.Column computer={2} textAlign="center">
                          vs
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                          <span style={{ display: "block" }}>Community</span>
                          <span style={{ display: "block" }} className="mt-7">
                            <span className="review-score">
                              {virtue.Excess_score}
                            </span>
                            /10
                          </span>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <span className="review-virtue">{virtue.Excess}</span>
                  </Grid.Column>
                </Grid.Row>
              );
            })}
        </Grid>
        <IndividualResponseModal
          open={openIndividualModal}
          closeCallback={this.handleCloseIndividualModal}
          members={responses[showThisCommunity].members}
        />
      </>
    );
  }
}
