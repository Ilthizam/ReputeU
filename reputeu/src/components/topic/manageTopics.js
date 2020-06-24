import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Accordion,
  Icon,
  Button,
  Table
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import TopicSubNav from "./topicSubNav";
import { connect } from "react-redux";
import {
  getUserTopics,
  deleteUserTopic
} from "../../store/Actions/virtueActions";
import { DeleteTopicConfirmModal } from "./topicModals";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";

class ManageTopics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      deletePendingTopic: null,
      deleteTopicConfirmModalOpen: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.topics && this.props.topics.length === 0) {
      this.props.getUserTopics();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.deletingTopic === false &&
      prevProps.deletingTopic === true &&
      this.props.deletingTopicError === null
    ) {
      this.setState({
        deletePendingTopic: null,
        deleteTopicConfirmModalOpen: false
      });
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;
    this.setState({ activeIndex: newIndex });
  };

  getTopicDeleteConfirmation = (e, callback) => {
    this.setState({
      deletePendingTopic: callback.topic,
      deleteTopicConfirmModalOpen: true
    });
  };

  handleDeleteTopic = () => {
    if (this.props.deletingTopic === false) {
      this.props.deleteUserTopic(this.state.deletePendingTopic.id);
    }
  };

  handleDeleteTopicCancel = () => {
    this.setState({
      deletePendingTopic: null,
      deleteTopicConfirmModalOpen: false
    });
  };

  render() {
    const { deletingTopic, gettingTopics, topics } = this.props;
    const {
      activeIndex,
      deletePendingTopic,
      deleteTopicConfirmModalOpen
    } = this.state;

    return (
      <Container>
        <Helmet>
          <title>Manage Review Topics | ReputeU</title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Manage Topics</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer={4} tablet={6} mobile={16} className="mb-14">
              <TopicSubNav paths={this.props.match} />
            </Grid.Column>
            <Grid.Column computer={12} tablet={10} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Manage Topics</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid divided="vertically">
                    {gettingTopics === true ? (
                      <Grid.Row>
                        <Grid.Column>
                          <GeneralPlaceholder />
                        </Grid.Column>
                      </Grid.Row>
                    ) : (
                      <>
                        {topics &&
                          topics.map(topic => {
                            return (
                              <Grid.Row
                                columns={1}
                                key={topic.id}
                                verticalAlign={
                                  activeIndex === topic.id ? "top" : "middle"
                                }
                              >
                                <Grid.Column>
                                  <Grid>
                                    <Grid.Row columns={3}>
                                      <Grid.Column
                                        computer={4}
                                        tablet={5}
                                        mobile={16}
                                        className="mb-0 mt-0"
                                      >
                                        <label
                                          style={{
                                            fontSize: "1.1rem",
                                            fontWeight: "bold"
                                          }}
                                        >
                                          {topic.name}
                                        </label>
                                      </Grid.Column>
                                      <Grid.Column
                                        computer={9}
                                        tablet={7}
                                        mobile={16}
                                        className="mb-0 mt-0"
                                      >
                                        <Accordion>
                                          <Accordion.Title
                                            active={activeIndex === topic.id}
                                            index={topic.id}
                                            onClick={this.handleClick}
                                            className="noselect"
                                          >
                                            <Icon name="dropdown" />
                                            {topic.virtues.length} virtue
                                            {topic.virtues.length !== 1 &&
                                              "s"}{" "}
                                            {activeIndex !== topic.id && (
                                              <label className="grey-label">
                                                (View all)
                                              </label>
                                            )}
                                          </Accordion.Title>
                                          <Accordion.Content
                                            active={activeIndex === topic.id}
                                          >
                                            <Table
                                              textAlign="center"
                                              verticalAlign="middle"
                                              celled
                                            >
                                              <Table.Header>
                                                <Table.Row>
                                                  <Table.HeaderCell>
                                                    Deficit (Vice)
                                                  </Table.HeaderCell>
                                                  <Table.HeaderCell>
                                                    Mean (Virtue)
                                                  </Table.HeaderCell>
                                                  <Table.HeaderCell>
                                                    Excess (Vice)
                                                  </Table.HeaderCell>
                                                </Table.Row>
                                              </Table.Header>
                                              <Table.Body>
                                                {topic.virtues.map(virtue => {
                                                  return (
                                                    <Table.Row key={virtue.id}>
                                                      <Table.Cell>
                                                        {virtue.Deficit}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {virtue.Mean}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {virtue.Excess}
                                                      </Table.Cell>
                                                    </Table.Row>
                                                  );
                                                })}
                                              </Table.Body>
                                            </Table>
                                          </Accordion.Content>
                                        </Accordion>
                                      </Grid.Column>
                                      <Grid.Column
                                        computer={3}
                                        tablet={4}
                                        mobile={16}
                                        className="mb-0 mt-0"
                                      >
                                        <Button
                                          color="red"
                                          topic={topic}
                                          basic
                                          onClick={
                                            this.getTopicDeleteConfirmation
                                          }
                                          disabled={deletingTopic}
                                          icon
                                          labelPosition="left"
                                          floated="right"
                                        >
                                          <Icon name="trash alternate outline" />
                                          Delete
                                        </Button>
                                      </Grid.Column>
                                    </Grid.Row>
                                    {topic.description &&
                                      topic.description !== "" && (
                                        <Grid.Row className="pt-0 pb-0">
                                          <Grid.Column
                                            computer={4}
                                            tablet={5}
                                            mobile={16}
                                          ></Grid.Column>
                                          <Grid.Column
                                            computer={12}
                                            tablet={11}
                                            mobile={16}
                                          >
                                            {topic.description}
                                          </Grid.Column>
                                        </Grid.Row>
                                      )}
                                  </Grid>
                                </Grid.Column>
                              </Grid.Row>
                            );
                          })}
                      </>
                    )}
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <DeleteTopicConfirmModal
          deleteTopicModalOpen={deleteTopicConfirmModalOpen}
          deletePendingTopic={deletePendingTopic}
          cancelDeleteTopic={this.handleDeleteTopicCancel}
          handleDeleteTopic={this.handleDeleteTopic}
          deletingTopic={deletingTopic}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ virtues }) => {
  return {
    deletingTopic: virtues.deletingTopic,
    deletingTopicError: virtues.deletingTopicError,
    gettingTopics: virtues.gettingTopics,
    topics: virtues.topics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserTopics: () => dispatch(getUserTopics()),
    deleteUserTopic: postID => dispatch(deleteUserTopic(postID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTopics);
