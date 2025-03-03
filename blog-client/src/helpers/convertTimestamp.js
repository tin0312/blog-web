function convertTimestamp(timestamp) {
  const currentTime = new Date().getTime();
  const updatedTime = new Date(timestamp).getTime();
  const timeDiff = (currentTime - updatedTime) / 1000
  if (timeDiff >= 86400) {
    return Math.floor(timeDiff / 86400) + " day(s) ago";
  }
  else if (timeDiff >= 3600) {
    return Math.floor(timeDiff / 3600) + " hr(s) ago";
  }
  else if (timeDiff >= 60) {
    return Math.floor(timeDiff / 60) + " min(s) ago";
  }
  else {
    return Math.round(timeDiff) + " second(s) ago";
  }
}
export default convertTimestamp;

