const hashtagsToInputValue = (hashtags) => {
  if (Array.isArray(hashtags)) {
    return hashtags.join(" ");
  }

  return hashtags || "";
};

export default hashtagsToInputValue;
