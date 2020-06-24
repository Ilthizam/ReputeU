import React, { Component } from "react";
import { connect } from "react-redux";
import { verifyEmail } from "../../store/Actions/accountActions";
import {
  Grid,
  Container,
  Header,
  Message,
  Button,
  Transition,
  Card
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class EmailVerifyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationSuccess: false,
      verificationError: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    if (this.props.actionCode) {
      this.props.verifyEmail(this.props.actionCode);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.verifyingEmail === false &&
      prevProps.verifyingEmail === true
    ) {
      if (this.props.verifyingEmailError === null) {
        this.setState({ verificationSuccess: true });
      } else {
        this.setState({
          verificationSuccess: false,
          verificationError:
            "Your verification link is invalid. This can happen if the link is malformed, expired, or has already been used."
        });
      }
    }
  }

  render() {
    const { verifyingEmail } = this.props;
    const { verificationError, verificationSuccess } = this.state;
    return (
      <Container>
        <Grid
          textAlign="center"
          style={{ marginTop: "100px" }}
          verticalAlign="top"
        >
          <Grid.Column style={{ maxWidth: 400 }}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h2" textAlign="center">
                    {verifyingEmail && "Verifying your email..."}
                    {verificationError && "Failed to verify email"}
                    {verificationSuccess && "Your account is verified!"}
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Transition
                visible={verificationError ? true : false}
                animation="fade down"
                duration={(1, 200)}
                unmountOnHide
              >
                <Grid.Row className="pb-0">
                  <Grid.Column>
                    <Message negative className="mt-0">
                      {verificationError ? verificationError : <>&nbsp;</>}
                    </Message>
                    <Button color="teal" fluid>
                      Resend Verification Link
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Transition>
              {verificationSuccess === true && (
                <Grid.Row>
                  <Grid.Column>
                    <Card fluid>
                      <Card.Content>
                        Your email was successfully verified. Now you can use
                        your email and password to sign in to ReputeU
                      </Card.Content>
                      <Button color="teal" fluid as={Link} to="/signin">
                        Take me to Sign In page
                      </Button>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              )}
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ accounts }) => {
  return {
    verifyingEmail: accounts.verifyingEmail,
    verifyingEmailError: accounts.verifyingEmailError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    verifyEmail: code => dispatch(verifyEmail(code))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailVerifyComponent);
