import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import usePhotos from "../hooks/usePhotos";
import { hashtagKeys } from "../queries/hashtagQueries";
import { photoKeys } from "../queries/photoQueries";
import { mockApi } from "../../../test/mockApi";
import { hashtags, photos } from "../../../test/fixtures/photo";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

function createHashtagsResponse(data = hashtags, overrides = {}) {
  return {
    data,
    page: 1,
    limit: 10,
    total: data.length,
    pages: 1,
    ...overrides,
  };
}

function createDeferred() {
  let resolve;
  let reject;
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function renderUsePhotos(overrides = {}, options = {}) {
  const queryClient = createTestQueryClient();
  const { cachedHashtags, cachedPhotos } = options;

  if (cachedHashtags !== undefined) {
    queryClient.setQueryData(hashtagKeys.all, cachedHashtags);
  }

  if (cachedPhotos !== undefined) {
    queryClient.setQueryData(photoKeys.list({ page: 1, limit: 20 }), cachedPhotos);
  }

  const props = {
    openModal: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    closeAllPopups: jest.fn(),
    screenWidth: 500,
    setScreenWidth: jest.fn(),
    hashtag: "",
    setHashtag: jest.fn(),
    location: { pathname: "/" },
    setIsPhotoPopupOpen: jest.fn(),
    setIsDeletePhotoModalOpen: jest.fn(),
    ...overrides,
  };

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    props,
    queryClient,
    ...renderHook((hookProps) => usePhotos(hookProps), {
      initialProps: props,
      wrapper,
    }),
  };
}

describe("gallery search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPhotos.mockResolvedValue({ data: photos, page: 1, pages: 1 });
    api.findPhoto.mockResolvedValue({
      data: [photos[2]],
      page: 1,
      pages: 1,
    });
  });

  test("searches photos by hashtag and updates hashtag cache without refetching hashtags", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch(" portrait ");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("portrait", 1, 20),
    );
    expect(api.getHashtags).not.toHaveBeenCalled();
    expect(result.current.photosToRender).toEqual([photos[2]]);

    expect(queryClient.getQueryData(hashtagKeys.all)).toEqual({
      ...cachedHashtags,
      data: [
        {
          name: "portrait",
        },
        ...hashtags,
      ],
    });
  });

  test("uses cached initial gallery photos while cache is fresh", async () => {
    const cachedPhotos = {
      data: photos,
      page: 1,
      limit: 20,
      total: photos.length,
      pages: 1,
    };
    const { result } = renderUsePhotos(
      {},
      {
        cachedPhotos,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    expect(api.getPhotos).not.toHaveBeenCalled();
    expect(result.current.hasMorePhotos).toBe(true);
  });

  test("does not update hashtag cache when search has no results", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    api.findPhoto.mockResolvedValueOnce({
      data: [],
      page: 1,
      pages: 1,
    });

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch("missing");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("missing", 1, 20),
    );
    expect(queryClient.getQueryData(hashtagKeys.all)).toEqual(cachedHashtags);
  });

  test("moves an existing hashtag to first position without duplicates case-insensitively", async () => {
    const travel = {
      _id: "tag-1",
      name: "travel",
      createdAt: "2026-09-01T00:00:00.000Z",
    };
    const portrait = {
      _id: "tag-2",
      name: "Portrait",
      createdAt: "2026-09-02T00:00:00.000Z",
    };
    const cachedHashtags = createHashtagsResponse([travel, portrait]);

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch(" portrait ");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("portrait", 1, 20),
    );

    const updatedData = queryClient.getQueryData(hashtagKeys.all).data;
    expect(updatedData).toEqual([portrait, travel]);
    expect(
      updatedData.filter((item) => item.name.toLowerCase() === "portrait"),
    ).toHaveLength(1);
  });

  test("adds a new hashtag to first position and respects current cache limit", async () => {
    const cachedHashtags = createHashtagsResponse(
      [
        { _id: "tag-1", name: "travel" },
        { _id: "tag-2", name: "nature" },
      ],
      {
        limit: 2,
        total: 2,
      },
    );

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch("portrait");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("portrait", 1, 20),
    );

    const updatedData = queryClient.getQueryData(hashtagKeys.all).data;
    expect(updatedData).toEqual([
      { name: "portrait" },
      { _id: "tag-1", name: "travel" },
    ]);
    expect(updatedData).toHaveLength(2);
  });

  test("does not throw when hashtag cache is missing", async () => {
    const { queryClient, result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch("portrait");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("portrait", 1, 20),
    );
    expect(queryClient.getQueryData(hashtagKeys.all)).toBeUndefined();
  });

  test("does not update hashtag cache when search is cleared", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.handleClearPhotoSearch();
    });

    expect(queryClient.getQueryData(hashtagKeys.all)).toEqual(cachedHashtags);
    expect(result.current.photosToRender).toHaveLength(6);
  });

  test("keeps only the latest search response in photos state and hashtag cache", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    const searchA = createDeferred();
    const searchB = createDeferred();
    const alphaPhoto = { ...photos[0], _id: "alpha-photo" };
    const betaPhoto = { ...photos[1], _id: "beta-photo" };

    api.findPhoto.mockImplementation((keyWord) => {
      if (keyWord === "alpha") {
        return searchA.promise;
      }

      return searchB.promise;
    });

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.handlePhotoSearch("alpha");
    });

    act(() => {
      result.current.handlePhotoSearch("beta");
    });

    expect(api.findPhoto).toHaveBeenCalledTimes(2);

    await act(async () => {
      searchB.resolve({
        data: [betaPhoto],
        page: 1,
        pages: 1,
      });
      await searchB.promise;
    });

    await waitFor(() =>
      expect(result.current.photosToRender).toEqual([betaPhoto]),
    );
    expect(result.current.currentPhotosNumber).toBe(1);
    expect(result.current.hasMorePhotos).toBe(false);
    expect(queryClient.getQueryData(hashtagKeys.all).data).toEqual([
      { name: "beta" },
      ...hashtags,
    ]);

    await act(async () => {
      searchA.resolve({
        data: [alphaPhoto, ...photos.slice(0, 5)],
        page: 1,
        pages: 3,
      });
      await searchA.promise;
    });

    expect(result.current.photosToRender).toEqual([betaPhoto]);
    expect(result.current.currentPhotosNumber).toBe(1);
    expect(result.current.hasMorePhotos).toBe(false);
    expect(queryClient.getQueryData(hashtagKeys.all).data).toEqual([
      { name: "beta" },
      ...hashtags,
    ]);
  });

  test("does not restore stale search results after clearing search", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    const searchA = createDeferred();
    const alphaPhoto = { ...photos[0], _id: "alpha-photo" };
    api.findPhoto.mockReturnValue(searchA.promise);

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.handlePhotoSearch("alpha");
    });

    act(() => {
      result.current.handleClearPhotoSearch();
    });

    expect(result.current.photosToRender).toHaveLength(6);

    await act(async () => {
      searchA.resolve({
        data: [alphaPhoto],
        page: 1,
        pages: 1,
      });
      await searchA.promise;
    });

    expect(result.current.photosToRender).toHaveLength(6);
    expect(result.current.photosToRender).not.toEqual([alphaPhoto]);
    expect(queryClient.getQueryData(hashtagKeys.all)).toEqual(cachedHashtags);
  });

  test("deduplicates identical in-flight search requests and still applies the result", async () => {
    const cachedHashtags = createHashtagsResponse(hashtags);
    const search = createDeferred();
    api.findPhoto.mockReturnValue(search.promise);

    const { queryClient, result } = renderUsePhotos(
      {},
      {
        cachedHashtags,
      },
    );

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.handlePhotoSearch("portrait");
    });

    act(() => {
      result.current.handlePhotoSearch("portrait");
    });

    expect(api.findPhoto).toHaveBeenCalledTimes(1);

    await act(async () => {
      search.resolve({
        data: [photos[2]],
        page: 1,
        pages: 1,
      });
      await search.promise;
    });

    await waitFor(() =>
      expect(result.current.photosToRender).toEqual([photos[2]]),
    );
    expect(queryClient.getQueryData(hashtagKeys.all).data).toEqual([
      { name: "portrait" },
      ...hashtags,
    ]);
  });

  test("keeps show more pagination working without search request tokens", async () => {
    const { result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
    expect(api.getPhotos).toHaveBeenCalledWith(1, 20);

    act(() => {
      result.current.showMorePhotos();
    });

    expect(result.current.photosToRender).toHaveLength(8);
    expect(result.current.hasMorePhotos).toBe(false);
  });

  test("keeps initial photo loading working without search request tokens", async () => {
    const { result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    expect(api.getPhotos).toHaveBeenCalledWith(1, 20);
    expect(result.current.hasMorePhotos).toBe(true);
  });

  test("resets filtered photos when leaving gallery page", async () => {
    const { props, result, rerender } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch("portrait");
    });

    await waitFor(() => expect(result.current.photosToRender).toEqual([photos[2]]));

    rerender({
      ...props,
      location: { pathname: "/gallery/addphoto" },
    });

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
    expect(props.setHashtag).toHaveBeenCalledWith("");
  });
});
