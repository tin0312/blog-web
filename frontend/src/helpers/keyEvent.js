let timer,
  timeoutInterval = 1000;

function handleKeyUp(password, passwordConfirmation, setErrorMessage) {
  window.clearTimeout(timer);

  // Debounce the error validation after the user stops typing
  timer = window.setTimeout(() => {
    setErrorMessage(() => {
      if (passwordConfirmation && password !== passwordConfirmation) {
        return "Password not matched";
      }
    });
  }, timeoutInterval);
}

export default handleKeyUp;
