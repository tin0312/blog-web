import { useState } from "react";

function usePasswordToggle() {
  const [passwordType, setPasswordType] = useState("password");
  const [passwordConfirmationType, setPasswordConfirmationType] =
    useState("password");

  function togglePasswordVisibility(dataField) {
    if (dataField === "password") {
      setPasswordType(() =>
        passwordType === "password" ? "text" : "password"
      );
    } else {
      setPasswordConfirmationType(() =>
        passwordConfirmationType === "password" ? "text" : "password"
      );
    }
  }
  return { passwordType, passwordConfirmationType, togglePasswordVisibility };
}

export default usePasswordToggle;
