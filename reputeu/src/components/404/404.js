import React, { Component } from "react";
import { Container, Header } from "semantic-ui-react";
import { Helmet } from "react-helmet";
class NotFoundPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <Container textAlign="center">
        <Helmet>
          <title>Page Not Found | ReputeU</title>
        </Helmet>
        <Header as="h1">Page not found</Header>
      </Container>
    );
  }
}

export default NotFoundPage;
