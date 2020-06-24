import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Table,
  Button,
  Icon
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  deleteCustomVirtue,
  getCustomVirtues
} from "../../store/Actions/virtueActions";
import { Link } from "react-router-dom";
import TopicSubNav from "./topicSubNav";
import { DeleteCustomVirtueConfirmModal } from "./topicModals";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";

// props accepted
// =======================
// selectedVirtuesCallback*
// selectedVirtuesIDCallback*
// initialVirtues
// initialVirtuesID
// reset
// customVirtues

class ManageCustomVirtues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVirtues: [],
      selectedVirtuesID: [],
      openCustomVirtues: false,
      openDeleteConfirmModal: false,
      deletePendingVirtue: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.customVirtues || this.props.customVirtues.length === 0) {
      this.props.getCustomVirtues();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.deletingCustomVirtue === false &&
      this.props.deletingCustomVirtue !== prevProps.deletingCustomVirtue
    ) {
      this.setState({ openDeleteConfirmModal: false });
    }
  }

  getVirtueDeleteConfirmation = (e, callback) => {
    this.setState({
      deletePendingVirtue: callback.customvirtue,
      openDeleteConfirmModal: true
    });
  };

  deleteCustomVirtue = () => {
    if (this.props.deletingCustomVirtue === false) {
      this.props.deleteCustomVirtue(this.state.deletePendingVirtue.id);
    }
  };

  handleDeleteVirtueCancel = () => {
    this.setState({
      deletePendingVirtue: null,
      openDeleteConfirmModal: false
    });
  };

  render() {
    const {
      deletingCustomVirtue,
      customVirtues,
      gettingCustomVirtues
    } = this.props;
    const { openDeleteConfirmModal, deletePendingVirtue } = this.state;

    return (
      <>
        <Container>
          <Helmet>
            <title>Manage Custom Virtues | ReputeU</title>
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
                    Manage Custom Virtues
                  </Breadcrumb.Section>
                </Breadcrumb>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
              <Grid.Column
                computer={4}
                tablet={6}
                mobile={16}
                className="mb-14"
              >
                <TopicSubNav paths={this.props.match} />
              </Grid.Column>
              <Grid.Column computer={12} tablet={10} mobile={16}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Manage Custom Virtues</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    {gettingCustomVirtues ? (
                      <Grid.Row>
                        <Grid.Column>
                          <GeneralPlaceholder />
                        </Grid.Column>
                      </Grid.Row>
                    ) : (
                      <>
                        {customVirtues && customVirtues.length > 0 && (
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
                                <Table.HeaderCell collapsing />
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {customVirtues &&
                                customVirtues.map(customVirtue => {
                                  return (
                                    <Table.Row
                                      key={
                                        customVirtue.id +
                                        Math.random().toString()
                                      }
                                    >
                                      <Table.Cell>
                                        {customVirtue.Excess}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {customVirtue.Mean}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {customVirtue.Deficit}
                                      </Table.Cell>
                                      <Table.Cell>
                                        <Button
                                          color="red"
                                          basic
                                          customvirtue={customVirtue}
                                          onClick={
                                            this.getVirtueDeleteConfirmation
                                          }
                                          className="mr-0"
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
                        )}
                      </>
                    )}
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <DeleteCustomVirtueConfirmModal
            deleteCustomVirtueModalOpen={openDeleteConfirmModal}
            deletePendingVirtue={deletePendingVirtue}
            cancelDeleteVirtue={this.handleDeleteVirtueCancel}
            handleDeleteVirtue={this.deleteCustomVirtue}
            deletingVirtue={deletingCustomVirtue}
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = ({ virtues }) => {
  return {
    gettingVirtues: virtues.gettingVirtues,
    virtueList: virtues.virtueList,
    customVirtues: virtues.customVirtues,
    gettingCustomVirtues: virtues.gettingCustomVirtues,
    deletingCustomVirtue: virtues.deletingCustomVirtue,
    deletingCustomVirtueError: virtues.deletingCustomVirtueError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteCustomVirtue: id => dispatch(deleteCustomVirtue(id)),
    getCustomVirtues: () => dispatch(getCustomVirtues())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCustomVirtues);
