import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Button,
  Form,
  Icon,
  Table
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import TopicSubNav from "./topicSubNav";
import { connect } from "react-redux";
import { addCustomVirtue } from "../../store/Actions/virtueActions";
import { toast } from "react-toastify";
import Helmet from "react-helmet";

class AddCustomVirtue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customVirtues: [],
      excess: "",
      mean: "",
      deficit: "",
      customVirtueValid: false,
      saveValid: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.mean !== this.state.mean ||
      prevState.excess !== this.state.excess ||
      prevState.deficit !== this.state.deficit
    ) {
      if (
        this.state.excess.trim().length > 0 &&
        this.state.mean.trim().length > 0 &&
        this.state.deficit.trim().length > 0
      ) {
        this.setState({ customVirtueValid: true });
      } else {
        this.setState({ customVirtueValid: false });
      }
    }

    if (this.state.customVirtues !== prevState.customVirtues) {
      if (this.state.customVirtues.length > 0) {
        this.setState({ saveValid: true });
      } else {
        this.setState({ saveValid: false });
      }
    }

    if (
      prevProps.addingCustomVirtue !== this.props.addingCustomVirtue &&
      this.props.addingCustomVirtue === false &&
      this.props.addingCustomVirtueError === null
    ) {
      toast.success("Virtues added successfully");
      this.setState({
        customVirtues: [],
        excess: "",
        mean: "",
        deficit: "",
        customVirtueValid: false,
        saveValid: false
      });
    }
  }

  handleOnChange = (e, callback) => {
    this.setState({ [callback.id]: callback.value });
  };

  addCustomVirtue = () => {
    if (this.state.customVirtueValid && this.state.customVirtues.length < 401) {
      this.setState({
        customVirtues: [
          ...this.state.customVirtues,
          {
            Mean: this.state.mean,
            Excess: this.state.excess,
            Deficit: this.state.deficit,
            id: Math.floor(Math.random() * (1000000000 - 20) + 20).toString()
          }
        ],
        excess: "",
        mean: "",
        deficit: "",
        customVirtueValid: false
      });
    } else {
      if (this.state.customVirtues.length >= 400) {
        toast.error("You can only add upto 400 custom virtues at one time");
      } else {
        toast.error("Please fill all the three fields");
      }
    }
  };

  removeVirtue = (e, callback) => {
    this.setState({
      customVirtues: this.state.customVirtues.filter(virtue => {
        return virtue.id !== callback.customvirtue.id;
      })
    });
  };

  commitCustomVirtues = () => {
    if (this.state.customVirtues.length > 0) {
      this.props.addCustomVirtue(this.state.customVirtues);
    } else {
      alert("No virtues entered");
    }
  };

  render() {
    const {
      customVirtues,
      customVirtueValid,
      excess,
      mean,
      deficit,
      saveValid
    } = this.state;
    const { addingCustomVirtue } = this.props;
    return (
      <Container>
        <Helmet>
          <title>Add Custom Virtue | ReputeU</title>
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
                  Add Custom Virtue
                </Breadcrumb.Section>
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
                  <Card.Header>Add Custom Virtues</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid verticalAlign="middle">
                    <Grid.Row columns={2}>
                      <Grid.Column computer={15} tablet={16} mobile={16}>
                        <Form>
                          <Form.Group widths="equal">
                            <Form.Input
                              fluid
                              label="Excess (Vice)"
                              placeholder="Excess"
                              id="excess"
                              onChange={this.handleOnChange}
                              value={excess}
                            />
                            <Form.Input
                              fluid
                              label="Mean (Virtue)"
                              placeholder="Mean"
                              id="mean"
                              onChange={this.handleOnChange}
                              value={mean}
                            />
                            <Form.Input
                              fluid
                              label="Deficit (Vice)"
                              placeholder="Deficit"
                              id="deficit"
                              onChange={this.handleOnChange}
                              value={deficit}
                            />
                          </Form.Group>
                        </Form>
                      </Grid.Column>
                      <Grid.Column computer={1} tablet={16} mobile={16}>
                        <Button
                          floated="right"
                          color="green"
                          circular
                          icon
                          basic={!customVirtueValid}
                          disabled={!customVirtueValid}
                          onClick={this.addCustomVirtue}
                        >
                          <Icon name="add" />
                        </Button>
                      </Grid.Column>
                    </Grid.Row>
                    {customVirtues.length > 0 && (
                      <Grid.Row className="mt-0">
                        <Grid.Column>
                          <Table
                            textAlign="center"
                            verticalAlign="middle"
                            celled
                          >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>
                                  Excess (Vice)
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                  Mean (Virtue)
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                  Deficit (Vice)
                                </Table.HeaderCell>
                                <Table.HeaderCell />
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {customVirtues &&
                                customVirtues.map(customVirtue => {
                                  return (
                                    <Table.Row key={customVirtue.id}>
                                      <Table.Cell>
                                        {customVirtue.Excess}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {customVirtue.Mean}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {customVirtue.Deficit}
                                      </Table.Cell>
                                      <Table.Cell
                                        collapsing
                                        verticalAlign="middle"
                                      >
                                        <Button
                                          color="red"
                                          basic
                                          customvirtue={customVirtue}
                                          onClick={this.removeVirtue}
                                        >
                                          <Icon
                                            name="trash alternate outline"
                                            fitted
                                          />
                                        </Button>
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                })}
                            </Table.Body>
                          </Table>
                        </Grid.Column>
                      </Grid.Row>
                    )}
                  </Grid>
                </Card.Content>
                <Card.Content>
                  <Button
                    color="teal"
                    onClick={this.commitCustomVirtues}
                    disabled={!saveValid || addingCustomVirtue}
                    loading={addingCustomVirtue}
                    floated="right"
                  >
                    Save
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
    addingCustomVirtue: virtues.addingCustomVirtue,
    addingCustomVirtueError: virtues.addingCustomVirtueError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addCustomVirtue: data => dispatch(addCustomVirtue(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomVirtue);
