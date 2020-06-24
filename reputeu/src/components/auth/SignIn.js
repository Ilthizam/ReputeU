import React, { Component } from "react";
import { connect } from "react-redux";
import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  clearAuthErrors
} from "../../store/Actions/authActions";
import {
  Grid,
  Container,
  Header,
  Message,
  Form,
  Button,
  Divider,
  Transition
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { emailValidator } from "../../helpers/validators";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    formValid: false,
    emailValid: false,
    captchaValid: true
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.clearAuthErrors();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.emailValid !== this.state.emailValid ||
      prevState.password !== this.state.password ||
      prevState.captchaValid !== this.state.captchaValid
    ) {
      const { emailValid, password, captchaValid } = this.state;
      if (emailValid && password.length > 0 && captchaValid) {
        this.setState({ formValid: true });
      } else {
        this.setState({ formValid: false });
      }
    }

    if (prevProps.showSignInCaptcha !== this.props.showSignInCaptcha) {
      if (this.props.showSignInCaptcha === true) {
        this.setState({ captchaValid: false });
      } else {
        this.setState({ captchaValid: true });
      }
    }
  }

  handleOnChange = e => {
    this.setState({ [e.target.id]: e.target.value });

    if (e.target.id === "email") {
      if (emailValidator(e.target.value)) {
        this.setState({ emailValid: true });
      } else {
        this.setState({ emailValid: false });
      }
    }
  };

  handleOnSubmit = e => {
    e.preventDefault();
    if (this.state.formValid && this.state.captchaValid) {
      this.props.signIn(this.state);
    } else {
      alert("Don't mess with the form :p, Form is invalid");
    }
  };

  signInWithGoogle = e => {
    this.props.signInWithGoogle();
  };

  signInWithFacebook = e => {
    this.props.signInWithFacebook();
  };

  signInWithTwitter = e => {
    this.props.signInWithTwitter();
  };

  onCaptchaChange = value => {
    if (value) {
      this.setState({ captchaValid: true });
    } else {
      this.setState({ captchaValid: false });
    }
  };

  render() {
    const { signInFail, signInLoading, showSignInCaptcha } = this.props;
    const { formValid } = this.state;
    return (
      <Container>
        <Helmet>
          <title>Sign In | ReputeU</title>
          <link rel="canonical" href={"https://reputeu.com/signin"} />
        </Helmet>
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
                    Sign In
                  </Header>
                </Grid.Column>
              </Grid.Row>
              <Transition
                visible={signInFail ? true : false}
                animation="fade down"
                duration={(1, 200)}
                unmountOnHide
              >
                <Grid.Row className="pb-0">
                  <Grid.Column>
                    <Message negative className="mt-0">
                      {signInFail ? signInFail : <>&nbsp;</>}
                    </Message>
                  </Grid.Column>
                </Grid.Row>
              </Transition>
              <Grid.Row>
                <Grid.Column>
                  <Form className="pb-14" onSubmit={this.handleOnSubmit}>
                    <Form.Input
                      fluid
                      icon="mail"
                      iconPosition="left"
                      placeholder="E-mail address"
                      autoComplete="email"
                      onChange={this.handleOnChange}
                      id="email"
                    />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      onChange={this.handleOnChange}
                      id="password"
                    />
                    <Button
                      color="teal"
                      fluid
                      disabled={!formValid || signInLoading}
                      loading={signInLoading}
                    >
                      Log In
                    </Button>
                  </Form>
                  {showSignInCaptcha && (
                    <Grid.Row>
                      <Grid.Column textAlign="center">
                        <center>
                          <ReCAPTCHA
                            sitekey="6LepUsUUAAAAALYS04Jow5yfkGJcsvINDzQ-O79M"
                            onChange={this.onCaptchaChange}
                            style={{ width: "100%" }}
                          />
                        </center>
                      </Grid.Column>
                    </Grid.Row>
                  )}
                  <Link to="/pasword-reset">Forgot Password</Link>
                  <Divider horizontal>OR</Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="pt-0">
                <Grid.Column>
                  <Button
                    circular
                    color="google plus"
                    icon="google"
                    onClick={this.signInWithGoogle}
                  />
                  <Button
                    circular
                    color="facebook"
                    icon="facebook"
                    onClick={this.signInWithFacebook}
                  />
                  <Button
                    circular
                    color="twitter"
                    icon="twitter"
                    onClick={this.signInWithTwitter}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  Do not have an account? <Link to="/signup">Sign Up</Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    signInFail: auth.signInFail,
    signInLoading: auth.signInLoading,
    showSignInCaptcha: auth.showSignInCaptcha
  };
};
const mapDispatchToProps = dispatch => {
  return {
    signIn: creds => dispatch(signIn(creds)),
    signInWithGoogle: () => dispatch(signInWithGoogle()),
    signInWithFacebook: () => dispatch(signInWithFacebook()),
    signInWithTwitter: () => dispatch(signInWithTwitter()),
    clearAuthErrors: () => dispatch(clearAuthErrors())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
