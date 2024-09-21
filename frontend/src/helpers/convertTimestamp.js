function convertTimestamp(timestamp) {
  const currentTime = new Date().getTime() / 1000;
  const updatedTime = new Date(timestamp) / 1000;
  const timeDiff = currentTime - updatedTime;
  if (timeDiff > 60) {
    return Math.floor(timeDiff / 60) + " minutes ago";
  } else if (timeDiff > 3600) {
    return Math.floor(timeDiff / 3600) + " hours ago";
  } else if (timeDiff > 3600 * 24) {
    return Math.floor(timeDiff / (3600 * 24)) + " days ago";
  } else {
    return Math.floor(timeDiff) + " seconds ago";
  }
}

export default convertTimestamp;
