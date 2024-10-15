function validation(values) {
  let error = {};
  const username_pattern = /^[A-Za-z]\w{5,29}$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (values.username === "") {
    error.username = "Username should not be empty";
  } else if (!username_pattern.test(values.username)) {
    error.username = "Invalid username format";
  } else {
    error.username = "";
  }

  if (values.password === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Invalid password format";
  } else {
    error.password = "";
  }

  // Custom validation to disallow certain user levels from logging in
  if (values.level && values.level.toLowerCase() === "petugas") {
    error.level = "Petugas are not allowed to log in";
  }

  return error;
}

export default validation;
