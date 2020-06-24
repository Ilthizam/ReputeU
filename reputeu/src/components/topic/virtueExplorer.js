import React, { Component } from "react";
import { Table, Checkbox, Accordion, Icon, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  getVirtues,
  getCustomVirtues
} from "../../store/Actions/virtueActions";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";

// props accepted
// =======================
// selectedVirtuesCallback*
// selectedVirtuesIDCallback*
// initialVirtues
// initialVirtuesID
// reset
// customVirtues

class VirtueExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVirtues: [],
      selectedVirtuesID: [],
      openCustomVirtues: false
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (!this.props.virtueList) {
      this.props.getVirtues();
      this.props.getCustomVirtues();
    }
    if (this.props.initialVirtues && this.props.initialVirtuesID) {
      this.setState({
        selectedVirtues: this.props.initialVirtues,
        selectedVirtuesID: this.props.initialVirtuesID
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedVirtues !== this.state.selectedVirtues ||
      prevState.selectedVirtuesID !== this.state.selectedVirtuesID
    ) {
      this.props.selectedVirtuesCallback(this.state);
      this.props.selectedVirtuesIDCallback(this.state);
    }

    if (this.props.reset === true && this.props.reset !== prevProps.reset) {
      this.setState({
        selectedVirtues: [],
        selectedVirtuesID: []
      });
    }
  }

  toggleVirtue = (e, callback) => {
    if (this.state.selectedVirtuesID.includes(callback.virtue.id)) {
      let newIDs = this.state.selectedVirtuesID.filter(id => {
        return id !== callback.virtue.id;
      });
      let newVirtues = this.state.selectedVirtues.filter(virtue => {
        return virtue.id !== callback.virtue.id;
      });
      this.setState({ selectedVirtuesID: newIDs, selectedVirtues: newVirtues });
    } else {
      this.setState({
        selectedVirtuesID: [
          ...this.state.selectedVirtuesID,
          callback.virtue.id
        ],
        selectedVirtues: [...this.state.selectedVirtues, callback.virtue]
      });
    }
  };

  expandCustomVirtues = (e, callback) => {
    this.setState({ openCustomVirtues: !this.state.openCustomVirtues });
  };

  render() {
    const {
      gettingVirtues,
      virtueList,
      customVirtues,
      gettingCustomVirtues
    } = this.props;
    const { selectedVirtuesID, openCustomVirtues } = this.state;
    if (gettingVirtues || gettingCustomVirtues) {
      return (
        <Grid.Row>
          <Grid.Column>
            <GeneralPlaceholder />
          </Grid.Column>
        </Grid.Row>
      );
    } else {
      return (
        <>
          <Table definition textAlign="center" verticalAlign="middle" celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Excess (Vice)</Table.HeaderCell>
                <Table.HeaderCell>Mean (Virtue)</Table.HeaderCell>
                <Table.HeaderCell>Deficit (Vice)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {virtueList &&
                virtueList.map(virtue => {
                  return (
                    <Table.Row
                      key={virtue.id}
                      positive={
                        selectedVirtuesID.includes(virtue.id) ? true : false
                      }
                    >
                      <Table.Cell collapsing verticalAlign="middle">
                        <Checkbox
                          virtue={virtue}
                          checked={
                            selectedVirtuesID.includes(virtue.id) ? true : false
                          }
                          onClick={this.toggleVirtue}
                        />
                      </Table.Cell>
                      <Table.Cell>{virtue.Excess}</Table.Cell>
                      <Table.Cell>{virtue.Mean}</Table.Cell>
                      <Table.Cell>{virtue.Deficit}</Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>

          {customVirtues && customVirtues.length > 0 && (
            <Accordion>
              <Accordion.Title
                active={openCustomVirtues}
                onClick={this.expandCustomVirtues}
              >
                <Icon name="dropdown" />
                View Custom Virtues
              </Accordion.Title>
              <Accordion.Content active={openCustomVirtues}>
                <Table
                  definition
                  textAlign="center"
                  verticalAlign="middle"
                  celled
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell />
                      <Table.HeaderCell>Excess (Vice)</Table.HeaderCell>
                      <Table.HeaderCell>Mean (Virtue)</Table.HeaderCell>
                      <Table.HeaderCell>Deficit (Vice)</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {customVirtues &&
                      customVirtues.map(customVirtue => {
                        return (
                          <Table.Row
                            key={customVirtue.id}
                            positive={
                              selectedVirtuesID.includes(customVirtue.id)
                                ? true
                                : false
                            }
                          >
                            <Table.Cell collapsing verticalAlign="middle">
                              <Checkbox
                                virtue={customVirtue}
                                checked={
                                  selectedVirtuesID.includes(customVirtue.id)
                                    ? true
                                    : false
                                }
                                onClick={this.toggleVirtue}
                              />
                            </Table.Cell>
                            <Table.Cell>{customVirtue.Excess}</Table.Cell>
                            <Table.Cell>{customVirtue.Mean}</Table.Cell>
                            <Table.Cell>{customVirtue.Deficit}</Table.Cell>
                          </Table.Row>
                        );
                      })}
                  </Table.Body>
                </Table>
              </Accordion.Content>
            </Accordion>
          )}
        </>
      );
    }
  }
}

const mapStateToProps = ({ virtues }) => {
  return {
    gettingVirtues: virtues.gettingVirtues,
    virtueList: virtues.virtueList,
    customVirtues: virtues.customVirtues,
    gettingCustomVirtues: virtues.gettingCustomVirtues
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getVirtues: () => dispatch(getVirtues()),
    getCustomVirtues: () => dispatch(getCustomVirtues())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VirtueExplorer);
