function Validation(values) {
  let error = {};
  const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const username_pattern = /^[A-Za-z]\\w{5, 29}$/i;
  const password_pattern = /^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/i;

  //email
  if (values.email === "") {
    error.email = "Username should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Username Didnt Match";
  } else {
    error.email = "";
  }

  //username
  if (values.username === "") {
    error.username = "Username should not be empty";
  } else if (!username_pattern.test(values.username)) {
    error.username = "Username Didnt Match";
  } else {
    error.username = "";
  }

  //password
  if (values.password === "") {
    error.password = "Password Should be Empty";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password didnt Match";
  } else {
    error.password = "";
  }
  return Error;
}
export default Validation;
