export const getVirtues = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_VIRTUES_STARTED"
  });
  try {
    const firestore = getFirestore();
    let virtues = await firestore
      .collection("ru_virtues")
      .doc("virtue_list")
      .collection("ru_virtues_sub")
      .get()
      .then(snapshot => {
        let virtuesList = [];
        snapshot.forEach(doc => {
          virtuesList.push(doc.data());
        });
        return virtuesList;
      });
    dispatch({
      type: "GETTING_VIRTUES_SUCCESS",
      virtues: virtues
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_VIRTUES_ERROR",
      error: error
    });
  }
};

export const getCustomVirtues = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_CUSTOM_VIRTUES_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    let customVirtues = await firestore
      .collection("ru_virtues")
      .doc(uid)
      .collection("ru_virtues_sub")
      .get()
      .then(snapshot => {
        let virtuesList = [];
        snapshot.forEach(doc => {
          virtuesList.push(doc.data());
        });
        return virtuesList;
      });
    dispatch({
      type: "GETTING_CUSTOM_VIRTUES_SUCCESS",
      customVirtues: customVirtues
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_CUSTOM_VIRTUES_ERROR",
      error: error
    });
  }
};

export const createTopic = data => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "CREATING_TOPIC_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;
    let docRef = await firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .doc();

    const topic = {
      name: data.topicName,
      id: docRef.id,
      createdOn: new Date(),
      virtues: data.selectedVirtues,
      topicDeleted: false,
      description: data.description
    };

    await docRef.set(topic);

    dispatch({
      type: "CREATING_TOPIC_SUCCESS",
      topic: topic
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "CREATING_TOPIC_ERROR",
      error: error
    });
  }
};

export const getUserTopics = () => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "GETTING_TOPICS_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    let topics = await firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .get()
      .then(docs => {
        let topicsList = [];
        docs.forEach(doc => {
          if (doc.data().topicDeleted !== true) {
            topicsList.push(doc.data());
          }
        });
        return topicsList;
      });

    dispatch({
      type: "GETTING_TOPICS_SUCCESS",
      topics: topics
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GETTING_TOPICS_ERROR",
      error: error
    });
  }
};

export const deleteUserTopic = topicID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "DELETING_TOPIC_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    firestore
      .collection("ru_user_topics")
      .doc(uid)
      .collection("ru_user_topics_sub")
      .doc(topicID)
      .update({
        topicDeleted: true
      })
      .then(() => {
        dispatch({
          type: "DELETING_TOPIC_SUCCESS",
          topicID: topicID
        });
      });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "DELETING_TOPIC_ERROR",
      error: error
    });
  }
};

export const addCustomVirtue = customVirtues => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "ADDING_VIRTUES_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    var batch = firestore.batch();
    let newCustomVirtues = [];
    customVirtues.forEach(virtue => {
      let docRef = firestore
        .collection("ru_virtues")
        .doc(uid)
        .collection("ru_virtues_sub")
        .doc();

      let newVirtue = {
        ...virtue,
        id: docRef.id
      };
      newCustomVirtues.push(newVirtue);

      batch.set(docRef, newVirtue);
    });

    batch.commit();

    setTimeout(() => {
      dispatch({
        type: "ADDING_VIRTUES_SUCCESS",
        customVirtues: newCustomVirtues
      });
    }, 500);
  } catch (error) {
    console.log(error);
    dispatch({
      type: "ADDING_VIRTUES_ERROR",
      error: error
    });
  }
};

export const deleteCustomVirtue = customVirtueID => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  dispatch({
    type: "DELETING_CUSTOM_VIRTUE_STARTED"
  });
  try {
    const firestore = getFirestore();
    const uid = getState().auth.currentUser.uid;

    firestore
      .collection("ru_virtues")
      .doc(uid)
      .collection("ru_virtues_sub")
      .doc(customVirtueID)
      .delete()
      .then(() => {
        dispatch({
          type: "DELETING_CUSTOM_VIRTUE_SUCCESS",
          customVirtueID: customVirtueID
        });
      });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "DELETING_CUSTOM_VIRTUE_FAIL",
      error: error
    });
  }
};
