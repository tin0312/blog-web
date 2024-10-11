import React from "react";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

function Header() {
  return (
    <header>
      <DesktopNav />
      <MobileNav />
    </header>
  );
}

export default Header;
