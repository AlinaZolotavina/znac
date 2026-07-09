export const posts = Array.from({ length: 5 }, (_, index) => ({
  _id: `post-${index + 1}`,
  theme: index % 2 ? "Design" : "React",
  icon: "react",
  title: `Post ${index + 1}`,
  hashtags: ["react"],
  text: "Post text",
}));
