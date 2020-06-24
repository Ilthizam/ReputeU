import React, { Component } from "react";
import {
  Grid,
  Container,
  Card,
  Placeholder,
  Responsive
} from "semantic-ui-react";

export default class ProfileSpinner extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line length="short" />
                </Placeholder.Header>
              </Placeholder>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Grid stretched>
                    <Grid.Row className="pt-0 pb-0">
                      <Grid.Column
                        computer={4}
                        only="tablet computer"
                        className="pl-0 pr-0"
                      >
                        <Placeholder>
                          <Placeholder.Image square />
                        </Placeholder>
                      </Grid.Column>
                      <Grid.Column computer={12} mobile={16}>
                        <Grid>
                          <Grid.Row columns={2} verticalAlign="middle">
                            <Responsive
                              maxWidth={767}
                              as={Grid.Column}
                              mobile={3}
                              className="pr-0 pt-14"
                            >
                              <Placeholder>
                                <Placeholder.Image square />
                              </Placeholder>
                            </Responsive>
                            <Grid.Column mobile={13} tablet={13}>
                              {this.props.mode === "not-found" ? (
                                <label
                                  style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "bold"
                                  }}
                                >
                                  This account doesn't exist
                                </label>
                              ) : (
                                <Placeholder>
                                  <Placeholder.Line />
                                  <Placeholder.Line length="very short" />
                                  <Placeholder.Line length="short" />
                                </Placeholder>
                              )}
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column>
                              <Placeholder>
                                <Placeholder.Paragraph>
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                  <Placeholder.Line />
                                </Placeholder.Paragraph>
                              </Placeholder>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row className="pt-0">
                            <Grid.Column>
                              <Placeholder>
                                <Placeholder.Line length="very short" />
                              </Placeholder>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                        <Grid columns={4} divided verticalAlign="middle">
                          <Grid.Row>
                            <Grid.Column>
                              <Placeholder>
                                <Placeholder.Line />
                                <Placeholder.Line />
                              </Placeholder>
                            </Grid.Column>
                            <Grid.Column>
                              <Placeholder>
                                <Placeholder.Line />
                                <Placeholder.Line />
                              </Placeholder>
                            </Grid.Column>
                            <Grid.Column>
                              <Placeholder>
                                <Placeholder.Line />
                                <Placeholder.Line />
                              </Placeholder>
                            </Grid.Column>
                            <Grid.Column textAlign="center">
                              <center>
                                <Placeholder style={{ height: 30, width: 30 }}>
                                  <Placeholder.Image />
                                </Placeholder>
                              </center>
                            </Grid.Column>
                          </Grid.Row>
                          <Responsive maxWidth="1200" className="pb-14" />
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
