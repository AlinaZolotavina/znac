import api from "../../../shared/utils/api";

export const photoKeys = {
  all: ["photos"],
  list: ({ page, limit }) => [...photoKeys.all, { page, limit }],
};

export function getPhotosQueryOptions(page = 1, limit = 20) {
  return {
    queryKey: photoKeys.list({ page, limit }),
    queryFn: () => api.getPhotos(page, limit),
  };
}
