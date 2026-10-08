import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

export const siteSettingsKeys = {
  all: ["site-settings"],
};

export function useSiteSettingsQuery(options = {}) {
  return useQuery({
    queryKey: siteSettingsKeys.all,
    queryFn: () => api.getSiteSettings(),
    ...options,
  });
}

export function useUpdateHeroImageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slot, formData }) => api.updateHeroImage(slot, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteSettingsKeys.all,
      });
    },
  });
}

export function useUpdateSignupEnabledMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled) => api.updateSignupEnabled(enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteSettingsKeys.all,
      });
    },
  });
}

export function useUpdateAccentColorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (color) => api.updateAccentColor(color),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: siteSettingsKeys.all,
      });
    },
  });
}
