import { useQuery } from "@tanstack/react-query";
import api from "../../../shared/utils/api";

export const hashtagKeys = {
  all: ["hashtags"],
};

export function useHashtags() {
  return useQuery({
    queryKey: hashtagKeys.all,
    queryFn: () => api.getHashtags(1, 10),
    staleTime: 60 * 1000,
  });
}
