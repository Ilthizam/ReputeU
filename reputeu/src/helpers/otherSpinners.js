import React from "react";
import { Grid, Placeholder } from "semantic-ui-react";

export const SearchPlaceholder = () => {
  return (
    <Grid>
      <Grid.Column>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </Grid.Column>
    </Grid>
  );
};

export const CommunityPlaceholder = () => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const GeneralPlaceholder = () => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
