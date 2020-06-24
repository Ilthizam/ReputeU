import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Input,
  Header,
  Button,
  TextArea,
  Form
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import TopicSubNav from "./topicSubNav";
import { connect } from "react-redux";
import VirtueExplorer from "./virtueExplorer";
import { createTopic } from "../../store/Actions/virtueActions";
import { toast } from "react-toastify";
import Helmet from "react-helmet";
class NewTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicName: "",
      selectedVirtues: [],
      selectedVirtuesID: [],
      topicValid: false,
      resetVirtues: true,
      description: ""
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedVirtuesID !== prevState.selectedVirtuesID ||
      this.state.topicName !== prevState.topicName
    ) {
      if (
        this.state.selectedVirtuesID.length > 0 &&
        this.state.topicName.length > 0
      ) {
        this.setState({ topicValid: true });
      } else {
        this.setState({ topicValid: false });
      }
    }

    if (
      this.props.creatingTopic !== prevProps.creatingTopic &&
      this.props.creatingTopic === false &&
      this.props.creatingTopicError === null
    ) {
      toast.success("Topic created successfully!");
      this.setState({
        topicName: "",
        selectedVirtues: [],
        selectedVirtuesID: [],
        topicValid: false,
        resetVirtues: true,
        description: ""
      });
    }
  }

  onChangeTopicName = (e, callback) => {
    this.setState({ topicName: callback.value, resetVirtues: false });
  };

  onChangeDescription = (e, callback) => {
    this.setState({ description: callback.value, resetVirtues: false });
  };

  receiveVirtues = data => {
    this.setState({ selectedVirtues: data.selectedVirtues });
  };

  receiveVirtuesID = data => {
    this.setState({ selectedVirtuesID: data.selectedVirtuesID });
  };

  createTopic = () => {
    if (this.state.topicValid) {
      this.props.createTopic(this.state);
    }
  };

  render() {
    const { topicName, topicValid, resetVirtues, description } = this.state;
    const { creatingTopic } = this.props;
    return (
      <Container>
        <Helmet>
          <title>Create New Topic | ReputeU</title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Create New Topic</Breadcrumb.Section>
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
                  <Card.Header>Create New Review Topic</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Grid.Row className="pb-0">
                      <Grid.Column>
                        <Header as="h5">
                          Review Topic Name (visible to reviewers)
                        </Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pt-7">
                      <Grid.Column>
                        <Input
                          placeholder="Review Topic Name"
                          fluid
                          onChange={this.onChangeTopicName}
                          value={topicName}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pb-0">
                      <Grid.Column>
                        <Header as="h5">
                          Description (visible to reviewers) - Optional
                        </Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pt-7">
                      <Grid.Column>
                        <Form>
                          <TextArea
                            placeholder="Description (optional)"
                            fluid
                            onChange={this.onChangeDescription}
                            value={description}
                          />
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pb-0">
                      <Grid.Column>
                        <Header as="h5">Assign Virtues</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="pt-7">
                      <Grid.Column>
                        <VirtueExplorer
                          selectedVirtuesCallback={this.receiveVirtues}
                          selectedVirtuesIDCallback={this.receiveVirtuesID}
                          reset={resetVirtues}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
                <Card.Content>
                  <Button
                    color="teal"
                    onClick={this.createTopic}
                    disabled={!topicValid || creatingTopic}
                    loading={creatingTopic}
                    floated="right"
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

const mapStateToProps = ({ virtues }) => {
  return {
    creatingTopic: virtues.creatingTopic,
    creatingTopicError: virtues.creatingTopicError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTopic: data => dispatch(createTopic(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTopic);
