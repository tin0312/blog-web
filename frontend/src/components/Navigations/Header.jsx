import React from "react";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

function Header() {
  return (
    <header>
      <nav>
        <DesktopNav />
        <MobileNav />
      </nav>
    </header>
  );
}

export default Header;
