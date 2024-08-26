// handle update and delete posts
function handleDelete(postId, buttonElement) {
  fetch(`/delete/${postId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Remove the post element from the DOM
        const postContainer = buttonElement.closest(".post-container");
        postContainer.remove();
      } else {
        console.error("Failed to delete the post");
      }
    })
    .catch((error) => console.error("Error:", error));
}

function startUpdate(postId, buttonElement) {
  const postContainer = buttonElement.closest(".post-container");
  const h3 = postContainer.querySelector("h3");
  const p = postContainer.querySelector("p");
  h3.innerHTML = `<input type="text" name="title" value="${h3.innerText}">`;
  p.innerHTML = `<input type="text" name="body" value="${p.innerText}">`;
  buttonElement.innerText = "Save";
  buttonElement.onclick = () => handleUpdate(postId, buttonElement);
}

function handleUpdate(postId, buttonElement) {
  const postContainer = buttonElement.closest(".post-container");
  const titleInput = postContainer.querySelector('input[name="title"]');
  const bodyInput = postContainer.querySelector('input[name="body"]');

  const updatedPost = {
    title: titleInput.value,
    body: bodyInput.value,
  };

  fetch(`/update/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const h3 = postContainer.querySelector("h3");
        const p = postContainer.querySelector("p");
        h3.innerHTML = updatedPost.title;
        p.innerHTML = updatedPost.body;

        buttonElement.innerText = "Update";
        buttonElement.onclick = () => startUpdate(postId, buttonElement);
      } else {
        console.error("Failed to update the post");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// handle active links
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link, index) => {
  if (index === navLinks.length - 1) return;
  if (link.href === window.location.href) {
    link.classList.add("active-link");
  }
});

// handle sticky navbar
window.addEventListener("load", () => {
  const navbar = document.querySelector("ul");
  let top = navbar.offsetTop;
  function stickyNavbar() {
    if (window.scrollY > top) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }

  window.addEventListener("scroll", stickyNavbar);
});

// /posts/:id to open the post

const post = $(".post-container");
post.on("click", async function () {
  try {
    const postId = $(this).attr("data-id");
    console.log(postId);
    const response = await fetch(`/posts/${postId}`);
    if (response.ok) {
      const postHTML = await response.text();
      $("body").html(postHTML);
    } else {
      console.error("Error loading content from Express server");
    }
  } catch (error) {
    console.log("Error requesting postID page ", error);
  }
});
