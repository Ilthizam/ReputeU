import React, { Component } from "react";
import {
  Grid,
  Header,
  Search,
  Comment,
  Button,
  Message
} from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  searchUsersAlgolia,
  clearUserSuggestionsRedux
} from "../../store/Actions/communityActions";
import { SearchPlaceholder } from "../../helpers/otherSpinners";

const ResultRenderer = ({ name, handle, photourl, uid }) => {
  return (
    <Comment.Group keu={uid}>
      <Comment uid={uid}>
        <Comment.Avatar src={photourl} />
        <Comment.Content>
          <Comment.Author>{name}</Comment.Author>
          <Comment.Text>{handle}</Comment.Text>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
};

ResultRenderer.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  handle: PropTypes.string,
  photoerl: PropTypes.string,
  uid: PropTypes.string,
  key: PropTypes.string
};

class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refinedResults: null,
      communityMembers: [],
      communityMembersUID: [],
      searchValue: ""
    };
  }

  componentDidMount() {
    if (this.props.currentMembers) {
      this.setState({
        communityMembersUID: this.props.currentMembers
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.results !== this.props.results ||
      this.state.communityMembersUID !== prevState.communityMembersUID
    ) {
      let newResults = [];
      if (this.props.results) {
        newResults = this.props.results.filter(res => {
          if (
            res.uid === this.props.currentUserUID ||
            this.state.communityMembersUID.includes(res.uid)
          ) {
            return false;
          }
          return true;
        });
      }
      this.setState({ refinedResults: newResults });
    }

    if (
      this.props.creatingCommunity !== prevProps.creatingCommunity &&
      this.props.creatingCommunity === false
    ) {
      if (!this.props.creatingCommunityError) {
        this.setState({
          communityMembers: [],
          communityMembersUID: []
        });
      }
    }
  }

  handleSearchChange = (e, callback) => {
    this.setState({ searchValue: callback.value });
    if (callback.value.length > 2) {
      this.props.searchUsersAlgolia(callback.value);
    } else {
      this.props.clearUserSuggestionsRedux();
    }
  };

  handleMemberSelect = (e, { result }) => {
    let newCommunityMembers = [...this.state.communityMembers];
    newCommunityMembers.push({
      ...result,
      photoURL: result.photourl
    });
    let newCommunityMembersUID = [...this.state.communityMembersUID];
    newCommunityMembersUID.push(result.uid);
    this.props.membersCallback({
      communityMembers: newCommunityMembers,
      communityMembersUID: newCommunityMembersUID
    });
    this.setState({
      communityMembers: newCommunityMembers,
      communityMembersUID: newCommunityMembersUID,
      searchValue: ""
    });
  };

  removeUserFromSelection = (e, callback) => {
    let newCommunityMembers = this.state.communityMembers.filter(res => {
      if (res.uid === callback.uid) {
        return false;
      }
      return true;
    });

    let newCommunityMembersUID = this.state.communityMembersUID.filter(res => {
      if (res === callback.uid) {
        return false;
      }
      return true;
    });
    this.props.membersCallback({
      communityMembers: newCommunityMembers,
      communityMembersUID: newCommunityMembersUID
    });
    this.setState({
      communityMembers: newCommunityMembers,
      communityMembersUID: newCommunityMembersUID
    });
  };

  render() {
    const { searchValue, refinedResults, communityMembers } = this.state;
    const { loadingResults } = this.props;
    return (
      <Grid>
        <Grid.Row className="pb-0">
          <Grid.Column>
            <Header as="h5">Add Members</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} className="pt-7">
          <Grid.Column computer={6} tablet={8} mobile={16} className="mb-14">
            <Message info>You can search by name, handle or profession</Message>
            <Search
              id="search_user"
              loading={loadingResults}
              input={{
                fluid: true,
                placeholder: "Search users..."
              }}
              onResultSelect={this.handleMemberSelect}
              onSearchChange={this.handleSearchChange}
              results={refinedResults}
              value={searchValue}
              resultRenderer={ResultRenderer}
              noResultsMessage={
                searchValue.length > 2 ? (
                  loadingResults ? (
                    <SearchPlaceholder />
                  ) : (
                    'No user found for "' + searchValue + '"'
                  )
                ) : (
                  "Type more than 2 letters"
                )
              }
            />
          </Grid.Column>
          <Grid.Column computer={10} tablet={8} mobile={16}>
            <Comment.Group>
              {communityMembers &&
                communityMembers.map(({ name, uid, handle, photoURL, key }) => {
                  return (
                    <Comment key={key}>
                      <Comment.Avatar src={photoURL} />
                      <Comment.Content>
                        <Comment.Author as="a">{name}</Comment.Author>
                        <Button
                          floated="right"
                          uid={uid}
                          color="red"
                          icon="trash alternate"
                          basic
                          onClick={this.removeUserFromSelection}
                        />

                        <Comment.Text>{handle}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                })}
            </Comment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = ({ auth, community }) => {
  return {
    results: community.communityUserSuggestions,
    loadingResults: community.communityUserSuggestionsLoading,
    currentUserUID: auth.currentUser.uid,
    creatingCommunity: community.creatingCommunity,
    creatingCommunityError: community.creatingCommunityError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearUserSuggestionsRedux: () => dispatch(clearUserSuggestionsRedux()),
    searchUsersAlgolia: searchValue => dispatch(searchUsersAlgolia(searchValue))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSearch);
