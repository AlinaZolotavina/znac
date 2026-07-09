export const projects = Array.from({ length: 4 }, (_, index) => ({
  _id: `project-${index + 1}`,
  title: `Project ${index + 1}`,
  hashtags: index % 2 ? ["design"] : ["react"],
  text: "Project text",
  link: "https://project.test",
}));
