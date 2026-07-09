export const photos = Array.from({ length: 8 }, (_, index) => ({
  _id: `photo-${index + 1}`,
  link: `https://img.test/${index + 1}.jpg`,
  hashtags: [`tag-${index + 1}`],
  views: index,
}));

export const hashtags = [{ _id: "tag-1", name: "travel" }];
