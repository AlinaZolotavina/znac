const fixShortWords = (text) => {
  const shortWords = ["I", "a", "it", "in", "on", "at", "to", "is", "of"];
  const regex = new RegExp(`\\b(${shortWords.join("|")})\\s`, "gi");

  return text.replace(regex, (_, word) => word + "\u00A0");
};

export default fixShortWords;
