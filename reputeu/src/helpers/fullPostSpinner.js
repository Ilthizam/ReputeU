import React, { Component } from "react";
import { Grid, Container, Card, Placeholder } from "semantic-ui-react";

export default class FullPostSpinner extends Component {
  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Placeholder>
                <Placeholder.Line length="short" />
              </Placeholder>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={16}>
              <Card fluid>
                <Card.Content>
                  <Grid verticalAlign="middle">
                    <Grid.Row columns={3}>
                      <Grid.Column
                        computer={1}
                        tablet={2}
                        mobile={2}
                        className="pr-0"
                      >
                        <Placeholder>
                          <Placeholder.Image square />
                        </Placeholder>
                      </Grid.Column>
                      <Grid.Column computer={12} tablet={10} mobile={10}>
                        <Placeholder>
                          <Placeholder.Line />
                          <Placeholder.Line length="short" />
                        </Placeholder>
                      </Grid.Column>
                      <Grid.Column
                        computer={3}
                        tablet={4}
                        mobile={4}
                      ></Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Content>
                <Card.Content>
                  <Placeholder fluid>
                    <Placeholder.Header>
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Grid.Row columns="3">
                      <Grid.Column computer="2" tablet="4" mobile="4">
                        <Placeholder>
                          <Placeholder.Line />
                        </Placeholder>
                      </Grid.Column>
                      <Grid.Column computer="12" tablet="9" mobile="9">
                        <Placeholder>
                          <Placeholder.Line length="very short" />
                        </Placeholder>
                      </Grid.Column>
                      <Grid.Column
                        textAlign="right"
                        computer="2"
                        tablet="3"
                        mobile="3"
                      >
                        <Placeholder>
                          <Placeholder.Line />
                        </Placeholder>
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
