import React, { Component } from "react";
import {
  Container,
  Grid,
  Card,
  Image,
  Icon,
  Button,
  Placeholder,
  Modal,
  Progress,
  Message,
  Transition,
  Form,
  Input,
  Dropdown,
  TextArea,
  Label,
  Breadcrumb
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  changeProfilePicture,
  updatePersonalDetails,
  updateSocialMedia,
  updateHandle
} from "../../store/Actions/profileActions";
import Img from "react-image";
import { image64toCanvasRef, base64StringToFile } from "./ImageUtils";
import ReactCrop from "react-image-crop";
import "./ReactCrop.css";
import { imageValidator } from "../../helpers/validators";
import {
  dateValidator,
  facebookValidator,
  twitterValidator,
  urlValidator,
  handleValidator
} from "../../helpers/validators";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageOriginal: null,
      imageCropped: null,
      openCropModal: false,
      imgSrc: null,
      UI_fileError: null,
      crop: {
        aspect: 1 / 1,
        height: 100,
        width: 100,
        unit: "%"
      },
      name: "",
      email: "",
      handle: "",
      handleValid: false,
      gender: "",
      birthday: "",
      introduction: "",
      websiteLink: "",
      facebookLink: "",
      twitterLink: "",
      introRemain: 350,
      UI_birthdayValid: true,
      UI_nameValid: true,
      UI_facebookValid: true,
      UI_twitterValid: true,
      UI_websiteValid: true,
      UI_handleValid: true,
      UI_handleExists: false
    };
    this.imagePreviewCanvasRef = React.createRef();
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const {
      name,
      email,
      gender,
      birthday,
      introduction,
      websiteLink,
      facebookLink,
      twitterLink
    } = this.props.profile;
    this.setState({
      email: email,
      name: name,
      gender: gender,
      birthday: birthday,
      introduction: introduction,
      websiteLink: websiteLink,
      facebookLink: facebookLink,
      twitterLink: twitterLink,
      introRemain: introduction.length
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.imageUploading === true &&
      this.props.imageUploading === false
    ) {
      this.setState({ openCropModal: false });
    }

    if (prevState.imgSrc === null && this.state.imgSrc !== null) {
      this.setState({ openCropModal: true });
    }

    if (prevProps.handleExists !== this.props.handleExists) {
      this.setState({ UI_handleExists: this.props.handleExists });
    }
  }

  changeProfilePicture = () => {
    if (this.state.imageCropped === null) {
      return;
    }
    this.props.changeProfilePicture(this.state.imageCropped);
    this.setState({
      imageOriginal: null,
      imageCropped: null,
      imgSrc: null,
      crop: {
        aspect: 1 / 1,
        height: 100,
        width: 100,
        unit: "%"
      }
    });
  };

  fileInputRef = React.createRef();

  fileChange = e => {
    e.preventDefault();
    const currentFile = e.target.files[0];
    e.target.value = "";
    if (imageValidator(currentFile.type)) {
      this.setState({ imageOriginal: currentFile, UI_fileError: null });
      const myFileItemReader = new FileReader();
      myFileItemReader.addEventListener(
        "load",
        () => {
          const myResult = myFileItemReader.result;
          this.setState({
            imgSrc: myResult,
            openCropModal: true
          });
        },
        false
      );
      myFileItemReader.readAsDataURL(currentFile);
    } else {
      this.setState({ UI_fileError: "Invalid file type." });
    }
  };

  handleCropModalClose = () => {
    this.setState({
      openCropModal: false,
      imageOriginal: null,
      imageCropped: null,
      imgSrc: null,
      crop: {
        aspect: 1 / 1,
        height: 100,
        width: 100,
        unit: "%"
      }
    });
  };

  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = async (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc, imageOriginal } = this.state;
    await image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
    const base64String = canvasRef.toDataURL(imageOriginal.type);
    const imageCropped = base64StringToFile(base64String, imageOriginal.name);
    this.setState({ imageCropped: imageCropped });
  };

  handleFileInput = e => {
    this.fileInputRef.current.click();
  };

  handleOnChange = (event, callback) => {
    this.setState({ [callback.id]: callback.value });

    if (callback.id === "name") {
      if (callback.value.length <= 0) {
        this.setState({ UI_nameValid: false });
      } else {
        this.setState({ UI_nameValid: true });
      }
    }

    if (callback.id === "facebookLink" && callback.value.length > 0) {
      if (facebookValidator(callback.value)) {
        this.setState({ UI_facebookValid: true });
      } else {
        this.setState({ UI_facebookValid: false });
      }
    } else if (callback.value.length === 0) {
      this.setState({ UI_facebookValid: true });
    }

    if (callback.id === "twitterLink" && callback.value.length > 0) {
      if (twitterValidator(callback.value)) {
        this.setState({ UI_twitterValid: true });
      } else {
        this.setState({ UI_twitterValid: false });
      }
    } else if (callback.value.length === 0) {
      this.setState({ UI_twitterValid: true });
    }

    if (callback.id === "websiteLink" && callback.value.length > 0) {
      if (urlValidator(callback.value)) {
        this.setState({ UI_websiteValid: true });
      } else {
        this.setState({ UI_websiteValid: false });
      }
    } else if (callback.value.length === 0) {
      this.setState({ UI_websiteValid: true });
    }
    if (callback.id === "introduction") {
      if (callback.value.length <= 350) {
        this.setState({
          UI_introductionValid: true,
          introRemain: callback.value.length
        });
      } else {
        this.setState({
          UI_introductionValid: false,
          introRemain: 350,
          introduction: callback.value.slice(0, 350)
        });
      }
    }
  };

  handleOnBlur = e => {
    if (e.target.id === "birthday" && e.target.value.length > 0) {
      if (!dateValidator(this.state.birthday)) {
        this.setState({ UI_birthdayValid: false });
      } else {
        this.setState({ UI_birthdayValid: true });
      }
    }
  };

  checkHandle = (e, callback) => {
    if (callback.id === "handle" && callback.value.length > 0) {
      const lowerHandle = callback.value.toLowerCase();
      if (handleValidator(lowerHandle)) {
        this.setState({
          handleValid: true,
          handle: lowerHandle,
          UI_handleValid: true,
          UI_handleExists: false
        });
      } else {
        this.setState({
          handleValid: false,
          handle: lowerHandle,
          UI_handleValid: false,
          UI_handleExists: false
        });
      }
    } else if (callback.value.length === 0) {
      this.setState({
        handleValid: false,
        UI_handleValid: true,
        handle: callback.value,
        UI_handleExists: false
      });
    }
  };

  updatePersonalDetails = () => {
    const { UI_birthdayValid, UI_nameValid } = this.state;
    if (UI_birthdayValid && UI_nameValid) {
      this.props.updatePersonalDetails(this.state);
    } else {
      alert("invald details");
    }
  };

  updateSocialMedia = () => {
    const { UI_facebookValid, UI_twitterValid, UI_websiteValid } = this.state;
    if (UI_facebookValid && UI_twitterValid && UI_websiteValid) {
      this.props.updateSocialMedia(this.state);
    } else {
      alert("invalid form values");
    }
  };

  updateHandle = () => {
    const { handleValid, handle } = this.state;
    if (this.props.profile.handleChanged === true) {
      alert("handle already changed");
      return;
    }
    if (handleValid) {
      this.props.updateHandle(handle);
    } else {
      alert("handle invalid");
    }
  };

  render() {
    const {
      profile,
      imageUploadProgress,
      imageUploading,
      personalDetailsUpdating,
      socialMediaUpdating,
      handleUpdating
    } = this.props;
    const {
      openCropModal,
      imgSrc,
      crop,
      UI_fileError,
      name,
      email,
      handle,
      gender,
      birthday,
      introduction,
      introRemain,
      UI_birthdayValid,
      UI_nameValid,
      UI_facebookValid,
      UI_twitterValid,
      UI_websiteValid,
      UI_handleValid,
      UI_handleExists,
      websiteLink,
      facebookLink,
      twitterLink,
      handleValid
    } = this.state;
    const genderOptions = [
      {
        key: "Male",
        text: "Male",
        value: "Male"
      },
      {
        key: "Female",
        text: "Female",
        value: "Female"
      },
      {
        key: "Rather not say",
        text: "Rather not say",
        value: "Rather not say"
      }
    ];
    return (
      <Container>
        <Helmet>
          <title>Edit Profile | ReputeU</title>
          <link rel="canonical" href={"https://reputeu.com/edit-profile"} />
        </Helmet>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Breadcrumb>
                <Breadcrumb.Section link as={Link} to="/">
                  Home
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron" />
                <Breadcrumb.Section active>Edit Profile</Breadcrumb.Section>
              </Breadcrumb>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column computer={4} tablet={6} mobile={16} className="mb-14">
              <Card fluid>
                <Card.Content>
                  <Card.Header>Profile Picture</Card.Header>
                </Card.Content>
                <Card.Content className="pl-0 pt-0 pr-0 pb-0">
                  <Img
                    src={profile.photoURL}
                    loader={
                      <Placeholder>
                        <Placeholder.Image square />
                      </Placeholder>
                    }
                    unloader={
                      <Image src="https://react.semantic-ui.com/images/wireframe/square-image.png" />
                    }
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Transition
                    visible={UI_fileError ? true : false}
                    animation="fade down"
                    duration={(1, 200)}
                    unmountOnHide
                  >
                    <Message error className="ml-14 mr-14">
                      <Message.Content>
                        {UI_fileError && UI_fileError}
                      </Message.Content>
                    </Message>
                  </Transition>
                  <Message warning className="mb-14 ml-14 mr-14">
                    <Message.Content>
                      Supported file types are JPEG, JPG and PNG
                    </Message.Content>
                  </Message>
                </Card.Content>
                <Card.Content extra className="pb-0 pr-0 pl-0 pt-0">
                  <Button
                    attached="bottom"
                    color="teal"
                    onClick={this.handleFileInput}
                  >
                    <Icon name="photo" />
                    Change profile picture
                  </Button>
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={this.fileChange}
                  />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column computer={12} tablet={10} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Personal Details</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Form as={Grid.Row}>
                      <Grid.Column computer={16} tablet={16}>
                        <Form.Field>
                          <Form.Input
                            required
                            placeholder="Full name"
                            fluid
                            id="name"
                            label="Name"
                            onChange={this.handleOnChange}
                            value={name}
                            error={!UI_nameValid}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            label="Email"
                            required
                            fluid
                            value={email}
                            readOnly
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Gender</label>
                          <Dropdown
                            placeholder="Select gender"
                            fluid
                            selection
                            options={genderOptions}
                            id="gender"
                            onChange={this.handleOnChange}
                            value={gender}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Form.Input
                            placeholder="DD-MM-YYYY"
                            fluid
                            id="birthday"
                            label="Date of Birth"
                            onChange={this.handleOnChange}
                            onBlur={this.handleOnBlur}
                            value={birthday}
                            error={!UI_birthdayValid}
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Introduction (350 characters max.)</label>
                          <TextArea
                            placeholder="Tell us about yourself"
                            onChange={this.handleOnChange}
                            value={introduction}
                            id="introduction"
                          />
                          <span
                            style={{
                              float: "right",
                              fontSize: "0.9rem",
                              color: "grey"
                            }}
                          >
                            {introRemain}/350
                          </span>
                        </Form.Field>
                      </Grid.Column>
                    </Form>
                  </Grid>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="teal"
                    floated="right"
                    onClick={this.updatePersonalDetails}
                    disabled={
                      personalDetailsUpdating ||
                      !UI_birthdayValid ||
                      !UI_nameValid
                    }
                    loading={personalDetailsUpdating}
                  >
                    Save
                  </Button>
                </Card.Content>
              </Card>
              <Card fluid>
                <Card.Content>
                  <Card.Header>Social Media</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Form as={Grid.Row}>
                      <Grid.Column computer={16} tablet={16}>
                        <Form.Field>
                          <label>Website</label>
                          <Input
                            placeholder="https://www.example.com"
                            fluid
                            id="websiteLink"
                            onChange={this.handleOnChange}
                            value={websiteLink}
                            error={!UI_websiteValid}
                          />
                          <Transition
                            visible={!UI_websiteValid}
                            animation="slide down"
                            duration={200}
                            unmountOnHide
                          >
                            <Label
                              color="red"
                              content="Invalid URL (hint - make sure you have entered the protocol; https:// or http:// )"
                              pointing="above"
                            />
                          </Transition>
                        </Form.Field>
                        <Form.Field>
                          <label>Facebook</label>
                          <Input
                            placeholder="Facebook handle"
                            fluid
                            id="facebookLink"
                            label="https://www.facebook.com/"
                            onChange={this.handleOnChange}
                            value={facebookLink}
                          />
                          <Transition
                            visible={!UI_facebookValid}
                            animation="slide down"
                            duration={200}
                            unmountOnHide
                          >
                            <Label
                              color="red"
                              content="Invalid handle"
                              pointing="above"
                            />
                          </Transition>
                        </Form.Field>
                        <Form.Field>
                          <label>Twitter</label>
                          <Input
                            placeholder="Twitter handle"
                            fluid
                            id="twitterLink"
                            label="https://twitter.com/"
                            onChange={this.handleOnChange}
                            value={twitterLink}
                          />
                          <Transition
                            visible={!UI_twitterValid}
                            animation="slide down"
                            duration={200}
                            unmountOnHide
                          >
                            <Label
                              color="red"
                              content="Invalid handle"
                              pointing="above"
                            />
                          </Transition>
                        </Form.Field>
                      </Grid.Column>
                    </Form>
                  </Grid>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="teal"
                    floated="right"
                    onClick={this.updateSocialMedia}
                    disabled={
                      socialMediaUpdating ||
                      !UI_facebookValid ||
                      !UI_twitterValid ||
                      !UI_websiteValid
                    }
                    loading={socialMediaUpdating}
                  >
                    Save
                  </Button>
                </Card.Content>
              </Card>
              <Card fluid color="red">
                <Card.Content>
                  <Card.Header>Profile Link</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Grid>
                    <Form as={Grid.Row}>
                      <Grid.Column computer={16} tablet={16}>
                        {profile.handleChanged === true ? (
                          <Message error visible>
                            <Message.Content>
                              Cannot edit profile link again because you have
                              changed it previously.
                            </Message.Content>
                          </Message>
                        ) : (
                          <Message info visible>
                            <Message.Content>
                              The profile link can contain a minimum of 6 and a
                              maximum of 16 alphanumeric characters. Also, the
                              handle can only be changed once.
                            </Message.Content>
                          </Message>
                        )}

                        <Message success visible>
                          <Message.Content>
                            Your current profile link is{" "}
                            <Link to={"/ru/" + profile.handle}>
                              https://reputeu.com/ru/{profile.handle}
                            </Link>
                          </Message.Content>
                        </Message>
                        <Form.Field>
                          <Input
                            placeholder="Handle"
                            label="https://reputeu.com/ru/"
                            fluid
                            id="handle"
                            onChange={this.checkHandle}
                            value={handle}
                            loading={handleUpdating}
                            disabled={profile.handleChanged}
                          />
                          <Transition
                            visible={!UI_handleValid}
                            animation="slide down"
                            duration={200}
                            unmountOnHide
                          >
                            <Label
                              color="red"
                              content="Invalid handle"
                              pointing="above"
                            />
                          </Transition>
                          <Transition
                            visible={UI_handleExists}
                            animation="slide down"
                            duration={200}
                            unmountOnHide
                          >
                            <Label
                              color="red"
                              content="Oops. This handle is already taken. Choose another."
                              pointing="above"
                            />
                          </Transition>
                        </Form.Field>
                      </Grid.Column>
                    </Form>
                  </Grid>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="teal"
                    floated="right"
                    onClick={this.updateHandle}
                    disabled={!handleValid || handleUpdating}
                    loading={handleUpdating}
                  >
                    Change
                  </Button>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Transition
          visible={openCropModal}
          animation="zoom"
          duration={(100, 200)}
          unmountOnHide
        >
          <Modal
            open={openCropModal}
            onClose={this.handleCropModalClose}
            closeIcon
            size="small"
          >
            <Modal.Header>
              {imageUploading ? (
                <>
                  <Icon name="upload" /> Uploading...
                </>
              ) : (
                <>
                  <Icon name="crop" /> Crop your image
                </>
              )}
            </Modal.Header>
            <Modal.Content>
              {imgSrc !== null ? (
                <Grid centered>
                  <Grid.Row>
                    <Grid.Column textAlign="center">
                      <ReactCrop
                        src={imgSrc}
                        crop={crop}
                        onChange={this.handleOnCropChange}
                        onImageLoaded={this.handleImageLoaded}
                        onComplete={this.handleOnCropComplete}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : null}
              {imageUploading && (
                <Progress
                  percent={imageUploadProgress}
                  progress
                  size="small"
                  indicating
                  className="mb-0"
                />
              )}
            </Modal.Content>
            <Modal.Actions>
              {imageUploading ? (
                <Button color="teal" disabled loading>
                  <Icon name="upload" /> Upload
                </Button>
              ) : (
                <Button color="teal" onClick={this.changeProfilePicture}>
                  <Icon name="upload" /> Upload
                </Button>
              )}
            </Modal.Actions>
          </Modal>
        </Transition>
        {imgSrc ? (
          <canvas
            ref={this.imagePreviewCanvasRef}
            style={{ width: "100%", visibility: "hidden" }}
          />
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = ({ auth, profile }) => {
  return {
    profile: auth.currentUser,
    imageUploading: profile.imageUploading,
    imageUploadProgress: profile.imageUploadProgress,
    personalDetailsUpdating: profile.personalDetailsUpdating,
    socialMediaUpdating: profile.socialMediaUpdating,
    handleUpdating: profile.handleUpdating,
    handleExists: profile.handleExists
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeProfilePicture: image => dispatch(changeProfilePicture(image)),
    updatePersonalDetails: details => dispatch(updatePersonalDetails(details)),
    updateSocialMedia: details => dispatch(updateSocialMedia(details)),
    updateHandle: handle => dispatch(updateHandle(handle))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
