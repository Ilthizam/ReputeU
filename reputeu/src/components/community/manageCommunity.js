import React, { Component } from "react";
import {
  Container,
  Grid,
  Breadcrumb,
  Card,
  Accordion,
  Icon,
  Button,
  Comment,
  Responsive
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import CommunitySubNav from "./communitySubNav";
import { connect } from "react-redux";
import {
  getUserCommunity,
  deleteCommunity,
  deleteCommunityMember,
  changeCommunityName,
  addCommunityMembers
} from "../../store/Actions/communityActions";
import {
  DeleteCommunityConfirmModal,
  DeleteCommunityMembersConfirmModal,
  ChangeCommunityNameModal,
  AddNewMembersModal
} from "./communityModals";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GeneralPlaceholder } from "../../helpers/otherSpinners";
import Helmet from "react-helmet";

class ManageCommunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
      deleteCommunityModalOpen: false,
      deletePendingCommunity: null,
      deleteCommunityMemberModalOpen: false,
      deletePendingCommunityMember: null,
      changeCommunityNameModalOpen: false,
      changeCommunityNewName: null,
      changeCommunityNamePending: null,
      addCommunityMembersModalOpen: false,
      addMembersPendingCommunity: null,
      pendingCommunityMembers: null
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);

    if (!this.props.communities) {
      this.props.getUserCommunity();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.deletingCommunity !== prevProps.deletingCommunity &&
      this.props.deletingCommunity === false
    ) {
      this.setState({
        deleteCommunityModalOpen: false,
        deletePendingCommunity: null
      });
    }
    if (
      this.props.deletingCommunityMember !==
        prevProps.deletingCommunityMember &&
      this.props.deletingCommunityMember === false
    ) {
      this.setState({
        deleteCommunityMemberModalOpen: false,
        deletePendingCommunityMember: null
      });
    }
    if (
      this.props.changingCommunityName !== prevProps.changingCommunityName &&
      this.props.changingCommunityName === false
    ) {
      this.setState({
        changeCommunityNewName: null,
        changeCommunityNamePending: null,
        changeCommunityNameModalOpen: false
      });
    }
    if (
      this.props.addingCommunityMember !== prevProps.addingCommunityMember &&
      this.props.addingCommunityMember === false
    ) {
      this.setState({
        addCommunityMembersModalOpen: false,
        addMembersPendingCommunity: null,
        pendingCommunityMembers: null
      });
    }

    if (
      this.props.deletingCommunityError &&
      prevProps.deletingCommunityError !== this.props.deletingCommunityError
    ) {
      toast.error(this.props.deletingCommunityError.message);
    }
    if (
      this.props.changingCommunityNameError &&
      prevProps.changingCommunityNameError !==
        this.props.changingCommunityNameError
    ) {
      toast.error(this.props.changingCommunityNameError.message);
    }
    if (
      this.props.addingCommunityMemberError &&
      prevProps.addingCommunityMemberError !==
        this.props.addingCommunityMemberError
    ) {
      toast.error(this.props.addingCommunityMemberError.message);
    }
    if (
      this.props.deletingCommunityMemberError &&
      prevProps.deletingCommunityMemberError !==
        this.props.deletingCommunityMemberError
    ) {
      toast.error(this.props.deletingCommunityMemberError.message);
    }
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? null : index;
    this.setState({ activeIndex: newIndex });
  };

  getCommunityDeleteConfirmation = (e, callback) => {
    this.setState({
      deletePendingCommunity: {
        communityID: callback.communityid,
        communityName: callback.communityname
      },
      deleteCommunityModalOpen: true
    });
  };

  handleDeleteCommunity = () => {
    if (this.props.deletingCommunity === false) {
      this.props.deleteCommunity(this.state.deletePendingCommunity.communityID);
    }
  };

  cancelDeleteCommunity = () => {
    this.setState({
      deleteCommunityModalOpen: false,
      deletePendingCommunity: null
    });
  };

  getCommunityMemberDeleteConfirmation = (e, callback) => {
    this.setState({
      deletePendingCommunityMember: {
        communityID: callback.communityid,
        communityName: callback.communityname,
        member: callback.member
      },
      deleteCommunityMemberModalOpen: true
    });
  };

  handleDeleteCommunityMember = () => {
    this.props.deleteCommunityMember(this.state.deletePendingCommunityMember);
    this.setState({
      //deleteCommunityMemberModalOpen: false,
      //deletePendingCommunityMember: null
    });
  };

  cancelDeleteCommunityMember = () => {
    this.setState({
      deleteCommunityMemberModalOpen: false,
      deletePendingCommunityMember: null
    });
  };

  getCommunityNameChangeConfirmation = (e, callback) => {
    this.setState({
      changeCommunityNewName: null,
      changeCommunityNamePending: callback.communityid,
      changeCommunityNameModalOpen: true
    });
  };

  handleChangeCommunityName = () => {
    if (
      this.state.changeCommunityNewName.length > 0 &&
      this.props.changingCommunityName === false
    ) {
      this.props.changeCommunityName(
        this.state.changeCommunityNewName,
        this.state.changeCommunityNamePending
      );
    }
    // this.setState({
    //   changeCommunityNewName: null,
    //   changeCommunityNamePending: null
    //   changeCommunityNameModalOpen: false
    // });
  };

  handleCancelChangeCommunityName = () => {
    this.setState({
      changeCommunityNewName: null,
      changeCommunityNamePending: null,
      changeCommunityNameModalOpen: false
    });
  };

  handleChangeCommunityNewName = newName => {
    this.setState({
      changeCommunityNewName: newName.target.value
    });
  };

  getCommunityAddMembersConfirmation = (e, callback) => {
    this.getPendingCommunityMembers(callback.communityid);
    this.setState({
      addMembersPendingCommunity: callback.communityid,
      addCommunityMembersModalOpen: true
    });
  };

  handleCancelAddCommunityMembers = () => {
    this.setState({
      addMembersPendingCommunity: null,
      addCommunityMembersModalOpen: false
    });
  };

  handleAddCommunityMembers = state => {
    if (state.communityMembers.length > 0) {
      this.props.addCommunityMembers(
        state.communityMembers,
        state.communityMembersUID,
        this.state.addMembersPendingCommunity
      );
    }
  };

  getPendingCommunityMembers = pendingCommunityID => {
    let members = [];
    const { communities } = this.props;
    for (let i in communities) {
      if (communities[i].communityID === pendingCommunityID) {
        for (let j in communities[i].members) {
          members.push(communities[i].members[j].uid);
        }
        break;
      }
    }
    this.setState({
      pendingCommunityMembers: members
    });
  };

  render() {
    const {
      gettingCommunities,
      communities,
      deletingCommunity,
      deletingCommunityMember,
      changingCommunityName,
      addingCommunityMember
    } = this.props;
    const {
      activeIndex,
      deleteCommunityModalOpen,
      deletePendingCommunity,
      deletePendingCommunityMember,
      deleteCommunityMemberModalOpen,
      changeCommunityNameModalOpen,
      addCommunityMembersModalOpen,
      pendingCommunityMembers
    } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Manage Community | ReputeU</title>
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Manage Community</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer={4} tablet={6} mobile={16} className="mb-14">
              <CommunitySubNav paths={this.props.match} />
            </Grid.Column>
            <Grid.Column computer={12} tablet={10} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Manage Community</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid divided="vertically">
                    {gettingCommunities === true ? (
                      <Grid.Row>
                        <Grid.Column>
                          <GeneralPlaceholder className="pt-14" />
                        </Grid.Column>
                      </Grid.Row>
                    ) : (
                      <>
                        {communities &&
                          communities.map(com => {
                            return (
                              <Grid.Row
                                columns={3}
                                key={com.communityID}
                                verticalAlign={
                                  activeIndex === com.communityID
                                    ? "top"
                                    : "middle"
                                }
                              >
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
                                    {com.name}
                                  </label>
                                </Grid.Column>
                                <Grid.Column
                                  computer={8}
                                  tablet={7}
                                  mobile={16}
                                  className="mb-0 mt-0"
                                >
                                  <Accordion>
                                    <Accordion.Title
                                      active={activeIndex === com.communityID}
                                      index={com.communityID}
                                      onClick={this.handleClick}
                                      className="noselect"
                                    >
                                      <Icon name="dropdown" />
                                      {com.members.length} member
                                      {com.members.length !== 1 && "s"}{" "}
                                      {activeIndex !== com.communityID && (
                                        <label className="grey-label">
                                          (View all)
                                        </label>
                                      )}
                                    </Accordion.Title>
                                    <Accordion.Content
                                      active={activeIndex === com.communityID}
                                    >
                                      <Comment.Group className="pb-14">
                                        {com.members.map(person => {
                                          return (
                                            <Comment
                                              key={com.communityID + person.uid}
                                            >
                                              <Comment.Avatar
                                                src={person.photoURL}
                                              />
                                              <Comment.Content>
                                                <Comment.Author
                                                  as={Link}
                                                  to={"/ru/" + person.handle}
                                                >
                                                  {person.name}
                                                </Comment.Author>
                                                <Button
                                                  floated="right"
                                                  member={person}
                                                  communityid={com.communityID}
                                                  communityname={com.name}
                                                  color="red"
                                                  icon="trash alternate outline"
                                                  basic
                                                  loading={
                                                    deletingCommunityMember
                                                  }
                                                  disabled={
                                                    deletingCommunityMember
                                                  }
                                                  onClick={
                                                    this
                                                      .getCommunityMemberDeleteConfirmation
                                                  }
                                                />

                                                <Comment.Text>
                                                  {" "}
                                                  {person.handle}
                                                </Comment.Text>
                                              </Comment.Content>
                                            </Comment>
                                          );
                                        })}
                                      </Comment.Group>
                                    </Accordion.Content>
                                  </Accordion>
                                </Grid.Column>
                                <Grid.Column
                                  computer={4}
                                  tablet={4}
                                  mobile={16}
                                  className="mb-0 mt-0"
                                >
                                  <Responsive minWidth="767">
                                    <Button.Group icon fluid>
                                      <Button
                                        color="teal"
                                        communityid={com.communityID}
                                        basic
                                        onClick={
                                          this
                                            .getCommunityNameChangeConfirmation
                                        }
                                        loading={changingCommunityName}
                                        disabled={changingCommunityName}
                                      >
                                        <Icon name="edit" />
                                      </Button>
                                      <Button
                                        color="blue"
                                        communityid={com.communityID}
                                        basic
                                        onClick={
                                          this
                                            .getCommunityAddMembersConfirmation
                                        }
                                        loading={addingCommunityMember}
                                        disabled={addingCommunityMember}
                                      >
                                        <Icon name="add user" />
                                      </Button>
                                      <Button
                                        color="red"
                                        communityid={com.communityID}
                                        communityname={com.name}
                                        basic
                                        onClick={
                                          this.getCommunityDeleteConfirmation
                                        }
                                        disabled={deletingCommunity}
                                      >
                                        <Icon name="trash alternate outline" />
                                      </Button>
                                    </Button.Group>
                                  </Responsive>

                                  <Responsive maxWidth="766">
                                    <Button
                                      color="teal"
                                      communityid={com.communityID}
                                      basic
                                      icon
                                      labelPosition="left"
                                      className="mb-7"
                                      fluid
                                      onClick={
                                        this.getCommunityNameChangeConfirmation
                                      }
                                      loading={changingCommunityName}
                                      disabled={changingCommunityName}
                                    >
                                      <Icon name="edit" />
                                      Rename
                                    </Button>
                                    <Button
                                      color="blue"
                                      communityid={com.communityID}
                                      basic
                                      icon
                                      labelPosition="left"
                                      className="mb-7"
                                      fluid
                                      onClick={
                                        this.getCommunityAddMembersConfirmation
                                      }
                                      loading={addingCommunityMember}
                                      disabled={addingCommunityMember}
                                    >
                                      <Icon name="add user" />
                                      Add Members
                                    </Button>
                                    <Button
                                      color="red"
                                      communityid={com.communityID}
                                      communityname={com.name}
                                      basic
                                      onClick={
                                        this.getCommunityDeleteConfirmation
                                      }
                                      loading={deletingCommunity}
                                      disabled={deletingCommunity}
                                      icon
                                      labelPosition="left"
                                      className="mb-7"
                                      fluid
                                    >
                                      <Icon name="trash alternate outline" />
                                      Delete
                                    </Button>
                                  </Responsive>
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
        <DeleteCommunityConfirmModal
          deleteCommunityModalOpen={deleteCommunityModalOpen}
          deletePendingCommunity={deletePendingCommunity}
          cancelDeleteCommunity={this.cancelDeleteCommunity}
          handleDeleteCommunity={this.handleDeleteCommunity}
          deletingCommunity={deletingCommunity}
        />
        <DeleteCommunityMembersConfirmModal
          deleteCommunityMemberModalOpen={deleteCommunityMemberModalOpen}
          deletePendingCommunityMember={deletePendingCommunityMember}
          cancelDeleteCommunityMember={this.cancelDeleteCommunityMember}
          handleDeleteCommunityMember={this.handleDeleteCommunityMember}
          deletingCommunityMember={deletingCommunityMember}
        />
        <ChangeCommunityNameModal
          changeCommunityNameModalOpen={changeCommunityNameModalOpen}
          communityNewName={this.handleChangeCommunityNewName}
          cancelchangeCommunityName={this.handleCancelChangeCommunityName}
          handleChangeCommunityName={this.handleChangeCommunityName}
          changingCommunityName={changingCommunityName}
        />
        <AddNewMembersModal
          addCommunityMembersModalOpen={addCommunityMembersModalOpen}
          currentMembers={pendingCommunityMembers}
          cancelAddCommunityMembers={this.handleCancelAddCommunityMembers}
          handleAddCommunityMembers={this.handleAddCommunityMembers}
          addingCommunityMember={addingCommunityMember}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, community }) => {
  return {
    gettingCommunities: community.gettingCommunities,
    gettingCommunitiesError: community.gettingCommunitiesError,
    communities: community.communities,
    deletingCommunity: community.deletingCommunity,
    deletingCommunityError: community.deletingCommunityError,
    deletingCommunityMember: community.deletingCommunityMember,
    deletingCommunityMemberError: community.deletingCommunityMemberError,
    changingCommunityName: community.changingCommunityName,
    changingCommunityNameError: community.changingCommunityNameError,
    addingCommunityMember: community.addingCommunityMember,
    addingCommunityMemberError: community.addingCommunityMemberError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserCommunity: () => dispatch(getUserCommunity()),
    deleteCommunity: communityID => dispatch(deleteCommunity(communityID)),
    deleteCommunityMember: member => dispatch(deleteCommunityMember(member)),
    changeCommunityName: (newName, communityID) =>
      dispatch(changeCommunityName(newName, communityID)),
    addCommunityMembers: (members, membersUID, communityID) =>
      dispatch(addCommunityMembers(members, membersUID, communityID))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCommunity);
