const normalizeHashtags = (hashtags) => {
  const hashtagList = Array.isArray(hashtags) ? hashtags : [hashtags];

  return hashtagList
    .flatMap((hashtag) => String(hashtag || "").split(/[\s,]+/))
    .map((hashtag) => hashtag.replace(/^#/, "").trim())
    .filter(Boolean);
};

export default normalizeHashtags;
