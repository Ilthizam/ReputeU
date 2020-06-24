export const emailValidator = email => {
  // eslint-disable-next-line
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

export const passwordValidator = (password, length) => {
  let parts = {
    hasSimple: false,
    hasCapital: false,
    hasNumber: false,
    hasLength: false,
    passwordValid: false
  };

  if (/\w*[A-Z]\w*/.test(password)) {
    parts.hasCapital = true;
  }

  if (/\w*[a-z]\w*/.test(password)) {
    parts.hasSimple = true;
  }

  if (/\w*[0-9]\w*/.test(password)) {
    parts.hasNumber = true;
  }

  if (password.length >= length) {
    parts.hasLength = true;
  }

  if (
    parts.hasCapital &&
    parts.hasSimple &&
    parts.hasNumber &&
    parts.hasLength
  ) {
    parts.passwordValid = true;
  }

  return parts;
};

export const imageValidator = type => {
  if (type === "image/jpeg" || type === "image/png" || type === "image/jpg") {
    return true;
  } else {
    return false;
  }
};

export const dateValidator = date => {
  if (
    /(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-(19[\d]\d{1}|20[\d]\d{1})/.test(date)
  ) {
    return true;
  } else {
    return false;
  }
};

export const facebookValidator = link => {
  if (/^[a-z\d.]{3,}$/i.test(link)) {
    return true;
  } else {
    return false;
  }
};

export const twitterValidator = link => {
  if (/^@?(\w){1,15}$/i.test(link)) {
    return true;
  } else {
    return false;
  }
};

export const urlValidator = link => {
  if (
    // eslint-disable-next-line
    /^(http:\/\/|https:\/\/)+[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      link
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const handleValidator = handle => {
  if (/^[a-z0-9]{6,16}$/.test(handle)) {
    return true;
  } else {
    return false;
  }
};
