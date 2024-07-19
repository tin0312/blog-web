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
