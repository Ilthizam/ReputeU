import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Grid } from "semantic-ui-react";

export default class Spinner extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <Grid verticalAlign="middle" centered>
        <Grid.Row
          style={{
            width: "100vw",
            height: "100vh",
            marginTop: "-81px"
          }}
        >
          <Grid.Column textAlign="center" style={{ width: "200px" }}>
            <Loader
              type="MutatingDots"
              color="#00B5AD"
              height={100}
              width={100}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
