import React, { Component } from "react";
import EmailVerifyComponent from "./verifyEmail";
let queryString = require("query-string");

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionCode: null,
      mode: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const search = this.props.location.search;
    const parsed = queryString.parse(search);
    const actionCode = parsed.oobCode;
    const mode = parsed.mode;

    if (mode && actionCode) {
      this.setState({ actionCode: actionCode, mode: mode });
    } else {
      this.props.history.push("/signin");
    }
  }

  render() {
    const { actionCode, mode } = this.state;

    if (mode === "verifyEmail") {
      return <EmailVerifyComponent actionCode={actionCode} />;
    } else {
      return "hello";
    }
  }
}

export default Accounts;
