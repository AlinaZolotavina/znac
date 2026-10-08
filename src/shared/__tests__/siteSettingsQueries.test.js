import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  siteSettingsKeys,
  useSiteSettingsQuery,
  useUpdateAccentColorMutation,
  useUpdateHeroImageMutation,
  useUpdateSignupEnabledMutation,
} from "../queries/siteSettingsQueries";
import { mockApi } from "../../test/mockApi";

jest.mock("../utils/api", () => ({
  __esModule: true,
  default: require("../../test/mockApi").mockApi,
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createWrapper(queryClient = createTestQueryClient()) {
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("site settings queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches site settings with stable query key", async () => {
    const siteSettings = {
      heroes: {
        main: null,
        gallery: null,
      },
      auth: {
        signupEnabled: false,
      },
      colors: {
        accent: {
          value: "#c5e7bc",
        },
      },
    };

    mockApi.getSiteSettings.mockResolvedValue(siteSettings);

    const { result } = renderHook(() => useSiteSettingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(siteSettings);
    expect(mockApi.getSiteSettings).toHaveBeenCalledTimes(1);
    expect(siteSettingsKeys.all).toEqual(["site-settings"]);
  });

  test("invalidates site settings after hero image update", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const formData = new FormData();

    mockApi.updateHeroImage.mockResolvedValue({
      filename: "hero.jpg",
    });

    const { result } = renderHook(() => useUpdateHeroImageMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync({
        slot: "main",
        formData,
      });
    });

    expect(mockApi.updateHeroImage).toHaveBeenCalledWith("main", formData);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: siteSettingsKeys.all,
    });
  });

  test("invalidates site settings after signup setting update", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    mockApi.updateSignupEnabled.mockResolvedValue({
      signupEnabled: true,
    });

    const { result } = renderHook(() => useUpdateSignupEnabledMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync(true);
    });

    expect(mockApi.updateSignupEnabled).toHaveBeenCalledWith(true);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: siteSettingsKeys.all,
    });
  });

  test("invalidates site settings after accent color update", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    mockApi.updateAccentColor.mockResolvedValue({
      value: "#aabbcc",
    });

    const { result } = renderHook(() => useUpdateAccentColorMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync("#aabbcc");
    });

    expect(mockApi.updateAccentColor).toHaveBeenCalledWith("#aabbcc");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: siteSettingsKeys.all,
    });
  });
});
