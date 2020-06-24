import { Button, Modal, Form, Input } from "semantic-ui-react";
import React, { Component } from "react";
import UserSearch from "./userSearch";

export class DeleteCommunityConfirmModal extends Component {
  render() {
    const {
      deleteCommunityModalOpen,
      deletePendingCommunity,
      cancelDeleteCommunity,
      handleDeleteCommunity,
      deletingCommunity
    } = this.props;
    return (
      <Modal size="mini" open={deleteCommunityModalOpen}>
        <Modal.Header>Delete Community </Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to delete community:{" "}
            <strong>
              {deletePendingCommunity && deletePendingCommunity.communityName}
            </strong>{" "}
            ?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={cancelDeleteCommunity} color="teal">
            Cancel
          </Button>
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Yes, Delete"
            onClick={handleDeleteCommunity}
            loading={deletingCommunity}
            disabled={deletingCommunity}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export class DeleteCommunityMembersConfirmModal extends Component {
  render() {
    const {
      deleteCommunityMemberModalOpen,
      deletePendingCommunityMember,
      cancelDeleteCommunityMember,
      handleDeleteCommunityMember,
      deletingCommunityMember
    } = this.props;
    return (
      <Modal size="mini" open={deleteCommunityMemberModalOpen}>
        <Modal.Header>Remove Member </Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to remove member{" "}
            <strong>
              {deletePendingCommunityMember &&
                deletePendingCommunityMember.member.name}
            </strong>{" "}
            from community{" "}
            <strong>
              {deletePendingCommunityMember &&
                deletePendingCommunityMember.communityName}
            </strong>{" "}
            ?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={cancelDeleteCommunityMember} color="teal">
            Cancel
          </Button>
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Yes, Remove"
            onClick={handleDeleteCommunityMember}
            loading={deletingCommunityMember}
            disabled={deletingCommunityMember}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export class ChangeCommunityNameModal extends Component {
  render() {
    const {
      changeCommunityNameModalOpen,
      communityNewName,
      cancelchangeCommunityName,
      handleChangeCommunityName,
      changingCommunityName
    } = this.props;
    return (
      <Modal size="mini" open={changeCommunityNameModalOpen}>
        <Modal.Header>Rename Community</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>New Name</label>
              <Input
                placeholder="Type new name here"
                onChange={communityNewName}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            content="Cancel"
            basic
            onClick={cancelchangeCommunityName}
          />
          <Button
            onClick={handleChangeCommunityName}
            color="teal"
            loading={changingCommunityName}
            disabled={changingCommunityName}
          >
            Change
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export class AddNewMembersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityMembers: [],
      communityMembersUID: [],
      searchValue: ""
    };
  }

  handleAddButtonClick = () => {
    this.props.handleAddCommunityMembers(this.state);
  };

  handleCommunityMembersChange = members => {
    this.setState({
      communityMembers: members.communityMembers,
      communityMembersUID: members.communityMembersUID
    });
  };

  render() {
    const {
      addCommunityMembersModalOpen,
      cancelAddCommunityMembers,
      currentMembers,
      addingCommunityMember
    } = this.props;

    const { communityMembers } = this.state;
    return (
      <Modal open={addCommunityMembersModalOpen}>
        <Modal.Header>Add Members</Modal.Header>
        <Modal.Content>
          <UserSearch
            membersCallback={this.handleCommunityMembersChange}
            currentMembers={currentMembers}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            content="Cancel"
            basic
            onClick={cancelAddCommunityMembers}
          />
          <Button
            onClick={this.handleAddButtonClick}
            color="teal"
            disabled={communityMembers.length === 0 || addingCommunityMember}
            loading={addingCommunityMember}
          >
            Add
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
