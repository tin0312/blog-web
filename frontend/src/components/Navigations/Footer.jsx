import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();
  console.log(currentYear)
  return (
    <footer>
      <p>
        {" "}
        <i></i>@copyright {currentYear} Truong Hoang
      </p>
    </footer>
  );
}

export default Footer;
