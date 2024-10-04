let timer,
  timeoutInterval = 1000;
function handleKeyUp(password, passwordConfirmation, setLoginError) {
  window.clearTimeout(timer);
  timer = window.setTimeout(
    () =>
      setLoginError(() => {
        if (passwordConfirmation && password !== passwordConfirmation) {
          return "Password not matched";
        }
      }),
    timeoutInterval
  );
}

function handleKeyDown(event) {
  window.clearTimeout(timer);
}

export { handleKeyUp, handleKeyDown };
