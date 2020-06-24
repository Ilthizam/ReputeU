import React, { Component } from "react";
import { connect } from "react-redux";
import {
  signUp,
  signInWithFacebook,
  signInWithGoogle,
  signInWithTwitter,
  clearAuthErrors
} from "../../store/Actions/authActions";
import {
  Container,
  Grid,
  Form,
  Button,
  Header,
  Divider,
  Card,
  Transition,
  Icon,
  Message
} from "semantic-ui-react";
import { emailValidator, passwordValidator } from "../../helpers/validators";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    passwordAgain: "",
    name: "",
    emailValid: false,
    nameValid: false,
    formValid: false,
    hasSimple: false,
    hasCapital: false,
    hasNumber: false,
    hasLength: false,
    passwordValid: false,
    passwordsMatch: false,
    showPasswordGuide: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.clearAuthErrors();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.emailValid !== this.state.emailValid ||
      prevState.passwordValid !== this.state.passwordValid ||
      prevState.nameValid !== this.state.nameValid ||
      prevState.passwordsMatch !== this.state.passwordsMatch
    ) {
      const {
        emailValid,
        passwordValid,
        nameValid,
        passwordsMatch
      } = this.state;
      if (emailValid && passwordValid && nameValid && passwordsMatch) {
        this.setState({ formValid: true });
      } else {
        this.setState({ formValid: false });
      }
    }

    if (
      prevProps.signUpSuccess !== this.props.signUpSuccess &&
      this.props.signUpSuccess === true
    ) {
      this.setState({
        email: "",
        password: "",
        passwordAgain: "",
        name: "",
        emailValid: false,
        nameValid: false,
        formValid: false,
        hasSimple: false,
        hasCapital: false,
        hasNumber: false,
        hasLength: false,
        passwordValid: false,
        passwordsMatch: false,
        showPasswordGuide: false
      });
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

    if (e.target.id === "password") {
      let validate = passwordValidator(e.target.value, 8);
      this.setState({
        hasSimple: validate.hasSimple,
        hasCapital: validate.hasCapital,
        hasLength: validate.hasLength,
        hasNumber: validate.hasNumber,
        passwordValid: validate.passwordValid
      });
      if (
        e.target.value === this.state.passwordAgain &&
        e.target.value.length > 0
      ) {
        this.setState({ passwordsMatch: true });
      } else {
        this.setState({ passwordsMatch: false });
      }
    }

    if (e.target.id === "name") {
      if (e.target.value === "") {
        this.setState({ nameValid: false });
      } else {
        this.setState({ nameValid: true });
      }
    }

    if (e.target.id === "passwordAgain") {
      if (e.target.value === this.state.password && e.target.value.length > 0) {
        this.setState({ passwordsMatch: true });
      } else {
        this.setState({ passwordsMatch: false });
      }
    }
  };

  handleOnSubmit = e => {
    e.preventDefault();
    if (this.state.formValid) {
      this.props.signUp(this.state);
    } else {
      alert("Form invalid");
    }
  };

  handleOnFocus = e => {
    this.setState({ showPasswordGuide: true });
  };

  handleOnBlur = e => {
    this.setState({ showPasswordGuide: false });
  };

  signInWithFacebook = () => {
    this.props.signInWithFacebook();
  };

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
  };

  signInWithTwitter = () => {
    this.props.signInWithTwitter();
  };

  render() {
    const { signUpLoading, signUpFail, signUpSuccess, signInFail } = this.props;
    const {
      password,
      email,
      name,
      passwordAgain,
      formValid,
      showPasswordGuide,
      hasCapital,
      hasLength,
      hasNumber,
      hasSimple,
      passwordsMatch
    } = this.state;

    return (
      <Container>
        <Helmet>
          <title>Sign Up | ReputeU</title>
          <link rel="canonical" href={"https://reputeu.com/signup"} />
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
                    Sign Up
                  </Header>
                </Grid.Column>
              </Grid.Row>

              <Transition
                visible={signUpSuccess === true}
                animation="fade down"
                duration={(1, 200)}
                unmountOnHide
              >
                <Grid.Row className="pb-0">
                  <Grid.Column>
                    <Message positive className="mt-0">
                      Account created successfully. Verify your email address
                      using the email we have sent you and proceed to the Sign
                      In page.
                    </Message>
                  </Grid.Column>
                </Grid.Row>
              </Transition>

              <Transition
                visible={signUpFail ? true : false}
                animation="fade down"
                duration={(1, 200)}
                unmountOnHide
              >
                <Grid.Row className="pb-0">
                  <Grid.Column>
                    <Message negative className="mt-0">
                      {signUpFail ? signUpFail : <>&nbsp;</>}
                    </Message>
                  </Grid.Column>
                </Grid.Row>
              </Transition>

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
                      icon="user"
                      iconPosition="left"
                      placeholder="Name"
                      autoComplete="name"
                      onChange={this.handleOnChange}
                      id="name"
                      value={name}
                    />
                    <Form.Input
                      fluid
                      icon="mail"
                      iconPosition="left"
                      placeholder="E-mail address"
                      autoComplete="email"
                      onChange={this.handleOnChange}
                      id="email"
                      value={email}
                    />
                    <Form.Group widths="equal">
                      <Form.Input
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                        autoComplete="new-password"
                        onChange={this.handleOnChange}
                        onFocus={this.handleOnFocus}
                        onBlur={this.handleOnBlur}
                        id="password"
                        value={password}
                      />
                      <Form.Input
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        onChange={this.handleOnChange}
                        onFocus={this.handleOnFocus}
                        onBlur={this.handleOnBlur}
                        id="passwordAgain"
                        value={passwordAgain}
                      />
                    </Form.Group>

                    <Button
                      color="teal"
                      fluid
                      disabled={!formValid || signUpLoading}
                      loading={signUpLoading}
                    >
                      Create Account
                    </Button>
                  </Form>
                  <label style={{ textAlign: "left" }}>
                    <Transition
                      visible={showPasswordGuide}
                      animation="fade down"
                      duration={200}
                    >
                      <Card fluid className="mb-14">
                        <Card.Content>
                          <Form.Field className="mb-7">
                            <Icon
                              name={hasCapital ? "check" : "close"}
                              color={hasCapital ? "green" : "red"}
                            />
                            Contains at least one capital letter
                          </Form.Field>
                          <Form.Field className="mb-7">
                            <Icon
                              name={hasSimple ? "check" : "close"}
                              color={hasSimple ? "green" : "red"}
                            />
                            Contains at least one simple letter
                          </Form.Field>
                          <Form.Field className="mb-7">
                            <Icon
                              name={hasNumber ? "check" : "close"}
                              color={hasNumber ? "green" : "red"}
                            />
                            Contains at least one number
                          </Form.Field>
                          <Form.Field className="mb-7">
                            <Icon
                              name={hasLength ? "check" : "close"}
                              color={hasLength ? "green" : "red"}
                            />
                            Contains 8 or more characters
                          </Form.Field>
                          <Form.Field>
                            <Icon
                              name={passwordsMatch ? "check" : "close"}
                              color={passwordsMatch ? "green" : "red"}
                            />
                            Both passwords must be the same
                          </Form.Field>
                        </Card.Content>
                      </Card>
                    </Transition>
                  </label>
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
                  Already have an account? <Link to="/signin">Sign in</Link>
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
    signUpLoading: auth.signUpLoading,
    signUpFail: auth.signUpFail ? auth.signUpFail : null,
    signUpSuccess: auth.signUpSuccess ? auth.signUpSuccess : null,
    signInFail: auth.signInFail
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: creds => dispatch(signUp(creds)),
    signInWithGoogle: () => dispatch(signInWithGoogle()),
    signInWithFacebook: () => dispatch(signInWithFacebook()),
    signInWithTwitter: () => dispatch(signInWithTwitter()),
    clearAuthErrors: () => dispatch(clearAuthErrors())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
