// handle active links
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link, index) => {
  if (index === navLinks.length - 1) return;
  if (link.href === window.location.href) {
    link.classList.add("active-link");
  }
});

const navbar = document.querySelector("ul");
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 100) {
    navbar.classList.add("is-sticky");
  } else {
    navbar.classList.remove("is-sticky");
  }
});

// responsive navigation bar
const mobileNav = document.querySelector(".mobile-nav");
const navIcon = document.querySelector(".nav-icon");
navIcon.addEventListener("click", () => {
  navIcon.classList.toggle("active");
  mobileNav.classList.toggle("hide");
  if (mobileNav.classList.contains("show")) {
    mobileNav.classList.remove("show");
    setTimeout(() => mobileNav.classList.add("hide"), 300); // Hide after transition ends
  } else {
    mobileNav.classList.remove("hide");
    setTimeout(() => mobileNav.classList.add("show"), 10); // Allow time for hide class to be removed
  }
});

// dynamically resize textarea based on input and data passed fron the server
const textarea = document.getElementById("auto-resizing-textarea");
document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("auto-resizing-textarea");

  if (textarea) {
    // Adjust height initially based on the loaded content
    resizeTextarea(textarea);

    // Adjust height dynamically as the user inputs text
    textarea.addEventListener("input", function () {
      resizeTextarea(this);
    });
  }

  function resizeTextarea(element) {
    element.style.height = "auto"; // Reset the height to auto to recalculate
    element.style.height = element.scrollHeight + "px"; // Set the height to match the content
  }
});

// user dropdown
const userProfile = document.querySelector(".user-icon");
const userDropDown = document.querySelector(".user-drop-down");
userProfile.addEventListener("click", () => {
  userDropDown.classList.toggle("hide");
});
