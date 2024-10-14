let timer,
  timeoutInterval = 1000;

function handleKeyUp(
  password,
  passwordConfirmation,
  setErrorMessage,
  clearErrors
) {
  window.clearTimeout(timer);

  // Debounce the error validation after the user stops typing
  timer = window.setTimeout(() => {
    if (passwordConfirmation && password !== passwordConfirmation) {
      setErrorMessage("passwordConfirmation", {
        type: "manual",
        message: "Password not matched",
      });
    } else {
      clearErrors("passwordConfirmation");
    }
  }, timeoutInterval);
}

export default handleKeyUp;
