import { Button, Modal } from "semantic-ui-react";
import React, { Component } from "react";

export class DeleteTopicConfirmModal extends Component {
  render() {
    const {
      deleteTopicModalOpen,
      deletePendingTopic,
      cancelDeleteTopic,
      handleDeleteTopic,
      deletingTopic
    } = this.props;

    return (
      <Modal size="mini" open={deleteTopicModalOpen}>
        <Modal.Header>Delete Topic</Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to delete topic:{" "}
            <strong>{deletePendingTopic && deletePendingTopic.name}</strong> ?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={cancelDeleteTopic} color="teal">
            Cancel
          </Button>
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Yes, Delete"
            onClick={handleDeleteTopic}
            loading={deletingTopic}
            disabled={deletingTopic}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export class DeleteCustomVirtueConfirmModal extends Component {
  render() {
    const {
      deleteCustomVirtueModalOpen,
      cancelDeleteVirtue,
      handleDeleteVirtue,
      deletingVirtue
    } = this.props;

    return (
      <Modal size="mini" open={deleteCustomVirtueModalOpen}>
        <Modal.Header>Delete Custom Virtue</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete the selected virtue?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic onClick={cancelDeleteVirtue} color="teal">
            Cancel
          </Button>
          <Button
            negative
            icon="trash"
            labelPosition="right"
            content="Yes, Delete"
            onClick={handleDeleteVirtue}
            loading={deletingVirtue}
            disabled={deletingVirtue}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
